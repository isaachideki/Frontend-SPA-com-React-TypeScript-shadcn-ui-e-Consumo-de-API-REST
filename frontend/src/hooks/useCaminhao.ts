import { useCallback, useEffect, useState } from "react";
import { ApiError, caminhaoService } from "@/services/api";
import { mensagemDeErro } from "@/lib/erros";
import type { Caminhao } from "@/types/caminhao";

interface Resultado {
  id: number;
  caminhao: Caminhao | null;
  erro: string | null;
  naoEncontrado: boolean;
}

/** Busca um único caminhão (GET /caminhoes/:id). */
export function useCaminhao(id: number) {
  const idValido = Number.isInteger(id) && id > 0;
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    if (!idValido) return;
    let ativo = true;

    caminhaoService
      .buscar(id)
      .then((caminhao) => {
        if (ativo) setResultado({ id, caminhao, erro: null, naoEncontrado: false });
      })
      .catch((e: unknown) => {
        if (ativo) {
          setResultado({
            id,
            caminhao: null,
            erro: mensagemDeErro(e),
            naoEncontrado: e instanceof ApiError && e.status === 404,
          });
        }
      });

    return () => {
      ativo = false;
    };
  }, [id, idValido, tentativa]);

  const recarregar = useCallback(() => {
    setResultado(null);
    setTentativa((t) => t + 1);
  }, []);

  /** Atualiza o caminhão exibido (ex.: depois de uma edição bem-sucedida). */
  const substituir = useCallback((caminhao: Caminhao) => {
    setResultado({ id: caminhao.id, caminhao, erro: null, naoEncontrado: false });
  }, []);

  const atual = resultado?.id === id ? resultado : null;

  return {
    idInvalido: !idValido,
    carregando: idValido && atual === null,
    caminhao: atual?.caminhao ?? null,
    erro: atual?.erro ?? null,
    naoEncontrado: atual?.naoEncontrado ?? false,
    recarregar,
    substituir,
  };
}
