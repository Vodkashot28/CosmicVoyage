"""
SpaceAI HTTP API
Exposes /classify and /predict endpoints so the game (Node.js) can call the ML models.

Run:  python src/api.py
Port: 5001  (game runs on 5000)
"""

import json
import traceback
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs

# Lazy-load the predictor so the server starts even before training
_predictor = None


def get_predictor():
    global _predictor
    if _predictor is None:
        from predict import CelestialPredictor
        _predictor = CelestialPredictor()
    return _predictor


def json_response(handler, status: int, payload: dict):
    body = json.dumps(payload).encode()
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json")
    handler.send_header("Content-Length", str(len(body)))
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.end_headers()
    handler.wfile.write(body)


class SpaceAIHandler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print(f"[SpaceAI] {fmt % args}")

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path   = parsed.path
        qs     = parse_qs(parsed.query)

        if path == "/health":
            json_response(self, 200, {"status": "ok", "service": "SpaceAI"})
            return

        if path == "/meta":
            try:
                p = get_predictor()
                json_response(self, 200, p.meta)
            except Exception as e:
                json_response(self, 503, {"error": str(e)})
            return

        if path == "/classify":
            # GET /classify?orbital_period=365&axial_tilt=23.44&mass=5.97e24&radius=6371
            try:
                period = float(qs.get("orbital_period", [365])[0])
                tilt   = float(qs.get("axial_tilt",     [23.44])[0])
                mass   = float(qs.get("mass",            [5.97e24])[0])
                radius = float(qs.get("radius",          [6371])[0])

                p     = get_predictor()
                label = p.predict(period, tilt, mass, radius)
                proba = p.predict_proba(period, tilt, mass, radius)
                json_response(self, 200, {
                    "label":        label,
                    "probabilities": proba,
                    "input": {"orbital_period": period, "axial_tilt": tilt, "mass": mass, "radius": radius},
                })
            except Exception as e:
                json_response(self, 400, {"error": str(e)})
            return

        json_response(self, 404, {"error": "Not found"})

    def do_POST(self):
        parsed = urlparse(self.path)
        path   = parsed.path

        length  = int(self.headers.get("Content-Length", 0))
        raw     = self.rfile.read(length) if length else b"{}"
        try:
            body = json.loads(raw)
        except json.JSONDecodeError:
            json_response(self, 400, {"error": "Invalid JSON"})
            return

        # POST /classify  — single object
        if path == "/classify":
            try:
                period = float(body.get("orbital_period", 365))
                tilt   = float(body.get("axial_tilt",     23.44))
                mass   = float(body.get("mass",            5.97e24))
                radius = float(body.get("radius",          6371))

                p     = get_predictor()
                label = p.predict(period, tilt, mass, radius)
                proba = p.predict_proba(period, tilt, mass, radius)
                json_response(self, 200, {"label": label, "probabilities": proba})
            except Exception as e:
                json_response(self, 400, {"error": str(e), "detail": traceback.format_exc()})
            return

        # POST /classify/batch  — list of objects
        if path == "/classify/batch":
            try:
                records = body.get("objects", [])
                p       = get_predictor()
                labels  = p.predict_batch(records)
                json_response(self, 200, {"labels": labels, "count": len(labels)})
            except Exception as e:
                json_response(self, 400, {"error": str(e)})
            return

        # POST /predict-orbit  — given type + some params, predict missing orbital params
        if path == "/predict-orbit":
            # Lightweight rule-based predictor (ML extension possible later)
            try:
                obj_type = body.get("type", "Planet")
                mass     = float(body.get("mass", 5.97e24))

                # Simple Kepler scaling: T ∝ a^1.5, a ∝ mass^0.4 (rough heuristic)
                import math
                log_mass    = math.log10(max(mass, 1e5))
                est_period  = round(10 ** (log_mass * 0.18 - 1.2), 2)
                est_tilt    = {"Planet": 25, "DwarfPlanet": 60, "Asteroid": 90, "Moon": 10, "Comet": 120}.get(obj_type, 30)

                json_response(self, 200, {
                    "estimated_orbital_period_days": est_period,
                    "estimated_axial_tilt_deg":      est_tilt,
                    "note": "Heuristic estimate — replace with trained regressor for precision",
                })
            except Exception as e:
                json_response(self, 400, {"error": str(e)})
            return

        json_response(self, 404, {"error": "Not found"})


if __name__ == "__main__":
    import sys
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5001
    server = HTTPServer(("0.0.0.0", port), SpaceAIHandler)
    print(f"🌌 SpaceAI API listening on http://0.0.0.0:{port}")
    print("   GET  /health")
    print("   GET  /meta")
    print("   GET  /classify?orbital_period=365&axial_tilt=23&mass=5.97e24&radius=6371")
    print("   POST /classify         { orbital_period, axial_tilt, mass, radius }")
    print("   POST /classify/batch   { objects: [...] }")
    print("   POST /predict-orbit    { type, mass }")
    print("\n   Train first:  python src/train_model.py")
    server.serve_forever()
