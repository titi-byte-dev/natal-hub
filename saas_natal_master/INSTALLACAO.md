# Guia de Instalação

## Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- **Docker é OPCIONAL** - O projeto usa SQLite por padrão (mais simples!)

## Passos de Instalação

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

O ficheiro `.env` já está configurado para usar SQLite (não precisa de Docker!):

```bash
# O ficheiro apps/api/.env já está configurado com:
# DATABASE_URL=file:../../packages/database/prisma/dev.db
```

**Nota:** Se quiseres usar PostgreSQL em vez de SQLite, podes:
1. Instalar Docker
2. Executar `docker compose up -d`
3. Alterar `DATABASE_URL` no `.env` para: `postgresql://contest:contest_password@localhost:5432/contest_saas`

### 3. Gerar Prisma Client

```bash
npm run db:generate
```

### 4. Criar Base de Dados

```bash
npm run db:push
```

**Nota:** Usamos `db:push` em vez de `db:migrate` para SQLite (mais simples para desenvolvimento).

### 5. Popular Base de Dados (Opcional)

```bash
npm run db:seed
```

### 6. Iniciar Desenvolvimento

```bash
npm run dev
```

Isto iniciará:
- API em http://localhost:3001
- Web (público) em http://localhost:3000
- Admin Dashboard em http://localhost:3002

## Credenciais de Teste

Após executar o seed:
- Email: `admin@demo.com`
- Password: `admin123`

## Troubleshooting

### Erro de conexão à base de dados

**Com SQLite (padrão):**
- Verificar se o ficheiro `packages/database/prisma/dev.db` existe
- Se não existir, executar: `npm run db:push`

**Com PostgreSQL (opcional):**
- Verificar se o Docker está a correr: `docker compose ps`
- Se não estiver, executar: `docker compose up -d`

### Erro de Prisma Client

Regenerar o client:
```bash
npm run db:generate
```

### Portas já em uso

Alterar as portas nos ficheiros `.env` ou `package.json` de cada app.

### Credenciais de teste

Após executar o seed:

Email: admin@demo.com
Password: admin123