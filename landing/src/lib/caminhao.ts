import type { StatusCaminhao, TipoCombustivel } from "@/types/caminhao";

export const ROTULO_STATUS: Record<StatusCaminhao, string> = {
  ATIVO: "Ativo",
  MANUTENCAO: "Em manutenção",
  INATIVO: "Inativo",
};

export const ROTULO_COMBUSTIVEL: Record<TipoCombustivel, string> = {
  DIESEL: "Diesel",
  DIESEL_S10: "Diesel S10",
  DIESEL_S500: "Diesel S500",
};

const numero = new Intl.NumberFormat("pt-BR");
const toneladas = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });

export const formatarKm = (km: number): string => `${numero.format(km)} km`;

export const formatarCarga = (t: number): string => `${toneladas.format(t)} t`;

export const formatarNumero = (n: number): string => numero.format(n);

export function formatarData(iso: string): string {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return "—";
  return data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}
