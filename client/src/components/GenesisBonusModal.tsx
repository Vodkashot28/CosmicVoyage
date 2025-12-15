import { Dialog, DialogContent, DialogClose } from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { claimGenesis } from "@/lib/api"; // Now using the SAFE wrapper

// ... (interface definitions) ...

export function GenesisBonusModal({ open, walletAddress, onClaimed }: GenesisBonusModalProps) {
  const [loading, setLoading] = useState(false);

  const handleClaimGenesis = async () => {
    if (!walletAddress) {
      toast.error("Connect wallet first");
      return;
    }

    setLoading(true);
    try {
      // FIX: Use the central, robust API function
      const data = await claimGenesis(walletAddress); 
      
      toast.success("🎉 Genesis bonus claimed! You got 10 STAR!");
      onClaimed(data.starBalance);
    } catch (error) {
      console.error("Genesis claim error:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Failed to claim bonus";

      // Check for the specific '409' status which means 'already claimed'
      if (errorMessage.includes("409")) { 
          toast.error("Genesis bonus already claimed!");
      } else {
          // Show the clean, crash-free error message
          toast.error(errorMessage); 
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-cyan-500/30">
        {/* The DialogClose is now functional on API failure */}
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-slate-900 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-800">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        {/* ... (rest of modal content) ... */}
      </DialogContent>
    </Dialog>
  );
}
