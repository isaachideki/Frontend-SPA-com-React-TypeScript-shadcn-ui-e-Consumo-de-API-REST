import { Link } from "react-router-dom";
import { MapPinOffIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { EstadoMensagem } from "@/components/EstadoMensagem";

export function NotFound() {
  return (
    <Card>
      <EstadoMensagem
        icone={MapPinOffIcon}
        titulo="Página não encontrada"
        descricao="O endereço acessado não existe nesta aplicação."
      >
        <Link to="/" className={buttonVariants()}>
          Ir para o painel
        </Link>
      </EstadoMensagem>
    </Card>
  );
}
