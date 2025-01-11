import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
}

export function ErrorModal({ isOpen, onClose, errorMessage }: ErrorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Erro ao buscar tweets</DialogTitle>
          <DialogDescription>
            Devido às limitações na API do Twitter, não foi possível buscar o
            influencer pelo seguinte motivo:
          </DialogDescription>
        </DialogHeader>
        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      </DialogContent>
    </Dialog>
  );
}
