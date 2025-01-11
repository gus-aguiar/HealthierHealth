"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function TestToastButton() {
  const { toast } = useToast();

  return (
    <Button
      onClick={() => {
        toast({
          title: "Toast de Teste",
          description: "Se você está vendo isso, o toast está funcionando!",
        });
      }}
    >
      Testar Toast
    </Button>
  );
}
