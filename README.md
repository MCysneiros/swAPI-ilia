# SWAPI Next.js Application

Uma experiência moderna para explorar os recursos públicos da Star Wars API (SWAPI) com Next.js 15, React 19 RC e uma camada robusta de dados. A aplicação entrega navegação fluida, estados ricos de UI e testes em todos os níveis.

Live demo (Vercel): https://sw-api-ilia.vercel.app/

## ✨ Destaques

- Exploração completa dos planetas da SWAPI com home hero e cartões de destaque atualizados em tempo real.
- Lista com busca, paginação, skeletons e sincronização de parâmetros na URL para preservar filtros e navegação do usuário.
- Página de detalhes que agrega filmes e residentes com carregamento progressivo e estados de erro dedicados.
- Tema claro/escuro persistido, animações suaves com Framer Motion e feedback visual através de toasts (Sonner).
- Camada de dados resiliente: interceptors Axios, React Query com placeholders, prefetch e políticas de cache específicas por recurso.
- Testes unitários, de hooks e E2E com MSW, Vitest e Playwright garantem confiança nas evoluções.

## 🚀 Stack Tecnológica

### Framework & Linguagem

- **Next.js 15** (App Router + Server/Client Components)
- **React 19 RC** com hidratação progressiva
- **TypeScript** com modo `strict`

### UI e Experiência

- **Tailwind CSS** com tokens utilitários e animações via `tailwindcss-animate`
- **Radix UI / shadcn** para componentes acessíveis
- **Framer Motion** para animações (`FadeIn`, `StaggerChildren`)
- **lucide-react** para ícones
- **next-themes** + **Sonner** para tema persistente e toasts

### Dados & Estado

- **TanStack Query 5** para cache e sincronização com a SWAPI
- **Axios** (instância tipada em `src/lib/api/client.ts`) e `fetch` para rotas server-side
- **Zod** para validação de variáveis de ambiente (`src/lib/env.ts`)
- Hooks utilitários (`useQueryParams`, `useUrlSync`, `useDebounce`, `usePagination`)

### Qualidade e Produtividade

- **ESLint** + **Prettier** + **lint-staged**
- **Husky** com hook de `pre-commit`
- **Vitest** + **@testing-library/react** + **MSW**
- **Playwright** para E2E cross-browser

## 📁 Arquitetura

### Estrutura de diretórios

```text
src/
├── app/
│   ├── [id]/
│   │   └── page.tsx       # detalhes de planeta
│   ├── globals.css        # estilos globais
│   ├── layout.tsx         # layout raiz com Providers
│   ├── not-found.tsx      # fallback 404
│   └── page.tsx           # listagem principal de planetas
├── components/
│   ├── animations/        # wrappers Framer Motion
│   ├── layout/            # Header, Footer, MainLayout
│   ├── loading/           # skeletons dedicados
│   ├── shared/            # EmptyState, Pagination, etc.
│   ├── ui/                # primitives shadcn/ui
│   ├── theme-provider.tsx # provider de tema
│   └── theme-toggle.tsx   # toggle light/dark
├── constants/             # configs de API e chaves de cache
├── features/
│   └── planets/
│       ├── api/           # cliente SWAPI e helpers
│       ├── components/    # UI específica de planetas
│       └── hooks/         # React Query + prefetch
├── hooks/
│   ├── __tests__/         # testes unitários dos hooks genéricos
│   ├── index.ts           # barrel exports
│   └── use*.ts            # sincronização de URL, debounce, etc.
├── lib/
│   ├── __tests__/         # specs dos utils
│   ├── api/               # instância Axios tipada
│   ├── env.ts             # validação das variáveis de ambiente
│   ├── providers.tsx      # QueryClient + ThemeProvider globais
│   └── utils.ts           # helpers compartilhados
├── test/
│   ├── mocks/             # handlers MSW, fixtures e server
│   ├── setup.ts           # bootstrap do Vitest
│   └── utils.tsx          # utilitários de render
└── types/                 # contratos compartilhados (API, domínio)
```

### Módulos em foco

- `src/app`: rotas App Router, tema global e composição com `<Providers />`.
- `src/features/planets`: domínio principal com API client, componentes e hooks específicos.
- `src/constants/queryKeys.ts`: chaves centralizadas para React Query, evitando colisões.
- `src/hooks`: abstrações de URL/local storage que mantêm estado e URL sincronizados.
- `src/test/mocks`: MSW simula SWAPI para testes e desenvolvimento offline opcional.

## 🌍 Funcionalidades

- **Home (`/`)**: hero animado, chamada à ação e cards destacados com indicadores de sincronização via React Query.
- **Planetas (`/planets`)**: busca com debounce, paginação preservada na URL, skeletons, estados de erro/vazio e indicador de live re-fetch.
- **Detalhes (`/planets/[id]`)**: informações básicas, características, filmes e residentes com carregamento paralelo e placeholders dedicados.
- **Tema global**: toggle persistente (light/dark/system) e layout responsivo com Header/Footer reutilizáveis.

## 🧠 Dados e Cache

### Configuração global (`src/constants/api.ts`)

```ts
export const CACHE_CONFIG = {
  staleTime: 60 * 1000,
  gcTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
  retry: 1,
} as const;
```

`src/lib/providers.tsx` cria o `QueryClient` com essas defaults e expõe DevTools + toasts.

### Consultas principais

- **Lista de planetas** (`src/features/planets/hooks/usePlanetsQuery.ts`): sorting client-side, placeholderData, detecção de estados (`showSkeleton`, `showEmptyState`, `isSyncing`) e cálculo de paginação.
- **Detalhes do planeta** (`src/features/planets/hooks/usePlanetDetails.ts`): cache de 5 min, GC de 10 min, `retry` duplo e `refetchOnWindowFocus` desabilitado.
- **Filmes e residentes** (`useFilms`, `useResidents`): carregamento paralelo com `Promise.all`, caches longos (30–60 min) e chave composta (`queryKeys.films`, `queryKeys.residents`).
- **Prefetch** (`usePrefetchPlanet`): antecipação opcional de detalhes para navegação instantânea.

### Query keys tipadas (`src/constants/queryKeys.ts`)

```ts
export const queryKeys = {
  planets: {
    all: ['planets'],
    list: (filters?: Record<string, unknown>) => ['planets', 'list', filters],
    detail: (id: string) => ['planets', 'detail', id],
  },
  films: {
    list: (filters?: Record<string, unknown>) => ['films', 'list', filters],
    byUrl: (url: string) => ['films', 'url', url],
  },
  residents: {
    byUrl: (urls: string) => ['residents', 'url', urls],
  },
} as const;
```

## 🧪 Testes

### Unitários e de hooks (Vitest)

- `pnpm test` executa `vitest` com `jsdom`, `@testing-library/react` e setup via `src/test/setup.ts`.
- Hooks de URL, debounce e prefetch possuem cobertura dedicada em `src/hooks/__tests__`.
- MSW inicializa em todos os testes para mockar SWAPI (`src/test/mocks/server.ts`).

### End-to-end (Playwright)

- Suites em `e2e/`: `home`, `planets-list`, `planets-films`, `planets-integration`, `planets-complete` cobrem navegação, filtros, estados de erro e acessibilidade básica.
- Comandos:
  ```bash
  pnpm test:e2e        # Execução headless
  pnpm test:e2e:ui     # Runner interativo
  pnpm test:e2e:challenge # Fluxo completo usado em avaliações
  ```
- Relatórios disponíveis em `playwright-report/` e `test-results/`.

## 🛠️ Setup e Execução

### Pré-requisitos

- Node.js 18+
- pnpm (recomendado) ou npm

### Passo a passo

```bash
pnpm install
cp .env.example .env
pnpm dev
# Acesse http://localhost:3000
```

### Scripts disponíveis

```bash
pnpm dev                # Ambiente de desenvolvimento
pnpm build              # Build de produção
pnpm start              # Servidor Next em modo produção
pnpm lint               # ESLint
pnpm format             # Prettier --write
pnpm format:check       # Prettier --check
pnpm typecheck          # tsc --noEmit
pnpm test               # Vitest headless
pnpm test:ui            # Vitest UI
pnpm test:e2e           # Playwright headless
pnpm test:e2e:ui        # Playwright UI
pnpm test:e2e:challenge # Cenário completo de desafio
pnpm prepare            # Instala/atualiza os hooks do Husky
```

> O hook de `pre-commit` roda `pnpm lint-staged` seguido de `pnpm test:ui`, garantindo feedback rápido antes do push.

## ⚙️ Variáveis de Ambiente

Valores sugeridos em `.env.example`:

- `NEXT_PUBLIC_API_BASE_URL`: endpoint da SWAPI (ex.: `https://swapi.dev/api`)
- `NEXT_PUBLIC_APP_NAME`: nome exibido na UI (default: `SWAPI Explorer`)
- `NEXT_PUBLIC_APP_URL`: URL pública (default: `http://localhost:3000`)
- `NEXT_PUBLIC_ENABLE_MOCK_API`: flag booleana para eventualmente habilitar mocks em runtime (validada mas opcional)

Todas as variáveis são validadas com Zod em `src/lib/env.ts`; build e runtime abortam com erros descritivos se algo faltar.

## 🧩 Mock API e desenvolvimento offline

- MSW serve respostas determinísticas para planetas, filmes, residentes, espécies e veículos (`src/test/mocks/handlers.ts`).
- `src/test/mocks/mock-data.ts` concentra fixtures adicionais reutilizadas em testes.
- Basta ligar a flag `NEXT_PUBLIC_ENABLE_MOCK_API=true` e inicializar o worker (ou consumir os mocks na camada de testes) para explorar o app sem depender da SWAPI.

## 🔄 Extendendo para novos recursos

1. **Modelagem**: adicione tipos em `src/types` e schemas/normalização conforme necessário.
2. **Camada de API**: crie endpoints em `src/features/<domínio>/api` reutilizando a instância Axios ou `fetch` server-side.
3. **Hooks**: modele queries/mutations em `src/features/<domínio>/hooks`, registre chaves em `src/constants/queryKeys.ts`.
4. **UI**: componha cards/listas em `src/features/<domínio>/components` e reuse building blocks de `src/components`.
5. **Rotas**: registre páginas em `src/app/<domínio>` seguindo o padrão do App Router.
6. **Testes**: acrescente handlers MSW, specs em `src/hooks/__tests__` e cenários Playwright correspondentes.

## 📚 Referências e Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [SWAPI Documentation](https://swapi.dev/documentation)
- [Zod Documentation](https://zod.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vitest](https://vitest.dev)
- [Playwright](https://playwright.dev)

## 📝 Estado do Projeto

- ✅ Pronto para demonstrações técnicas e entrevistas.
- ✅ Serve como template para apps data-driven com Next.js 15.
- ✅ Cobertura de testes oferece confiança para evoluções.
- ⚠️ Integração write (create/update/delete) permanece mockada — SWAPI é read-only.

### Próximos passos sugeridos

1. Habilitar toggle de mocks no runtime (service worker) para desenvolvimento offline sem configuração manual.
2. Adicionar autenticação (ex.: NextAuth.js) e recursos protegidos.
3. Configurar pipeline CI/CD (Lint + Test + Playwright) com deploy automático.
4. Expandir testes de acessibilidade (axe, Lighthouse) e monitoramento (Sentry/Logtail).

## 📄 Licença

MIT License — use como base para seus próprios projetos.

---

**Desenvolvido com ❤️ para explorar a galáxia via SWAPI**
