import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { toast } from "sonner";

interface EmailVerificationProps {
  open: boolean;
  onVerified: (email: string) => void;
}

export function EmailVerification({ open, onVerified }: EmailVerificationProps) {
  const [step, setStep] = useState<"email" | "verify">("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestVerification = async () => {
    if (!email.includes("@")) {
      toast.error("Invalid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/email/request-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to send verification");
        return;
      }

      // Dev mode: show token directly
      if (data.verificationToken) {
        toast.success(`Token: ${data.verificationToken} (copy for testing)`);
      } else {
        toast.success("Check your email for verification code");
      }

      setStep("verify");
    } catch (error) {
      toast.error("Failed to request verification");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!token) {
      toast.error("Enter verification code");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/email/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to verify email");
        return;
      }

      toast.success("✅ Email verified!");
      onVerified(email);
      setEmail("");
      setToken("");
      setStep("email");
    } catch (error) {
      toast.error("Failed to verify email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-cyan-500/30">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            📧 Verify Email
          </DialogTitle>
          <DialogDescription className="text-center text-slate-300 mt-2">
            {step === "email"
              ? "Enter your email to verify your account (anti-sybil protection)"
              : "Enter the verification code sent to your email"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {step === "email" ? (
            <>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={loading}
                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-500"
              />
              <Button
                onClick={handleRequestVerification}
                disabled={loading || !email}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                {loading ? "Sending..." : "Send Code"}
              </Button>
            </>
          ) : (
            <>
              <div className="text-sm text-slate-400 text-center">
                Verification code sent to <span className="font-bold text-cyan-300">{email}</span>
              </div>
              <Input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter 64-char code"
                disabled={loading}
                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 font-mono text-xs"
              />
              <Button
                onClick={handleVerifyEmail}
                disabled={loading || !token}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setStep("email");
                  setToken("");
                }}
                className="w-full"
              >
                Back
              </Button>
            </>
          )}
        </div>

        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded text-xs text-blue-200">
          <p className="font-bold mb-1">🔒 Why email verification?</p>
          <p>Prevents multiple accounts from claiming genesis bonus (Sybil attack protection)</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
