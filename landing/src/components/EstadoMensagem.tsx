import type { LucideIcon } from "lucide-react";

interface EstadoMensagemProps {
  icone: LucideIcon;
  titulo: string;
  descricao?: string;
  children?: React.ReactNode;
}

/** Bloco centralizado usado nos estados vazio e de erro. */
export function EstadoMensagem({
  icone: Icone,
  titulo,
  descricao,
  children,
}: EstadoMensagemProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icone className="size-6" aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <p className="font-medium text-foreground">{titulo}</p>
        {descricao && (
          <p className="max-w-sm text-sm text-muted-foreground">{descricao}</p>
        )}
      </div>
      {children}
    </div>
  );
}
