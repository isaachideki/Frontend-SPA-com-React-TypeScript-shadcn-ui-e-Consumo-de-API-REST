# Frontend SPA com React, TypeScript, shadcn/ui e Consumo de API REST

Aplicação web SPA desenvolvida com React e TypeScript, utilizando componentes da biblioteca shadcn/ui e integração com uma API REST para gerenciamento de caminhões.

O projeto permite realizar operações CRUD (Create, Read, Update e Delete), consumindo os dados disponibilizados pelo backend.

## Tecnologias utilizadas

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- Lucide React

### Backend
- Node.js
- Express
- TypeScript
- Sequelize ORM
- PostgreSQL
- Swagger / OpenAPI

## Estrutura do projeto

```text
Frontend-SPA/
│
├── backend/
│   ├── src/
│   ├── migrations/
│   ├── .env.example
│   └── package.json
│
├── landing/
│   ├── src/
│   ├── public/
│   ├── .env.example
│   └── package.json
│
├── LICENSE
└── README.md
```

## Requisitos

Antes de iniciar, certifique-se de possuir:

- Node.js (recomendado: versão 22 LTS).
- npm.
- PostgreSQL.
- Git.

## 1. Clonar o repositório

Abra o terminal e execute:

```bash
git clone https://github.com/isaachideki/Frontend-SPA-com-React-TypeScript-shadcn-ui-e-Consumo-de-API-REST.git
```

Entre na pasta do projeto:

```bash
cd Frontend-SPA-com-React-TypeScript-shadcn-ui-e-Consumo-de-API-REST
```

## 2. Configurar o Backend

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

### Configurar variáveis de ambiente

Crie um arquivo chamado `.env` dentro da pasta `backend`, utilizando o `.env.example` como referência.

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
DB_SSL=false
```

Altere `DB_PASSWORD` para a senha configurada no seu PostgreSQL.

Certifique-se de que o PostgreSQL esteja em execução e que o banco de dados informado exista.

### Executar as migrations

```bash
npm run db:migrate
```

### Iniciar o servidor

Para iniciar em modo de desenvolvimento:

```bash
npm run dev
```

O backend estará disponível em:

- API: http://localhost:3000
- Swagger: http://localhost:3000/api-docs
- Health Check: http://localhost:3000/health

## 3. Configurar o Frontend

Abra um novo terminal, mantendo o backend em execução.

A partir da pasta raiz do projeto, execute:

```bash
cd landing
```

Instale as dependências:

```bash
npm install
```

### Configurar variáveis de ambiente

Crie um arquivo `.env` dentro da pasta `landing`:

```env
VITE_API_URL=http://localhost:3000
```

Essa variável define o endereço da API REST consumida pelo frontend.

### Iniciar a aplicação

```bash
npm run dev
```

O frontend estará disponível em:

http://localhost:5173

## 4. Executar o projeto

Para utilizar a aplicação corretamente, mantenha os dois servidores em execução simultaneamente.

| Serviço | Endereço |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3000 |
| Swagger | http://localhost:3000/api-docs |
| Health Check | http://localhost:3000/health |

## 5. Scripts disponíveis

### Backend

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o backend em desenvolvimento |
| `npm run build` | Compila o TypeScript |
| `npm start` | Executa a versão compilada |
| `npm run db:migrate` | Executa as migrations |
| `npm run db:migrate:undo` | Desfaz a última migration |

### Frontend

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor Vite |
| `npm run build` | Gera a versão de produção |
| `npm run lint` | Executa a análise estática |
| `npm run preview` | Visualiza a versão compilada |



## Autor

**Isaac Hideki Shiokawa**

Projeto acadêmico desenvolvido para a atividade avaliativa de Laboratório de Desenvolvimento Web (LDW).

---

Desenvolvido com React, TypeScript, Node.js e PostgreSQL.
