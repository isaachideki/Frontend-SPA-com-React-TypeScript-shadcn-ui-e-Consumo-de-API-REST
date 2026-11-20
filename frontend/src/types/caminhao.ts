export const TIPOS_COMBUSTIVEL = ["DIESEL", "DIESEL_S10", "DIESEL_S500"] as const;
export const STATUS_CAMINHAO = ["ATIVO", "MANUTENCAO", "INATIVO"] as const;

export type TipoCombustivel = (typeof TIPOS_COMBUSTIVEL)[number];
export type StatusCaminhao = (typeof STATUS_CAMINHAO)[number];

/** Caminhão já normalizado para uso na interface. */
export interface Caminhao {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  /** Capacidade de carga em toneladas */
  capacidadeCarga: number;
  quilometragem: number;
  tipoCombustivel: TipoCombustivel;
  status: StatusCaminhao;
  createdAt: string;
  updatedAt: string;
}

/**
 * Formato bruto devolvido pela API: o Sequelize serializa colunas DECIMAL
 * (capacidadeCarga) como string, ex.: "25.50".
 */
export type CaminhaoApi = Omit<Caminhao, "capacidadeCarga"> & {
  capacidadeCarga: number | string;
};

/** Corpo enviado no POST /caminhoes */
export interface CaminhaoInput {
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  capacidadeCarga: number;
  quilometragem: number;
  tipoCombustivel: TipoCombustivel;
  status: StatusCaminhao;
}

/** Corpo enviado no PUT /caminhoes/:id (a API aceita campos parciais) */
export type CaminhaoUpdate = Partial<CaminhaoInput>;
