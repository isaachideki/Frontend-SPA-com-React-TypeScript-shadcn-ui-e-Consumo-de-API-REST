import { useCallback, useEffect, useState } from "react";
import { caminhaoService } from "@/services/api";
import { mensagemDeErro } from "@/lib/erros";
import type { Caminhao, CaminhaoInput, CaminhaoUpdate } from "@/types/caminhao";

/** Lista de caminhões + operações de CRUD que mantêm o estado local sincronizado. */
export function useCaminhoes() {
  const [caminhoes, setCaminhoes] = useState<Caminhao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;

    caminhaoService
      .listar()
      .then((dados) => {
        if (ativo) setCaminhoes(dados);
      })
      .catch((e: unknown) => {
        if (ativo) setErro(mensagemDeErro(e));
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [tentativa]);

  const recarregar = useCallback(() => {
    setCarregando(true);
    setErro(null);
    setTentativa((t) => t + 1);
  }, []);

  const criar = useCallback(async (dados: CaminhaoInput): Promise<Caminhao> => {
    const novo = await caminhaoService.criar(dados);
    setCaminhoes((atual) => [...atual, novo]);
    return novo;
  }, []);

  const atualizar = useCallback(
    async (id: number, dados: CaminhaoUpdate): Promise<Caminhao> => {
      const atualizado = await caminhaoService.atualizar(id, dados);
      setCaminhoes((atual) => atual.map((c) => (c.id === id ? atualizado : c)));
      return atualizado;
    },
    [],
  );

  const excluir = useCallback(async (id: number): Promise<void> => {
    await caminhaoService.excluir(id);
    setCaminhoes((atual) => atual.filter((c) => c.id !== id));
  }, []);

  return { caminhoes, carregando, erro, recarregar, criar, atualizar, excluir };
}
