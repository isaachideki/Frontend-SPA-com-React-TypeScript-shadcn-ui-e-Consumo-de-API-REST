import type {
  Caminhao,
  CaminhaoApi,
  CaminhaoInput,
  CaminhaoUpdate,
} from "@/types/caminhao";

/** URL base da API (variável VITE_API_URL do arquivo .env), sem barra final. */
export const API_URL: string = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");

/** Formato de erro devolvido pela API: { erro: string, detalhes?: string[] } */
interface ErroApiBody {
  erro?: string;
  detalhes?: string[];
}

export class ApiError extends Error {
  /** Status HTTP (0 quando não houve resposta, ex.: API fora do ar) */
  status: number;
  detalhes: string[];

  constructor(message: string, status: number, detalhes: string[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detalhes = detalhes;
  }
}

async function lerCorpo<T>(resposta: Response): Promise<T | null> {
  const texto = await resposta.text();
  if (!texto) return null;
  try {
    return JSON.parse(texto) as T;
  } catch {
    return null;
  }
}

async function request<T>(caminho: string, init?: RequestInit): Promise<T> {
  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError(
      "Não foi possível conectar à API. Verifique se o backend está em execução.",
      0,
    );
  }

  if (!resposta.ok) {
    const corpo = await lerCorpo<ErroApiBody>(resposta);
    throw new ApiError(
      corpo?.erro ?? `Falha na requisição (HTTP ${resposta.status}).`,
      resposta.status,
      corpo?.detalhes ?? [],
    );
  }

  return (await lerCorpo<T>(resposta)) as T;
}

function normalizar(bruto: CaminhaoApi): Caminhao {
  return { ...bruto, capacidadeCarga: Number(bruto.capacidadeCarga) };
}

export const caminhaoService = {
  /** GET /caminhoes */
  async listar(): Promise<Caminhao[]> {
    const dados = await request<CaminhaoApi[]>("/caminhoes");
    return dados.map(normalizar);
  },

  /** GET /caminhoes/:id */
  async buscar(id: number): Promise<Caminhao> {
    return normalizar(await request<CaminhaoApi>(`/caminhoes/${id}`));
  },

  /** POST /caminhoes */
  async criar(dados: CaminhaoInput): Promise<Caminhao> {
    return normalizar(
      await request<CaminhaoApi>("/caminhoes", {
        method: "POST",
        body: JSON.stringify(dados),
      }),
    );
  },

  /** PUT /caminhoes/:id */
  async atualizar(id: number, dados: CaminhaoUpdate): Promise<Caminhao> {
    return normalizar(
      await request<CaminhaoApi>(`/caminhoes/${id}`, {
        method: "PUT",
        body: JSON.stringify(dados),
      }),
    );
  },

  /** DELETE /caminhoes/:id */
  async excluir(id: number): Promise<void> {
    await request<{ mensagem: string; id: number }>(`/caminhoes/${id}`, {
      method: "DELETE",
    });
  },
};
