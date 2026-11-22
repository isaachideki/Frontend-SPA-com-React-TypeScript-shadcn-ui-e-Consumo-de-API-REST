import { NavLink, Outlet } from "react-router-dom";
import { ExternalLinkIcon, TruckIcon } from "lucide-react";
import { API_URL } from "@/services/api";
import { cn } from "@/lib/utils";

const linkBase =
  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors text-stone-300 hover:bg-white/10 hover:text-white";

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <header className="border-b border-stone-800 bg-stone-900">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <TruckIcon className="size-5" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold tracking-tight text-white">
              Frota de Caminhões - DieselParts
            </span>
          </div>

          <nav aria-label="Navegação principal" className="flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(linkBase, isActive && "bg-white/10 text-white")
              }
            >
              Painel
            </NavLink>
            <a
              href={`${API_URL}/api-docs`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(linkBase, "inline-flex items-center gap-1.5")}
            >
              API (Swagger)
              <ExternalLinkIcon className="size-3.5" aria-hidden="true" />
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        <Outlet />
      </main>

      <footer className="border-t border-stone-200 py-4 text-center text-xs text-stone-500">
        AT2 · LDW · Fatec — React, TypeScript, shadcn/ui e API REST
      </footer>
    </div>
  );
}
