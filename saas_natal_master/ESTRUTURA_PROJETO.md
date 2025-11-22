# Estrutura do Projeto SaaS

## 📁 Organização do Monorepo

```
saas_natal_master/
├── apps/
│   ├── api/                    # Backend NestJS
│   │   ├── src/
│   │   │   ├── auth/           # Autenticação (JWT, Local)
│   │   │   ├── contests/       # Gestão de concursos
│   │   │   ├── submissions/    # Gestão de submissões
│   │   │   ├── votes/          # Sistema de votação
│   │   │   ├── categories/     # Categorias/Equipas
│   │   │   ├── organizations/ # Organizações (multi-tenancy)
│   │   │   ├── email/          # Serviço de email
│   │   │   └── prisma/        # Prisma Service
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── web/                    # Frontend Público (Next.js)
│   │   ├── app/
│   │   │   ├── contest/[slug]/ # Página de concurso
│   │   │   └── ...
│   │   ├── components/
│   │   │   └── contest/        # Componentes de concurso
│   │   ├── lib/
│   │   │   └── api/            # Clientes API
│   │   └── package.json
│   │
│   └── admin/                  # Admin Dashboard (Next.js)
│       ├── app/
│       │   └── dashboard/      # Dashboard administrativo
│       └── package.json
│
├── packages/
│   ├── database/               # Prisma Schema
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Schema completo
│   │   │   └── seed.ts         # Seed de dados
│   │   └── package.json
│   │
│   ├── shared/                 # Código partilhado
│   │   ├── src/
│   │   │   ├── types/          # Types TypeScript
│   │   │   ├── utils/          # Funções utilitárias
│   │   │   └── constants/      # Constantes
│   │   └── package.json
│   │
│   └── ui/                     # Componentes UI (futuro)
│
├── docker-compose.yml          # Serviços Docker (PostgreSQL, Redis)
├── turbo.json                  # Configuração Turbo
├── package.json                # Root package.json
├── README.md                   # Documentação principal
└── INSTALLACAO.md             # Guia de instalação
```

## 🗄️ Schema de Base de Dados

### Tabelas Principais

1. **organizations** - Organizações (multi-tenancy)
2. **users** - Utilizadores administrativos
3. **contests** - Concursos
4. **categories** - Categorias/Equipas
5. **submissions** - Submissões/Participações
6. **votes** - Votos
7. **verification_codes** - Códigos de verificação

## 🔧 Módulos Backend (NestJS)

### Auth Module
- JWT Authentication
- Local Strategy (email/password)
- Guards e decorators

### Contests Module
- CRUD de concursos
- Endpoint público por slug
- Filtros e paginação

### Submissions Module
- CRUD de submissões
- Aprovação/rejeição
- Filtros por categoria e ordenação

### Votes Module
- Request verification code
- Submit vote com validação
- Prevenção de votos duplicados

### Categories Module
- CRUD de categorias
- Ordenação por índice

### Organizations Module
- Gestão de organização
- Atualização de settings

## 🎨 Frontend Público (Next.js)

### Páginas
- `/` - Homepage
- `/contest/[slug]` - Página de concurso público

### Componentes
- `ContestHeader` - Cabeçalho do concurso
- `SubmissionGrid` - Grid de submissões
- `SubmissionCard` - Card de submissão
- `VoteModal` - Modal de votação

### Funcionalidades
- Visualização de concursos
- Grid de submissões com paginação
- Sistema de votação com verificação por email
- Filtros e ordenação

## 🔐 Admin Dashboard (Next.js)

### Páginas
- `/dashboard` - Dashboard principal

### Funcionalidades (a implementar)
- Gestão de concursos
- Aprovação de submissões
- Estatísticas e analytics
- Gestão de utilizadores

## 📦 Packages Partilhados

### @contest-saas/database
- Prisma Client
- Schema e migrations
- Seed script

### @contest-saas/shared
- Types TypeScript
- Funções utilitárias
- Constantes

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia todos os serviços

# Base de Dados
npm run db:generate      # Gera Prisma Client
npm run db:migrate       # Executa migrations
npm run db:seed          # Popula base de dados
npm run db:studio        # Abre Prisma Studio

# Build
npm run build            # Constrói todos os projetos
```

## 🔌 Endpoints API Principais

### Autenticação
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil do utilizador

### Concursos
- `GET /api/contests` - Lista concursos (admin)
- `GET /api/contests/public/:slug` - Concurso público
- `POST /api/contests` - Criar concurso
- `PUT /api/contests/:id` - Atualizar concurso
- `DELETE /api/contests/:id` - Eliminar concurso

### Submissões
- `GET /api/submissions/contest/:contestId` - Submissões do concurso
- `POST /api/submissions` - Criar submissão
- `PUT /api/submissions/:id` - Atualizar submissão

### Votos
- `POST /api/votes/request-verification` - Solicitar código
- `POST /api/votes/submit` - Submeter voto

## 🐳 Docker Services

- **PostgreSQL**: Porta 5432
- **Redis**: Porta 6379

## 📝 Próximos Passos

1. ✅ Estrutura base criada
2. ✅ Schema de base de dados
3. ✅ Backend API básico
4. ✅ Frontend público básico
5. ✅ Admin dashboard básico
6. ⏳ Implementar upload de imagens (S3)
7. ⏳ Implementar envio real de emails
8. ⏳ Completar admin dashboard
9. ⏳ Adicionar testes
10. ⏳ Configurar CI/CD

## 📚 Documentação Adicional

- `README.md` - Documentação principal
- `INSTALLACAO.md` - Guia de instalação
- `ANALISE_E_PROPOSTA_SAAS.md` - Análise completa
- `EXEMPLOS_IMPLEMENTACAO.md` - Exemplos de código
- `RESUMO_EXECUTIVO.md` - Resumo executivo

