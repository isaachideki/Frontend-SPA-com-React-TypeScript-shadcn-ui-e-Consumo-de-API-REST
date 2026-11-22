import { Badge } from "@/components/ui/badge";
import { ROTULO_STATUS } from "@/lib/caminhao";
import { cn } from "@/lib/utils";
import type { StatusCaminhao } from "@/types/caminhao";

const ESTILO: Record<StatusCaminhao, string> = {
  ATIVO: "border-emerald-300 bg-emerald-50 text-emerald-700",
  MANUTENCAO: "border-amber-300 bg-amber-50 text-amber-800",
  INATIVO: "border-slate-300 bg-slate-100 text-slate-600",
};

export function StatusBadge({ status }: { status: StatusCaminhao }) {
  return (
    <Badge variant="outline" className={cn(ESTILO[status])}>
      {ROTULO_STATUS[status]}
    </Badge>
  );
}
