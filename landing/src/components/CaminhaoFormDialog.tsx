import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { ROTULO_COMBUSTIVEL, ROTULO_STATUS } from "@/lib/caminhao";
import {
  STATUS_CAMINHAO,
  TIPOS_COMBUSTIVEL,
  type Caminhao,
  type CaminhaoInput,
  type StatusCaminhao,
  type TipoCombustivel,
} from "@/types/caminhao";

/** Valores dos campos do formulário (inputs controlados trabalham com string). */
interface FormValores {
  placa: string;
  marca: string;
  modelo: string;
  ano: string;
  capacidadeCarga: string;
  quilometragem: string;
  tipoCombustivel: TipoCombustivel;
  status: StatusCaminhao;
}

type FormErros = Partial<Record<keyof FormValores, string>>;

const ANO_ATUAL = new Date().getFullYear();

const VALORES_INICIAIS: FormValores = {
  placa: "",
  marca: "",
  modelo: "",
  ano: String(ANO_ATUAL),
  capacidadeCarga: "",
  quilometragem: "0",
  tipoCombustivel: "DIESEL_S10",
  status: "ATIVO",
};

const normalizarPlaca = (valor: string): string =>
  valor.toUpperCase().replace(/[^A-Z0-9]/g, "");

function valoresDe(caminhao: Caminhao | null): FormValores {
  if (!caminhao) return VALORES_INICIAIS;
  return {
    placa: caminhao.placa,
    marca: caminhao.marca,
    modelo: caminhao.modelo,
    ano: String(caminhao.ano),
    capacidadeCarga: String(caminhao.capacidadeCarga),
    quilometragem: String(caminhao.quilometragem),
    tipoCombustivel: caminhao.tipoCombustivel,
    status: caminhao.status,
  };
}

/** Mesmas regras de validação da API (AT1), para avisar o usuário antes do envio. */
function validar(v: FormValores): FormErros {
  const erros: FormErros = {};

  // Aceita placa antiga (ABC1234) e Mercosul (ABC1D23)
  if (!/^[A-Z]{3}\d[A-Z0-9]\d{2}$/.test(normalizarPlaca(v.placa))) {
    erros.placa = "Informe uma placa válida com 7 caracteres (ex.: ABC1D23).";
  }

  const marca = v.marca.trim();
  if (marca.length < 2 || marca.length > 60) {
    erros.marca = "A marca deve ter entre 2 e 60 caracteres.";
  }

  const modelo = v.modelo.trim();
  if (modelo.length < 2 || modelo.length > 80) {
    erros.modelo = "O modelo deve ter entre 2 e 80 caracteres.";
  }

  const ano = Number(v.ano);
  if (!/^\d+$/.test(v.ano.trim()) || ano < 1950 || ano > 2100) {
    erros.ano = "Informe um ano inteiro entre 1950 e 2100.";
  }

  const carga = Number(v.capacidadeCarga.replace(",", "."));
  if (v.capacidadeCarga.trim() === "" || !Number.isFinite(carga) || carga <= 0) {
    erros.capacidadeCarga = "A capacidade deve ser um número maior que zero.";
  } else if (carga > 99999999.99) {
    erros.capacidadeCarga = "Capacidade acima do limite permitido.";
  }

  const km = Number(v.quilometragem);
  if (!/^\d+$/.test(v.quilometragem.trim()) || km > 2147483647) {
    erros.quilometragem = "A quilometragem deve ser um inteiro maior ou igual a zero.";
  }

  return erros;
}

function paraPayload(v: FormValores): CaminhaoInput {
  return {
    placa: normalizarPlaca(v.placa),
    marca: v.marca.trim(),
    modelo: v.modelo.trim(),
    ano: Number(v.ano),
    capacidadeCarga: Number(v.capacidadeCarga.replace(",", ".")),
    quilometragem: Number(v.quilometragem),
    tipoCombustivel: v.tipoCombustivel,
    status: v.status,
  };
}

interface CampoProps {
  id: string;
  rotulo: string;
  erro?: string;
  children: React.ReactNode;
  className?: string;
}

function Campo({ id, rotulo, erro, children, className }: CampoProps) {
  return (
    <div className={className}>
      <div className="grid gap-1.5">
        <Label htmlFor={id}>{rotulo}</Label>
        {children}
        {erro && (
          <p id={`${id}-erro`} role="alert" className="text-xs text-destructive">
            {erro}
          </p>
        )}
      </div>
    </div>
  );
}

interface FormProps {
  caminhao: Caminhao | null;
  onSalvar: (dados: CaminhaoInput) => Promise<boolean>;
  onCancelar: () => void;
}

function CaminhaoForm({ caminhao, onSalvar, onCancelar }: FormProps) {
  const [valores, setValores] = useState<FormValores>(() => valoresDe(caminhao));
  const [erros, setErros] = useState<FormErros>({});
  const [enviando, setEnviando] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    const campo = name as keyof FormValores;
    setValores((atual) => ({
      ...atual,
      [campo]: campo === "placa" ? value.toUpperCase() : value,
    }));
    setErros((atual) => ({ ...atual, [campo]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (enviando) return;

    const encontrados = validar(valores);
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    setEnviando(true);
    try {
      await onSalvar(paraPayload(valores));
    } finally {
      setEnviando(false);
    }
  }

  const aria = (campo: keyof FormValores) => ({
    "aria-invalid": erros[campo] ? true : undefined,
    "aria-describedby": erros[campo] ? `${campo}-erro` : undefined,
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo id="placa" rotulo="Placa" erro={erros.placa}>
          <Input
            id="placa"
            name="placa"
            value={valores.placa}
            onChange={handleChange}
            placeholder="ABC1D23"
            maxLength={8}
            autoComplete="off"
            className="font-mono uppercase"
            {...aria("placa")}
          />
        </Campo>

        <Campo id="ano" rotulo="Ano" erro={erros.ano}>
          <Input
            id="ano"
            name="ano"
            type="number"
            inputMode="numeric"
            value={valores.ano}
            onChange={handleChange}
            min={1950}
            max={2100}
            {...aria("ano")}
          />
        </Campo>

        <Campo id="marca" rotulo="Marca" erro={erros.marca}>
          <Input
            id="marca"
            name="marca"
            value={valores.marca}
            onChange={handleChange}
            placeholder="Scania"
            maxLength={60}
            {...aria("marca")}
          />
        </Campo>

        <Campo id="modelo" rotulo="Modelo" erro={erros.modelo}>
          <Input
            id="modelo"
            name="modelo"
            value={valores.modelo}
            onChange={handleChange}
            placeholder="R 450"
            maxLength={80}
            {...aria("modelo")}
          />
        </Campo>

        <Campo id="capacidadeCarga" rotulo="Capacidade de carga (t)" erro={erros.capacidadeCarga}>
          <Input
            id="capacidadeCarga"
            name="capacidadeCarga"
            type="number"
            inputMode="decimal"
            step="0.1"
            min={0}
            value={valores.capacidadeCarga}
            onChange={handleChange}
            placeholder="25.5"
            {...aria("capacidadeCarga")}
          />
        </Campo>

        <Campo id="quilometragem" rotulo="Quilometragem (km)" erro={erros.quilometragem}>
          <Input
            id="quilometragem"
            name="quilometragem"
            type="number"
            inputMode="numeric"
            min={0}
            value={valores.quilometragem}
            onChange={handleChange}
            {...aria("quilometragem")}
          />
        </Campo>

        <Campo id="tipoCombustivel" rotulo="Combustível">
          <NativeSelect
            id="tipoCombustivel"
            name="tipoCombustivel"
            value={valores.tipoCombustivel}
            onChange={handleChange}
          >
            {TIPOS_COMBUSTIVEL.map((tipo) => (
              <option key={tipo} value={tipo}>
                {ROTULO_COMBUSTIVEL[tipo]}
              </option>
            ))}
          </NativeSelect>
        </Campo>

        <Campo id="status" rotulo="Status">
          <NativeSelect
            id="status"
            name="status"
            value={valores.status}
            onChange={handleChange}
          >
            {STATUS_CAMINHAO.map((s) => (
              <option key={s} value={s}>
                {ROTULO_STATUS[s]}
              </option>
            ))}
          </NativeSelect>
        </Campo>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancelar} disabled={enviando}>
          Cancelar
        </Button>
        <Button type="submit" disabled={enviando}>
          {enviando && <Loader2Icon className="animate-spin" aria-hidden="true" />}
          {caminhao ? "Salvar alterações" : "Cadastrar caminhão"}
        </Button>
      </DialogFooter>
    </form>
  );
}

interface CaminhaoFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Caminhão em edição; `null` para um novo cadastro */
  caminhao: Caminhao | null;
  /** Deve devolver `true` quando salvou (o modal fecha) ou `false` em caso de erro */
  onSalvar: (dados: CaminhaoInput) => Promise<boolean>;
}

export function CaminhaoFormDialog({
  open,
  onOpenChange,
  caminhao,
  onSalvar,
}: CaminhaoFormDialogProps) {
  async function salvar(dados: CaminhaoInput): Promise<boolean> {
    const ok = await onSalvar(dados);
    if (ok) onOpenChange(false);
    return ok;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{caminhao ? "Editar caminhão" : "Novo caminhão"}</DialogTitle>
          <DialogDescription>
            {caminhao
              ? `Altere os dados do caminhão ${caminhao.placa}.`
              : "Preencha os dados para cadastrar um caminhão na frota."}
          </DialogDescription>
        </DialogHeader>
        <CaminhaoForm
          key={caminhao?.id ?? "novo"}
          caminhao={caminhao}
          onSalvar={salvar}
          onCancelar={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
