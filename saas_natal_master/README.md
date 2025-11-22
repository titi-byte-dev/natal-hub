# Contest SaaS Platform

Plataforma SaaS moderna para gestão de concursos e votações, construída com tecnologias escaláveis e atuais.

## 🏗️ Arquitetura

Este é um monorepo que contém:

- **apps/api**: Backend NestJS (API RESTful)
- **apps/web**: Frontend Next.js (Páginas públicas)
- **apps/admin**: Admin Dashboard Next.js
- **packages/database**: Schema Prisma e migrations
- **packages/shared**: Código partilhado (types, utils)
- **packages/ui**: Componentes UI partilhados

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- PostgreSQL (ou usar Docker)

### Instalação

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npm run db:generate

# Executar migrations
npm run db:migrate

# Iniciar serviços (Docker)
docker-compose up -d

# Iniciar desenvolvimento
npm run dev
```

### URLs de Desenvolvimento

- **API**: http://localhost:3001
- **Web (Público)**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3002
- **Prisma Studio**: `npm run db:studio`

## 📚 Documentação

Consulte os documentos na raiz do projeto:
- `ANALISE_E_PROPOSTA_SAAS.md` - Análise completa
- `EXEMPLOS_IMPLEMENTACAO.md` - Exemplos de código
- `RESUMO_EXECUTIVO.md` - Resumo executivo

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia todos os serviços em modo desenvolvimento
- `npm run build` - Constrói todos os projetos
- `npm run db:migrate` - Executa migrations do Prisma
- `npm run db:generate` - Gera Prisma Client
- `npm run db:studio` - Abre Prisma Studio
- `npm run db:seed` - Popula base de dados com dados de exemplo

## 📦 Tecnologias

- **Backend**: NestJS, TypeScript, Prisma, PostgreSQL, Redis
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Infraestrutura**: Docker, Docker Compose
- **Autenticação**: JWT, Passport
- **Storage**: AWS S3 (configurável)

## 📄 Licença

Proprietário - Todos os direitos reservados

