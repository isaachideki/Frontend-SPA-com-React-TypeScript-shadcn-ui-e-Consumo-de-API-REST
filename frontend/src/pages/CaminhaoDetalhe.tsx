import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeftIcon,
  PencilIcon,
  RefreshCwIcon,
  ServerCrashIcon,
  TruckIcon,
  Trash2Icon,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CaminhaoFormDialog } from "@/components/CaminhaoFormDialog";
import { EstadoMensagem } from "@/components/EstadoMensagem";
import { ExcluirCaminhaoDialog } from "@/components/ExcluirCaminhaoDialog";
import { StatusBadge } from "@/components/StatusBadge";
import { useCaminhao } from "@/hooks/useCaminhao";
import {
  ROTULO_COMBUSTIVEL,
  formatarCarga,
  formatarData,
  formatarKm,
} from "@/lib/caminhao";
import { notificarErro } from "@/lib/erros";
import { cn } from "@/lib/utils";
import { caminhaoService } from "@/services/api";
import type { Caminhao, CaminhaoInput } from "@/types/caminhao";

function Voltar() {
  return (
    <Link
      to="/"
      className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2")}
    >
      <ArrowLeftIcon aria-hidden="true" />
      Voltar ao painel
    </Link>
  );
}

function Item({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <dt className="text-xs text-muted-foreground">{rotulo}</dt>
      <dd className="font-medium">{children}</dd>
    </div>
  );
}

export function CaminhaoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { idInvalido, carregando, caminhao, erro, naoEncontrado, recarregar, substituir } =
    useCaminhao(Number(id));

  const [formAberto, setFormAberto] = useState(false);
  const [excluir, setExcluir] = useState<Caminhao | null>(null);

  async function salvar(dados: CaminhaoInput): Promise<boolean> {
    if (!caminhao) return false;
    try {
      const atualizado = await caminhaoService.atualizar(caminhao.id, dados);
      substituir(atualizado);
      toast.success(`Caminhão ${atualizado.placa} atualizado com sucesso.`);
      return true;
    } catch (e) {
      notificarErro("Não foi possível atualizar o caminhão.", e);
      return false;
    }
  }

  async function confirmarExclusao(alvo: Caminhao): Promise<boolean> {
    try {
      await caminhaoService.excluir(alvo.id);
      toast.success(`Caminhão ${alvo.placa} excluído com sucesso.`);
      navigate("/");
      return true;
    } catch (e) {
      notificarErro("Não foi possível excluir o caminhão.", e);
      return false;
    }
  }

  if (idInvalido || naoEncontrado) {
    return (
      <div className="space-y-4">
        <Voltar />
        <Card>
          <EstadoMensagem
            icone={TruckIcon}
            titulo="Caminhão não encontrado"
            descricao="Esse registro não existe ou já foi removido da frota."
          />
        </Card>
      </div>
    );
  }

  if (carregando) {
    return (
      <div className="space-y-4" role="status" aria-label="Carregando caminhão">
        <Voltar />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (erro || !caminhao) {
    return (
      <div className="space-y-4">
        <Voltar />
        <Card>
          <EstadoMensagem
            icone={ServerCrashIcon}
            titulo="Não foi possível carregar o caminhão"
            descricao={erro ?? undefined}
          >
            <Button variant="outline" onClick={recarregar}>
              <RefreshCwIcon aria-hidden="true" />
              Tentar novamente
            </Button>
          </EstadoMensagem>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Voltar />

      <Card>
        <CardHeader className="gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="space-y-1">
            <CardTitle className="flex flex-wrap items-center gap-2 text-xl">
              <span className="font-mono">{caminhao.placa}</span>
              <StatusBadge status={caminhao.status} />
            </CardTitle>
            <CardDescription>
              {caminhao.marca} {caminhao.modelo} · {caminhao.ano}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setFormAberto(true)}>
              <PencilIcon aria-hidden="true" />
              Editar
            </Button>
            <Button variant="destructive" onClick={() => setExcluir(caminhao)}>
              <Trash2Icon aria-hidden="true" />
              Excluir
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Item rotulo="Marca">{caminhao.marca}</Item>
            <Item rotulo="Modelo">{caminhao.modelo}</Item>
            <Item rotulo="Ano">{caminhao.ano}</Item>
            <Item rotulo="Capacidade de carga">{formatarCarga(caminhao.capacidadeCarga)}</Item>
            <Item rotulo="Quilometragem">{formatarKm(caminhao.quilometragem)}</Item>
            <Item rotulo="Combustível">{ROTULO_COMBUSTIVEL[caminhao.tipoCombustivel]}</Item>
            <Item rotulo="Cadastrado em">{formatarData(caminhao.createdAt)}</Item>
            <Item rotulo="Última atualização">{formatarData(caminhao.updatedAt)}</Item>
            <Item rotulo="ID do registro">#{caminhao.id}</Item>
          </dl>
        </CardContent>
      </Card>

      <CaminhaoFormDialog
        open={formAberto}
        onOpenChange={setFormAberto}
        caminhao={caminhao}
        onSalvar={salvar}
      />

      <ExcluirCaminhaoDialog
        caminhao={excluir}
        onCancelar={() => setExcluir(null)}
        onConfirmar={confirmarExclusao}
      />
    </div>
  );
}
