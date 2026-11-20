import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CircleCheckIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchXIcon,
  ServerCrashIcon,
  TruckIcon,
  WrenchIcon,
  PowerOffIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { CaminhaoFormDialog } from "@/components/CaminhaoFormDialog";
import { CaminhaoTable, CaminhaoTableSkeleton } from "@/components/CaminhaoTable";
import { EstadoMensagem } from "@/components/EstadoMensagem";
import { ExcluirCaminhaoDialog } from "@/components/ExcluirCaminhaoDialog";
import { useCaminhoes } from "@/hooks/useCaminhoes";
import { formatarCarga, formatarNumero } from "@/lib/caminhao";
import { notificarErro } from "@/lib/erros";
import type { Caminhao, CaminhaoInput } from "@/types/caminhao";

interface MetricaProps {
  titulo: string;
  valor: string;
  detalhe: string;
  icone: LucideIcon;
  carregando: boolean;
}

function Metrica({ titulo, valor, detalhe, icone: Icone, carregando }: MetricaProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription className="flex items-center justify-between">
          {titulo}
          <Icone className="size-4" aria-hidden="true" />
        </CardDescription>
        {carregando ? (
          <Skeleton className="mt-1 h-8 w-16" />
        ) : (
          <CardTitle className="text-2xl font-semibold tabular-nums group-data-[size=sm]/card:text-2xl">{valor}</CardTitle>
        )}
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">{detalhe}</CardContent>
    </Card>
  );
}

export function Dashboard() {
  const { caminhoes, carregando, erro, recarregar, criar, atualizar, excluir } =
    useCaminhoes();

  const [formAberto, setFormAberto] = useState(false);
  const [emEdicao, setEmEdicao] = useState<Caminhao | null>(null);
  const [paraExcluir, setParaExcluir] = useState<Caminhao | null>(null);
  const [busca, setBusca] = useState("");

  const metricas = useMemo(() => {
    const porStatus = (status: Caminhao["status"]) =>
      caminhoes.filter((c) => c.status === status).length;
    return {
      total: caminhoes.length,
      ativos: porStatus("ATIVO"),
      manutencao: porStatus("MANUTENCAO"),
      inativos: porStatus("INATIVO"),
      cargaTotal: caminhoes.reduce((soma, c) => soma + c.capacidadeCarga, 0),
    };
  }, [caminhoes]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return caminhoes;
    return caminhoes.filter((c) =>
      [c.placa, c.marca, c.modelo].some((campo) => campo.toLowerCase().includes(termo)),
    );
  }, [caminhoes, busca]);

  function abrirNovo() {
    setEmEdicao(null);
    setFormAberto(true);
  }

  function abrirEdicao(caminhao: Caminhao) {
    setEmEdicao(caminhao);
    setFormAberto(true);
  }

  async function salvar(dados: CaminhaoInput): Promise<boolean> {
    try {
      if (emEdicao) {
        const atualizado = await atualizar(emEdicao.id, dados);
        toast.success(`Caminhão ${atualizado.placa} atualizado com sucesso.`);
      } else {
        const criado = await criar(dados);
        toast.success(`Caminhão ${criado.placa} cadastrado com sucesso.`);
      }
      return true;
    } catch (e) {
      notificarErro(
        emEdicao ? "Não foi possível atualizar o caminhão." : "Não foi possível cadastrar o caminhão.",
        e,
      );
      return false;
    }
  }

  async function confirmarExclusao(caminhao: Caminhao): Promise<boolean> {
    try {
      await excluir(caminhao.id);
      toast.success(`Caminhão ${caminhao.placa} excluído com sucesso.`);
      setParaExcluir(null);
      return true;
    } catch (e) {
      notificarErro("Não foi possível excluir o caminhão.", e);
      return false;
    }
  }

  function renderListagem() {
    if (carregando) return <CaminhaoTableSkeleton />;

    if (erro) {
      return (
        <EstadoMensagem
          icone={ServerCrashIcon}
          titulo="Não foi possível carregar a frota"
          descricao={erro}
        >
          <Button variant="outline" onClick={recarregar}>
            <RefreshCwIcon aria-hidden="true" />
            Tentar novamente
          </Button>
        </EstadoMensagem>
      );
    }

    if (caminhoes.length === 0) {
      return (
        <EstadoMensagem
          icone={TruckIcon}
          titulo="Nenhum caminhão cadastrado"
          descricao="Sua frota está vazia. Cadastre o primeiro caminhão para começar."
        >
          <Button onClick={abrirNovo}>
            <PlusIcon aria-hidden="true" />
            Cadastrar caminhão
          </Button>
        </EstadoMensagem>
      );
    }

    if (filtrados.length === 0) {
      return (
        <EstadoMensagem
          icone={SearchXIcon}
          titulo="Nenhum resultado"
          descricao={`Nenhum caminhão corresponde a “${busca.trim()}”.`}
        >
          <Button variant="outline" onClick={() => setBusca("")}>
            Limpar busca
          </Button>
        </EstadoMensagem>
      );
    }

    return (
      <CaminhaoTable
        caminhoes={filtrados}
        onEditar={abrirEdicao}
        onExcluir={setParaExcluir}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
            Painel da frota
          </h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe, cadastre e mantenha os caminhões da sua operação.
          </p>
        </div>
        <Button onClick={abrirNovo}>
          <PlusIcon aria-hidden="true" />
          Novo caminhão
        </Button>
      </div>

      <section aria-label="Resumo da frota" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metrica
          titulo="Total de caminhões"
          valor={formatarNumero(metricas.total)}
          detalhe={`Capacidade total: ${formatarCarga(metricas.cargaTotal)}`}
          icone={TruckIcon}
          carregando={carregando}
        />
        <Metrica
          titulo="Ativos"
          valor={formatarNumero(metricas.ativos)}
          detalhe="Disponíveis para operar"
          icone={CircleCheckIcon}
          carregando={carregando}
        />
        <Metrica
          titulo="Em manutenção"
          valor={formatarNumero(metricas.manutencao)}
          detalhe="Parados para revisão ou reparo"
          icone={WrenchIcon}
          carregando={carregando}
        />
        <Metrica
          titulo="Inativos"
          valor={formatarNumero(metricas.inativos)}
          detalhe="Fora de operação"
          icone={PowerOffIcon}
          carregando={carregando}
        />
      </section>

      <Card>
        <CardHeader className="gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <CardTitle>Caminhões cadastrados</CardTitle>
            <CardDescription>
              {carregando || erro
                ? "Dados da API REST"
                : `${formatarNumero(filtrados.length)} de ${formatarNumero(caminhoes.length)} registro(s)`}
            </CardDescription>
          </div>
          <Input
            type="search"
            value={busca}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBusca(e.target.value)}
            placeholder="Buscar por placa, marca ou modelo"
            aria-label="Buscar caminhões"
            className="sm:w-72"
            disabled={carregando || caminhoes.length === 0}
          />
        </CardHeader>
        <CardContent className="px-0">{renderListagem()}</CardContent>
      </Card>

      <CaminhaoFormDialog
        open={formAberto}
        onOpenChange={setFormAberto}
        caminhao={emEdicao}
        onSalvar={salvar}
      />

      <ExcluirCaminhaoDialog
        caminhao={paraExcluir}
        onCancelar={() => setParaExcluir(null)}
        onConfirmar={confirmarExclusao}
      />
    </div>
  );
}
