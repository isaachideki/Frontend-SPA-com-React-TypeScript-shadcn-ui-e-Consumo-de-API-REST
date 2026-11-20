import { Link } from "react-router-dom";
import { EyeIcon, PencilIcon, Trash2Icon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/StatusBadge";
import {
  ROTULO_COMBUSTIVEL,
  formatarCarga,
  formatarKm,
} from "@/lib/caminhao";
import { cn } from "@/lib/utils";
import type { Caminhao } from "@/types/caminhao";

interface CaminhaoTableProps {
  caminhoes: Caminhao[];
  onEditar: (caminhao: Caminhao) => void;
  onExcluir: (caminhao: Caminhao) => void;
}

export function CaminhaoTable({ caminhoes, onEditar, onExcluir }: CaminhaoTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="pl-4">Placa</TableHead>
          <TableHead>Veículo</TableHead>
          <TableHead className="text-right">Ano</TableHead>
          <TableHead className="text-right">Capacidade</TableHead>
          <TableHead className="text-right">Quilometragem</TableHead>
          <TableHead>Combustível</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="pr-4 text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {caminhoes.map((c) => (
          <TableRow key={c.id}>
            <TableCell className="pl-4 font-mono font-medium">{c.placa}</TableCell>
            <TableCell>
              <span className="font-medium">{c.marca}</span>{" "}
              <span className="text-muted-foreground">{c.modelo}</span>
            </TableCell>
            <TableCell className="text-right tabular-nums">{c.ano}</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatarCarga(c.capacidadeCarga)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatarKm(c.quilometragem)}
            </TableCell>
            <TableCell>{ROTULO_COMBUSTIVEL[c.tipoCombustivel]}</TableCell>
            <TableCell>
              <StatusBadge status={c.status} />
            </TableCell>
            <TableCell className="pr-4">
              <div className="flex justify-end gap-1">
                <Link
                  to={`/caminhoes/${c.id}`}
                  aria-label={`Ver detalhes do caminhão ${c.placa}`}
                  title="Ver detalhes"
                  className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
                >
                  <EyeIcon />
                </Link>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Editar caminhão ${c.placa}`}
                  title="Editar"
                  onClick={() => onEditar(c)}
                >
                  <PencilIcon />
                </Button>
                <Button
                  variant="destructive"
                  size="icon-sm"
                  aria-label={`Excluir caminhão ${c.placa}`}
                  title="Excluir"
                  onClick={() => onExcluir(c)}
                >
                  <Trash2Icon />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/** Esqueleto exibido enquanto a listagem carrega. */
export function CaminhaoTableSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Carregando caminhões"
      className="space-y-3 p-4"
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
      <span className="sr-only">Carregando caminhões…</span>
    </div>
  );
}
