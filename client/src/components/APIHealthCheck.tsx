
import { useEffect, useState } from "react";
import { checkHealth } from "@/lib/api";
import { Badge } from "./ui/badge";

export function APIHealthCheck() {
  const [status, setStatus] = useState<"checking" | "connected" | "error">("checking");

  useEffect(() => {
    const check = async () => {
      try {
        await checkHealth();
        setStatus("connected");
      } catch (error) {
        console.error("API health check failed:", error);
        setStatus("error");
      }
    };

    check();
    const interval = setInterval(check, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  if (status === "checking") return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge variant={status === "connected" ? "default" : "destructive"}>
        {status === "connected" ? "🟢 API Connected" : "🔴 API Error"}
      </Badge>
    </div>
  );
}
