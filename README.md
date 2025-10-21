# SWAPI Next.js Application

Uma aplicação moderna e completa construída com Next.js 15, TypeScript, e as melhores práticas de desenvolvimento web, utilizando a Star Wars API (SWAPI) como backend.

Live demo (Vercel): https://sw-api-ilia.vercel.app/

## 🚀 Stack Tecnológica

### Core

- **Next.js 15** (App Router) - Framework React com SSR/SSG
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária

### Estado e Dados

- **React Query (TanStack Query)** - Gerenciamento de estado servidor, cache e sincronização
- **Axios** - Cliente HTTP com interceptors tipados
- **Zod** - Validação de schemas e variáveis de ambiente

### Formulários e Validação

- **React Hook Form** - Gerenciamento de formulários performático
- **@hookform/resolvers** - Integração Zod com RHF

### Testes

- **Vitest** - Framework de testes unitários
- **Testing Library** - Testes de componentes e hooks
- **Playwright** - Testes E2E
- **MSW (Mock Service Worker)** - Mocks de API para dev e testes

### Qualidade de Código

- **ESLint** - Linting
- **Prettier** - Formatação
- **Husky** - Git hooks
- **lint-staged** - Lint em arquivos staged

## 📁 Arquitetura

### Estrutura de Diretórios

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx             # Layout raiz
│   ├── page.tsx               # Home page
│   ├── globals.css            # Estilos globais
│   └── items/                 # Feature: Items (People)
│       ├── page.tsx           # Lista com filtros/paginação
│       ├── new/
│       │   └── page.tsx       # Criar item
│       └── [id]/
│           ├── page.tsx       # Detalhes do item
│           └── edit/
│               └── page.tsx   # Editar item
│
├── components/
│   └── ui/                    # Componentes UI reutilizáveis
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       ├── Label.tsx
│       ├── Skeleton.tsx
│       └── Spinner.tsx
│
├── features/
│   └── items/                 # Feature modular
│       ├── api/
│       │   ├── client.ts      # Axios instance configurado
│       │   ├── endpoints.ts   # Funções de API
│       │   └── dto.ts         # Schemas Zod e tipos
│       ├── hooks/
│       │   ├── useItems.ts    # React Query hooks
│       │   └── __tests__/
│       │       └── useItems.test.ts
│       ├── lib/
│       │   └── queryKeys.ts   # Query keys helpers
│       └── components/
│           └── ItemForm.tsx   # Formulário compartilhado
│
├── lib/
│   ├── providers.tsx          # QueryClientProvider, Toaster
│   ├── env.ts                 # Validação de env com Zod
│   └── utils.ts               # Funções utilitárias
│
└── test/
    ├── setup.ts               # Setup Vitest
    ├── utils.tsx              # Test wrappers
    └── mocks/
        ├── handlers.ts        # MSW handlers
        └── server.ts          # MSW server

e2e/
└── items.spec.ts              # Testes E2E Playwright
```

### Princípios Arquiteturais

#### 1. **Modularidade por Feature**

Cada feature (ex: `items`) é autocontida com sua própria lógica de API, hooks, e componentes.

#### 2. **Separação de Responsabilidades**

- **API Layer**: Cliente HTTP, endpoints, DTOs
- **Hooks Layer**: React Query hooks com lógica de negócio
- **Components Layer**: UI pura e apresentacional
- **Pages Layer**: Composição e coordenação

#### 3. **Type Safety**

- Zod para validação runtime e inferência de tipos
- TypeScript strict mode
- Tipagem end-to-end (API → Estado → UI)

### Gestão de Cache

```typescript
// Configuração React Query
{
  staleTime: 60s (lista), 120s (detalhe)
  gcTime: 5min
  refetchOnWindowFocus: false
  retry: 1
}
```

#### Estratégias de Cache

1. **Lista de Items**
   - Cache por 60s
   - Atualização otimista em create/delete
   - Invalidação após mutações

2. **Detalhe do Item**
   - Cache por 120s
   - Placeholder data do cache de lista
   - Atualização otimista em edit
   - Invalidação granular

3. **Optimistic Updates**
   - Create: Adiciona item temporário ao topo
   - Update: Atualiza dados imediatamente
   - Delete: Remove da lista instantaneamente
   - Rollback automático em caso de erro

## 🛠️ Setup e Execução

### Pré-requisitos

- Node.js 18+
- pnpm (recomendado) ou npm

### Instalação

```bash
# Clone o repositório
cd swapi-nextjs-app

# Instale as dependências
pnpm install

# Configure variáveis de ambiente
cp .env.example .env
```

### Variáveis de Ambiente

Edite `.env`:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://swapi.dev/api

# App Configuration
NEXT_PUBLIC_APP_NAME=SWAPI Explorer
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_MOCK_API=false
```

> ⚠️ Todas as variáveis são validadas com Zod no `src/lib/env.ts`

### Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev                  # Inicia servidor dev (localhost:3000)

# Build e Produção
pnpm build                # Build de produção
pnpm start                # Servidor de produção

# Qualidade de Código
pnpm lint                 # ESLint check
pnpm format               # Formata com Prettier
pnpm format:check         # Verifica formatação
pnpm typecheck            # TypeScript check

# Testes
pnpm test                 # Testes unitários (Vitest)
pnpm test:ui              # Vitest UI
pnpm test:e2e             # Testes E2E (Playwright)
pnpm test:e2e:ui          # Playwright UI
```

### Primeira Execução

```bash
pnpm install
pnpm dev
```

Acesse http://localhost:3000

## 🧪 Testes

### Testes Unitários (Vitest)

```bash
# Rodar testes
pnpm test

# Com UI
pnpm test:ui

# Coverage
pnpm test -- --coverage
```

**Exemplo de Teste de Hook:**

```typescript
it('should fetch items successfully', async () => {
  const { result } = renderHook(() => useItemsQuery(), {
    wrapper: TestWrapper,
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(result.current.data?.results).toHaveLength(2);
});
```

### Testes E2E (Playwright)

```bash
# Rodar E2E
pnpm test:e2e

# Com UI interativa
pnpm test:e2e:ui
```

**Cobertura E2E:**

- ✅ Navegação completa
- ✅ Busca e filtros
- ✅ Criação de item
- ✅ Edição de item
- ✅ Deleção com confirmação
- ✅ Validação de formulários
- ✅ Paginação
- ✅ Acessibilidade básica

### MSW (Mock Service Worker)

Mocks são configurados em `src/test/mocks/handlers.ts` e usados automaticamente em:

- Testes unitários
- Testes E2E
- Desenvolvimento (opcional via feature flag)

## 🎨 Acessibilidade

### Implementações A11y

- ✅ Estrutura semântica HTML5
- ✅ ARIA labels em elementos interativos
- ✅ Foco visível em todos os controles
- ✅ Hierarquia de headings correta
- ✅ Feedback de erro associado a inputs
- ✅ Estados de loading comunicados
- ✅ Navegação por teclado completa

### Lighthouse Scores Target

- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

## 📊 Performance

### Otimizações

1. **React Query**
   - Cache inteligente reduz requests
   - Prefetching em hover (opcional)
   - Deduplicação automática

2. **Next.js**
   - Server Components onde possível
   - Route prefetching
   - Automatic code splitting

3. **Tailwind CSS**
   - PurgeCSS automático
   - CSS otimizado para produção

4. **Bundle Size**
   - Tree-shaking automático
   - Dynamic imports para rotas

## 🔄 Como Trocar de API

### Opção 1: Modificar Variável de Ambiente

```env
# .env
NEXT_PUBLIC_API_BASE_URL=https://sua-api.com/api
```

### Opção 2: Atualizar DTOs e Endpoints

1. **Atualize os schemas Zod** em `src/features/items/api/dto.ts`:

```typescript
export const itemSchema = z.object({
  id: z.string(),
  title: z.string(),
  // ... seus campos
});
```

2. **Ajuste os endpoints** em `src/features/items/api/endpoints.ts`:

```typescript
export const itemsApi = {
  getAll: async (params) => {
    const { data } = await apiClient.get('/your-endpoint', { params });
    return itemsResponseSchema.parse(data);
  },
  // ...
};
```

3. **Atualize query keys** se necessário em `src/features/items/lib/queryKeys.ts`

4. **Ajuste componentes** para refletir novos campos

### Opção 3: Criar Nova Feature

Para um domínio diferente (ex: `products`):

```bash
src/features/products/
├── api/
│   ├── client.ts      # Reusar ou criar novo
│   ├── dto.ts         # Novos schemas
│   └── endpoints.ts   # Novos endpoints
├── hooks/
│   └── useProducts.ts # Novos hooks
└── lib/
    └── queryKeys.ts   # Novas keys
```

## 🤔 Decisões Técnicas e Trade-offs

### 1. React Query vs Redux/Zustand

**Escolhido: React Query**

- ✅ Especializado em estado servidor
- ✅ Cache, refetch, mutations built-in
- ✅ Menos boilerplate

### 2. SWAPI como Backend

**Trade-off: API Read-Only**

- ✅ Sem necessidade de backend próprio
- ✅ Demonstra todas as operações CRUD
- **Solução**: MSW para simular writes, fácil trocar por API real

### 3. App Router vs Pages Router

**Escolhido: App Router**

- ✅ Futuro do Next.js
- ✅ Server Components
- ✅ Nested layouts
- **Decisão**: Vale a pena pela modernidade

### 4. Monorepo vs Single Package

**Escolhido: Single Package**

- ✅ Simplicidade para projeto de demo
- ✅ Menos complexidade de build
- **Contexto**: Adequado para escala do projeto

### 5. Validação Client-Side Only

**Trade-off**

- ✅ UX responsiva
- ✅ Feedback imediato
- **Nota**: Em produção, sempre validar no servidor também

### 6. Tailwind vs CSS-in-JS

**Escolhido: Tailwind**

- ✅ Performance (sem runtime)
- ✅ Padrão no ecossistema Next.js
- ✅ Design system consistente

### 7. Optimistic Updates

**Implementado**

- ✅ UX responsiva
- ✅ Feedback instantâneo

## 📚 Referências e Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [SWAPI Documentation](https://swapi.dev/documentation)
- [Zod Documentation](https://zod.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vitest](https://vitest.dev)
- [Playwright](https://playwright.dev)

## 📝 Notas Adicionais

### Estado do Projeto

Este é um projeto **demonstrativo completo** que serve como:

- ✅ Template para novos projetos
- ✅ Referência de boas práticas
- ✅ Base para entrevistas técnicas
- ✅ Exemplo de arquitetura escalável

### Próximos Passos (Opcional)

Para tornar production-ready:

1. Adicionar autenticação (NextAuth.js)
2. Implementar SSR/SSG onde apropriado
3. Adicionar testes de integração
4. Configurar CI/CD
5. Monitoramento e logging
6. Rate limiting
7. Internacionalização (i18n)
8. Theme switcher (dark mode)

### Suporte

Para dúvidas ou sugestões, abra uma issue no repositório.

## 📄 Licença

MIT License - sinta-se livre para usar como base para seus projetos!

---

**Desenvolvido com ❤️ usando as melhores práticas de desenvolvimento web moderno**
