import { toast } from "sonner";
import { ApiError } from "@/services/api";

/** Texto principal + detalhes de validação (quando a API os envia). */
export function descreverErro(erro: unknown): { titulo: string; detalhes?: string } {
  if (erro instanceof ApiError) {
    return {
      titulo: erro.message,
      detalhes: erro.detalhes.length ? erro.detalhes.join(" ") : undefined,
    };
  }
  return { titulo: "Ocorreu um erro inesperado." };
}

export function mensagemDeErro(erro: unknown): string {
  const { titulo, detalhes } = descreverErro(erro);
  return detalhes ? `${titulo} ${detalhes}` : titulo;
}

/** Exibe um toast de erro com o contexto da operação. */
export function notificarErro(contexto: string, erro: unknown): void {
  const { titulo, detalhes } = descreverErro(erro);
  toast.error(contexto, { description: detalhes ? `${titulo} ${detalhes}` : titulo });
}
