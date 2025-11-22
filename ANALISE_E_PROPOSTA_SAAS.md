# Análise e Proposta de Modernização para SaaS
## Sistema de Concurso/Votação - Conversão para SaaS Escalável

---

## 📋 Análise do Sistema Atual

### Tecnologias Utilizadas
- **Backend**: Grav CMS (PHP flat-file CMS)
- **Frontend**: Twig templates, Tailwind CSS, Alpine.js
- **Armazenamento**: Ficheiros YAML/JSON (flat-file)
- **Email**: Sistema básico de envio de emails
- **Autenticação**: Sistema simples de verificação por email

### Funcionalidades Principais
1. **Upload de Participações**: Utilizadores podem fazer upload de imagens (árvores de Natal)
2. **Sistema de Votação**: 
   - Verificação de email com código
   - Limite de 3 votos por pessoa
   - Prevenção de votos duplicados
   - Prevenção de auto-voto
3. **Gestão de Conteúdo**:
   - Filtros por equipa/categoria
   - Ordenação (data, nome, likes)
   - Paginação
4. **Administração**: Painel básico para aprovar/publicar participações

### Limitações Atuais
- ❌ **Escalabilidade**: Armazenamento em ficheiros não escala
- ❌ **Multi-tenancy**: Não suporta múltiplas empresas
- ❌ **Performance**: Queries em ficheiros são lentas
- ❌ **Concorrência**: Problemas com escrita simultânea em ficheiros
- ❌ **Backup/Recovery**: Difícil fazer backups consistentes
- ❌ **API**: Não tem API estruturada
- ❌ **Segurança**: Autenticação básica, sem JWT/OAuth
- ❌ **Monitorização**: Sem métricas ou logging estruturado

---

## 🎯 Proposta de Arquitetura Moderna

### Stack Tecnológico Recomendado

#### **Backend (API)**
- **Node.js + TypeScript** ou **Python (FastAPI/Django)** ou **Go**
  - **Recomendação**: Node.js + TypeScript (melhor ecossistema, mais fácil encontrar developers)
- **Framework**: Express.js / NestJS ou FastAPI
- **Base de Dados**: PostgreSQL (principal) + Redis (cache/sessões)
- **ORM**: Prisma (Node.js) ou SQLAlchemy (Python)
- **Autenticação**: JWT + OAuth2
- **Validação**: Zod (TypeScript) ou Pydantic (Python)

#### **Frontend**
- **React** ou **Vue.js 3** (com TypeScript)
- **Framework**: Next.js (React) ou Nuxt.js (Vue) para SSR/SSG
- **UI Components**: Tailwind CSS + shadcn/ui ou Headless UI
- **State Management**: Zustand ou Pinia
- **API Client**: React Query / TanStack Query ou Axios

#### **Infraestrutura**
- **Containerização**: Docker + Docker Compose
- **Orquestração**: Kubernetes (produção) ou Docker Swarm
- **CI/CD**: GitHub Actions ou GitLab CI
- **Cloud Provider**: AWS, Google Cloud, ou Azure
- **CDN**: Cloudflare ou AWS CloudFront
- **Storage**: AWS S3 / Google Cloud Storage para imagens
- **Email**: SendGrid, AWS SES, ou Resend
- **Monitorização**: Sentry (erros), Datadog/New Relic (APM)
- **Logging**: ELK Stack ou CloudWatch

---

## 🏗️ Arquitetura Proposta

### 1. Arquitetura de Microserviços (Recomendada para Escala)

```
┌─────────────────────────────────────────────────────────────┐
│                        CDN / Load Balancer                    │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌───────▼────────┐  ┌───────▼────────┐
│   Frontend     │  │   API Gateway  │  │   Admin Panel │
│   (Next.js)    │  │   (Kong/Nginx) │  │   (Next.js)   │
└───────┬────────┘  └───────┬────────┘  └───────┬────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌───────▼────────┐  ┌───────▼────────┐
│  Auth Service  │  │  Contest API   │  │  Upload Service│
│  (JWT/OAuth)   │  │  (Core Logic)  │  │  (S3/Storage)  │
└───────┬────────┘  └───────┬────────┘  └───────┬────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌───────▼────────┐  ┌───────▼────────┐
│  PostgreSQL    │  │     Redis      │  │   S3/Storage   │
│  (Primary DB)  │  │   (Cache/Sess) │  │   (Images)     │
└────────────────┘  └────────────────┘  └────────────────┘
```

### 2. Arquitetura Monolítica Modular (Mais Simples, Boa para Começar)

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
│  - Public Pages (Contest View)                              │
│  - Admin Dashboard                                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            │
┌─────────────────────────────────────────────────────────────┐
│              Backend API (NestJS/Express)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Auth Module  │  │ Contest      │  │ Upload       │      │
│  │              │  │ Module       │  │ Module       │      │
│  │ - JWT        │  │ - Submissions│  │ - S3 Upload  │      │
│  │ - OAuth2     │  │ - Voting     │  │ - Processing │      │
│  │ - Email      │  │ - Results    │  │ - CDN        │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌───────▼────────┐  ┌───────▼────────┐
│  PostgreSQL    │  │     Redis      │  │   S3/Storage   │
│  (Primary DB)  │  │   (Cache/Sess) │  │   (Images)     │
└────────────────┘  └────────────────┘  └────────────────┘
```

**Recomendação**: Começar com arquitetura monolítica modular e evoluir para microserviços quando necessário.

---

## 📊 Modelo de Dados (PostgreSQL)

### Schema Principal

```sql
-- Organizações (Multi-tenancy)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    domain VARCHAR(255),
    logo_url TEXT,
    settings JSONB DEFAULT '{}',
    subscription_tier VARCHAR(50) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Utilizadores (Admin/Staff)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin', -- admin, moderator, viewer
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(organization_id, email)
);

-- Concursos (Cada organização pode ter múltiplos concursos)
CREATE TABLE contests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    voting_start_date TIMESTAMP,
    voting_end_date TIMESTAMP,
    max_votes_per_user INTEGER DEFAULT 3,
    allow_self_vote BOOLEAN DEFAULT false,
    require_email_verification BOOLEAN DEFAULT true,
    status VARCHAR(50) DEFAULT 'draft', -- draft, active, ended, archived
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(organization_id, slug)
);

-- Categorias/Equipas
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contest_id UUID REFERENCES contests(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(contest_id, slug)
);

-- Submissões (Participações)
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contest_id UUID REFERENCES contests(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    participant_name VARCHAR(255) NOT NULL,
    participant_email VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    image_thumbnail_url TEXT,
    description TEXT,
    vote_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Votos
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contest_id UUID REFERENCES contests(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    voter_email VARCHAR(255) NOT NULL,
    verification_code VARCHAR(10),
    is_verified BOOLEAN DEFAULT false,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(contest_id, submission_id, voter_email)
);

-- Códigos de Verificação
CREATE TABLE verification_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contest_id UUID REFERENCES contests(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para Performance
CREATE INDEX idx_submissions_contest ON submissions(contest_id);
CREATE INDEX idx_submissions_category ON submissions(category_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_vote_count ON submissions(vote_count DESC);
CREATE INDEX idx_votes_contest_email ON votes(contest_id, voter_email);
CREATE INDEX idx_votes_submission ON votes(submission_id);
CREATE INDEX idx_verification_codes_email ON verification_codes(email, contest_id);
```

---

## 🔐 Sistema de Autenticação e Autorização

### Para Organizações (Admin)
- **JWT Tokens**: Acesso à API e admin panel
- **OAuth2**: Login com Google/Microsoft (opcional)
- **Role-Based Access Control (RBAC)**: admin, moderator, viewer
- **API Keys**: Para integrações externas

### Para Participantes (Público)
- **Email Verification**: Código enviado por email
- **Rate Limiting**: Prevenir spam/abuso
- **IP Tracking**: Detecção de votos duplicados
- **CAPTCHA**: reCAPTCHA v3 ou hCaptcha

---

## 🚀 Funcionalidades SaaS

### 1. Multi-tenancy
- Cada organização tem o seu próprio espaço isolado
- Subdomínios personalizados (ex: `empresa.seudominio.pt`)
- Domínios personalizados (ex: `concurso.empresa.pt`)
- Branding personalizado (logo, cores, textos)

### 2. Planos de Subscrição
- **Free**: 1 concurso, 50 submissões, funcionalidades básicas
- **Pro**: 5 concursos, 500 submissões, branding personalizado
- **Enterprise**: Ilimitado, suporte prioritário, API dedicada

### 3. Dashboard Administrativo
- Gestão de concursos
- Aprovação/rejeição de submissões
- Estatísticas e analytics
- Exportação de dados
- Gestão de utilizadores da organização

### 4. API Pública
- RESTful API ou GraphQL
- Documentação (Swagger/OpenAPI)
- Rate limiting por organização
- Webhooks para eventos

---

## 📱 Frontend Moderno

### Páginas Públicas
- **Landing Page**: Apresentação do concurso
- **Submissão**: Formulário de upload
- **Galeria**: Grid de participações com filtros
- **Votação**: Interface de votação
- **Resultados**: Página de vencedores

### Admin Dashboard
- **Dashboard**: Visão geral e estatísticas
- **Concursos**: CRUD de concursos
- **Submissões**: Gestão e aprovação
- **Votos**: Visualização e análise
- **Configurações**: Branding, domínios, integrações

### Tecnologias Frontend
- **Next.js 14+**: SSR/SSG, App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **shadcn/ui**: Componentes reutilizáveis
- **React Query**: Data fetching e cache
- **Zustand**: State management
- **React Hook Form**: Formulários
- **Zod**: Validação de schemas

---

## 🔧 Implementação Técnica

### Estrutura de Projeto Recomendada

```
contest-saas/
├── apps/
│   ├── web/              # Frontend Next.js (Público)
│   ├── admin/            # Admin Dashboard Next.js
│   └── api/              # Backend API (NestJS/Express)
├── packages/
│   ├── database/         # Prisma schema e migrations
│   ├── shared/           # Código partilhado (types, utils)
│   └── ui/               # Componentes UI partilhados
├── infrastructure/
│   ├── docker/           # Dockerfiles
│   ├── kubernetes/       # K8s manifests
│   └── terraform/        # IaC (opcional)
├── docs/                 # Documentação
└── scripts/              # Scripts de deploy, etc.
```

### Stack Específico Recomendado

#### Backend
```json
{
  "dependencies": {
    "@nestjs/core": "^10.0.0",
    "@nestjs/common": "^10.0.0",
    "@nestjs/jwt": "^10.0.0",
    "@nestjs/passport": "^10.0.0",
    "@prisma/client": "^5.0.0",
    "bcrypt": "^5.1.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "aws-sdk": "^2.1500.0",
    "nodemailer": "^6.9.0",
    "redis": "^4.6.0"
  }
}
```

#### Frontend
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "typescript": "^5.2.0",
    "tailwindcss": "^3.3.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@radix-ui/react-*": "latest"
  }
}
```

---

## 📈 Escalabilidade

### Estratégias
1. **Horizontal Scaling**: Múltiplas instâncias da API
2. **Database**: Read replicas, connection pooling
3. **Caching**: Redis para queries frequentes
4. **CDN**: Cloudflare/AWS CloudFront para assets estáticos
5. **Image Optimization**: Thumbnails, WebP, lazy loading
6. **Queue System**: Bull/BullMQ para tarefas assíncronas (emails, processamento de imagens)

### Performance
- **API Response Time**: < 200ms (p95)
- **Image Upload**: Processamento assíncrono
- **Database Queries**: Otimizadas com índices
- **Frontend**: Code splitting, lazy loading

---

## 🔒 Segurança

### Medidas
1. **HTTPS**: Obrigatório (Let's Encrypt)
2. **Rate Limiting**: Por IP e por organização
3. **Input Validation**: Sanitização de todos os inputs
4. **SQL Injection**: ORM com prepared statements
5. **XSS Protection**: Content Security Policy
6. **CORS**: Configuração restritiva
7. **Secrets Management**: Variáveis de ambiente, AWS Secrets Manager
8. **Backup**: Backups automáticos diários
9. **GDPR Compliance**: Gestão de dados pessoais conforme RGPD

---

## 📊 Monitorização e Observabilidade

### Ferramentas
- **Error Tracking**: Sentry
- **APM**: Datadog, New Relic, ou Grafana Cloud
- **Logging**: Winston/Pino + ELK Stack
- **Metrics**: Prometheus + Grafana
- **Uptime Monitoring**: UptimeRobot, Pingdom

### Métricas Importantes
- Taxa de erro da API
- Tempo de resposta
- Taxa de conversão (submissões/votos)
- Utilização de recursos
- Custos por organização

---

## 💰 Modelo de Negócio

### Planos de Subscrição
1. **Free**: Até 1 concurso, 50 submissões
2. **Starter**: €29/mês - 3 concursos, 200 submissões
3. **Pro**: €99/mês - 10 concursos, 1000 submissões, branding
4. **Enterprise**: Preço sob consulta - Ilimitado, suporte dedicado

### Funcionalidades Premium
- Domínio personalizado
- Branding completo
- API dedicada
- Webhooks
- Exportação avançada
- Suporte prioritário

---

## 🗺️ Roadmap de Migração

### Fase 1: MVP (2-3 meses)
- [ ] Setup da infraestrutura base
- [ ] Migração do schema de base de dados
- [ ] API básica (CRUD de concursos, submissões, votos)
- [ ] Frontend público básico
- [ ] Sistema de autenticação
- [ ] Upload de imagens para S3

### Fase 2: Multi-tenancy (1-2 meses)
- [ ] Sistema de organizações
- [ ] Isolamento de dados
- [ ] Subdomínios personalizados
- [ ] Admin dashboard básico

### Fase 3: Funcionalidades Avançadas (2-3 meses)
- [ ] Planos de subscrição
- [ ] Branding personalizado
- [ ] Analytics e relatórios
- [ ] API pública documentada
- [ ] Webhooks

### Fase 4: Escala e Otimização (contínuo)
- [ ] Otimização de performance
- [ ] Escalabilidade horizontal
- [ ] Monitorização avançada
- [ ] Funcionalidades adicionais baseadas em feedback

---

## 🛠️ Ferramentas de Desenvolvimento

### Desenvolvimento
- **IDE**: VS Code
- **Version Control**: Git + GitHub/GitLab
- **Package Manager**: npm/yarn/pnpm
- **Linting**: ESLint + Prettier
- **Testing**: Jest, Vitest, Playwright

### DevOps
- **CI/CD**: GitHub Actions
- **Containerização**: Docker
- **Orquestração**: Kubernetes (produção)
- **IaC**: Terraform (opcional)
- **Monitoring**: Grafana + Prometheus

---

## 📝 Conclusão

Esta proposta transforma o sistema atual num SaaS moderno, escalável e pronto para o mercado português. A arquitetura proposta permite:

✅ **Escalabilidade**: Suporta crescimento de utilizadores e dados
✅ **Multi-tenancy**: Cada empresa tem o seu espaço isolado
✅ **Performance**: Base de dados relacional, caching, CDN
✅ **Segurança**: Autenticação robusta, validação, rate limiting
✅ **Manutenibilidade**: Código modular, TypeScript, testes
✅ **Experiência do Utilizador**: Interface moderna e responsiva
✅ **Monetização**: Planos de subscrição claros

**Próximos Passos**:
1. Validar a proposta com stakeholders
2. Criar protótipo/MVP
3. Testar com clientes piloto
4. Iterar baseado em feedback
5. Lançar versão beta

---

## 📚 Recursos Adicionais

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [AWS Architecture Best Practices](https://aws.amazon.com/architecture/)
- [GDPR Compliance Guide](https://gdpr.eu/)

