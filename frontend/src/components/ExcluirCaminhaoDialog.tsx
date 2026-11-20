import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Caminhao } from "@/types/caminhao";

interface ExcluirCaminhaoDialogProps {
  /** Caminhão a excluir; `null` mantém o modal fechado */
  caminhao: Caminhao | null;
  onCancelar: () => void;
  /** Deve devolver `true` quando excluiu (o modal fecha) */
  onConfirmar: (caminhao: Caminhao) => Promise<boolean>;
}

export function ExcluirCaminhaoDialog({
  caminhao,
  onCancelar,
  onConfirmar,
}: ExcluirCaminhaoDialogProps) {
  const [excluindo, setExcluindo] = useState(false);

  async function confirmar() {
    if (!caminhao || excluindo) return;
    setExcluindo(true);
    try {
      await onConfirmar(caminhao);
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <Dialog
      open={caminhao !== null}
      onOpenChange={(aberto) => {
        if (!aberto && !excluindo) onCancelar();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Excluir caminhão?</DialogTitle>
          <DialogDescription>
            {caminhao
              ? `O caminhão ${caminhao.placa} (${caminhao.marca} ${caminhao.modelo}) será removido permanentemente. Esta ação não pode ser desfeita.`
              : ""}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancelar} disabled={excluindo}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={confirmar} disabled={excluindo}>
            {excluindo && <Loader2Icon className="animate-spin" aria-hidden="true" />}
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
