import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, X } from 'lucide-react';

export default function RejectDialog({ open, onClose, challengerName, onReject, onSkip }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-[#2d1b4e] to-[#1e1e1e] border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-[#ff6b9d]" />
            Change Challenge?
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-base pt-4">
            {challengerName}, do you want to:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          <Button
            onClick={onReject}
            size="lg"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-semibold"
          >
            <X className="w-5 h-5 mr-2" />
            Reject & Draw New (-1 point penalty)
          </Button>
          <Button
            onClick={onSkip}
            size="lg"
            className="w-full bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 py-6 text-lg font-semibold"
          >
            Skip by Mutual Agreement (no penalty)
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full text-white hover:text-gray-300 font-medium"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}