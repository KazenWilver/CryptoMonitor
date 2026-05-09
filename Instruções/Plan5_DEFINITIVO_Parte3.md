# PLANO DEFINITIVO — Parte 3: UI/UX Design System, Funcionalidades, Implementação e Checklist

---

## 8. UI/UX DESIGN SYSTEM — "Violet Crypto" (Baseado em Violet Issue)

Design system adaptado do Violet Issue para o contexto de monitoramento de criptomoedas. Tema escuro por defeito, otimizado para densidade de informação e legibilidade de dados financeiros.

### 8.1 Paleta de Cores

#### Cores Base (Dark Mode — Padrão)
| Token | Hex | Uso |
|---|---|---|
| `--color-primary` | `#5E6AD2` | Ações principais, estados selecionados, focus rings — Violet |
| `--color-primary-hover` | `#4E5BBF` | Hover/pressed de elementos primários — Deep Violet |
| `--color-secondary` | `#6E79D6` | Destaques secundários, gradientes — Light Violet |
| `--bg-app` | `#101014` | Fundo da aplicação (camada mais profunda) — Near Black |
| `--bg-card` | `#1B1B25` | Cards, sidebar, painéis — Dark Charcoal |
| `--bg-surface` | `#1F1F2E` | Modais, dropdowns, painéis elevados — Dark Surface |
| `--bg-hover` | `#252536` | Tooltips, popovers aninhados — Level 3 |
| `--text-primary` | `#F1F1F4` | Headings, texto principal — Off White |
| `--text-secondary` | `#8A8F98` | Descrições, metadata, timestamps — Muted Gray |
| `--border` | `#2C2C3A` | Divisores, borders de inputs — Dark Border |
| `--color-success` | `#3DD68C` | Preço a subir, transações completadas — Emerald |
| `--color-warning` | `#F0C000` | Em progresso, atenção — Gold |
| `--color-error` | `#EB5757` | Preço a descer, urgente, bugs — Coral Red |
| `--color-orange` | `#F7953D` | Alertas high priority — Orange |

#### Cores Base (Light Mode)
| Token | Hex | Uso |
|---|---|---|
| `--bg-app` | `#F8F9FB` | Fundo da aplicação |
| `--bg-card` | `#FFFFFF` | Cards, painéis |
| `--bg-surface` | `#F0F1F4` | Superfícies elevadas |
| `--bg-hover` | `#E8E9ED` | Hover states |
| `--text-primary` | `#0F172A` | Texto principal |
| `--text-secondary` | `#64748B` | Texto secundário |
| `--border` | `#E2E4E9` | Borders |
| (Cores de accent mantêm-se iguais) | | |

#### Implementação CSS
```scss
// _themes.scss
html[data-theme="dark"] {
  --bg-app: #101014;
  --bg-card: #1B1B25;
  --bg-surface: #1F1F2E;
  --bg-hover: #252536;
  --text-primary: #F1F1F4;
  --text-secondary: #8A8F98;
  --border: #2C2C3A;
  --color-primary: #5E6AD2;
  --color-primary-hover: #4E5BBF;
  --color-success: #3DD68C;
  --color-warning: #F0C000;
  --color-error: #EB5757;
  --shadow-modal: 0 24px 48px rgba(0,0,0,0.4);
  --glow-primary: 0 0 24px rgba(94,106,210,0.15);
}

html[data-theme="light"] {
  --bg-app: #F8F9FB;
  --bg-card: #FFFFFF;
  --bg-surface: #F0F1F4;
  --bg-hover: #E8E9ED;
  --text-primary: #0F172A;
  --text-secondary: #64748B;
  --border: #E2E4E9;
  --color-primary: #5E6AD2;
  --color-primary-hover: #4E5BBF;
  --color-success: #22C55E;
  --color-warning: #EAB308;
  --color-error: #EF4444;
  --shadow-modal: 0 24px 48px rgba(0,0,0,0.1);
  --glow-primary: 0 0 24px rgba(94,106,210,0.08);
}
```

### 8.2 Tipografia

| Elemento | Fonte | Peso | Tamanho | Letter-spacing | Line-height |
|---|---|---|---|---|---|
| H1 (Landing) | Inter | 600 | 40px | -0.03em | 1.2 |
| H2 (Settings) | Inter | 600 | 32px | -0.03em | 1.2 |
| H3 (Page title) | Inter | 600 | 24px | -0.03em | 1.3 |
| H4 (View title) | Inter | 600 | 20px | -0.02em | 1.3 |
| H5 (Panel title) | Inter | 600 | 16px | -0.01em | 1.4 |
| Body | Inter | 400 | 14px | normal | 1.5 |
| Nav items | Inter | 500 | 13px | normal | 1.4 |
| Preços/Números | JetBrains Mono | 500 | 14px | -0.02em | 1.4 |
| Metadata/Labels | Inter | 500 | 12px | normal | 1.3 |
| Shortcut hints | JetBrains Mono | 400 | 11px | 0.02em | 1 |
| Overline | Inter | 600 | 11px | 0.05em | 1 |

**Google Fonts Import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### 8.3 Elevação (Camadas de Background)

Sem sombras pesadas — profundidade via camadas de cor:

| Level | Cor (Dark) | Uso |
|---|---|---|
| 0 | `#101014` | Fundo da app |
| 1 | `#1B1B25` | Sidebar, cards, painéis |
| 2 | `#1F1F2E` | Dropdowns, modais, command palette |
| 3 | `#252536` | Tooltips, popovers aninhados |

Modais: `box-shadow: 0 24px 48px rgba(0,0,0,0.4)` + `backdrop-filter: blur(4px)`
Focus glow: `box-shadow: 0 0 24px rgba(94,106,210,0.15)` no elemento focado

### 8.4 Espaçamento

| Token | Valor |
|---|---|
| Base unit | 4px |
| Escala | 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 px |
| Buttons padding | 4px 12px |
| Cards/rows padding | 8px 16px |
| Inputs padding | 4px 10px |
| Chips padding | 2px 8px |
| Entre secções | 32px |
| Entre grupos | 16px |

### 8.5 Border Radius

| Valor | Uso |
|---|---|
| 4px | Chips, labels inline, badges |
| 6px | Buttons, inputs, dropdown items |
| 8px | Cards, painéis, sidebar nav items, menus |
| 12px | Modais, command palette, settings |
| 9999px | Círculos (avatars, status indicators) |

### 8.6 Componentes UI

#### Buttons
- **Primary:** `#5E6AD2` bg, white text, 500 weight, 32px height, 6px radius. Hover → `#4E5BBF`
- **Secondary:** transparent, 1px `#2C2C3A` border, `#F1F1F4` text. Hover → border `#8A8F98`
- **Ghost:** transparent, `#8A8F98` text. Hover → `#F1F1F4` text + `#1F1F2E` bg
- **Danger:** `#EB5757` bg, white text. Hover → darken 10%
- Compact: 28px height para toolbars. Todos 13px Inter 500

#### Cards
- `#1B1B25` bg, 1px `#2C2C3A` border, 8px radius, padding 12px 16px
- Sem sombra nos cards
- Hover: border subtilmente mais claro

#### Crypto Cards (específico)
- Row-based: 48px height por moeda
- Layout inline: ícone da moeda (24px) | nome + símbolo | preço (JetBrains Mono) | variação 24h (verde/vermelho) | sparkline mini-chart | botão watchlist
- Hover: `#1F1F2E` bg

#### Inputs
- 32px height, `#1B1B25` bg, 1px `#2C2C3A` border, 6px radius
- 14px Inter 400, `#F1F1F4` text, `#8A8F98` placeholder
- Focus: 1px `#5E6AD2` border + `0 0 0 2px rgba(94,106,210,0.15)` ring

#### Chips de Variação de Preço
- 20px height, 4px radius, 11px font, 500 weight
- **Positivo:** `#3DD68C` text, `rgba(61,214,140,0.15)` bg, seta ↑
- **Negativo:** `#EB5757` text, `rgba(235,87,87,0.15)` bg, seta ↓
- **Neutro:** `#8A8F98` text, `rgba(138,143,152,0.15)` bg

#### Tabelas de Mercado
- Rows de 44px height, full-width, sem borders visíveis entre rows
- Hover: `#1F1F2E` bg
- Header: 11px/600 uppercase `#8A8F98` com 0.05em tracking
- Colunas: Rank | Moeda | Preço | 24h% | 7d% | Market Cap | Volume | Sparkline

#### Navegação (Sidebar)
- 220px width (colapsável para 48px)
- `#1B1B25` bg, right 1px `#2C2C3A` border
- Nav items: 13px/500 `#8A8F98`, 32px height, 8px radius
- Hover: `#1F1F2E` bg
- Active: `#5E6AD2` a 10% opacity bg + `#F1F1F4` text + left 2px violet border
- Itens: Dashboard | Mercado | Watchlist | Portfólio | Alertas | Relatórios | Configurações
- Bottom: Settings icon, Theme toggle

#### Gráficos (Chart.js)
- Linha de preço: `#5E6AD2` (violet) com gradient fill para transparent
- Grid: `rgba(44,44,58,0.5)` — subtil
- Eixos: `#8A8F98` text, 12px Inter
- Tooltip: `#252536` bg, `#F1F1F4` text, 6px radius
- Período seletores (1D/7D/30D/1Y): pills 28px, 6px radius, ghost button style

#### Toasts/Notificações
- `#1F1F2E` bg, 1px `#2C2C3A` border, 8px radius
- Ícone à esquerda (success/warning/error cor), texto `#F1F1F4`
- Slide-in right, 150ms transition, auto-dismiss 4s

#### Loading States
- Skeleton loaders: `#1B1B25` bg com shimmer animation `#252536`
- Spinner: anel violet `#5E6AD2`, 20px, animation 0.8s linear

#### Empty States
- Centrado, ícone 48px `#8A8F98`, texto 14px `#8A8F98`
- CTA button primary abaixo

#### Formulários (Alertas, Transações)
- Labels: 12px/500 `#8A8F98`, uppercase, 0.05em tracking, margin-bottom 4px
- Input groups: label + input + error msg
- Error msg: 12px `#EB5757`, ícone ⚠

#### Modais
- `#1F1F2E` bg, 1px `#2C2C3A` border, 12px radius
- Shadow: `0 24px 48px rgba(0,0,0,0.4)` + backdrop blur 4px
- Header: 16px/600, close button ghost
- Footer: botões right-aligned (Cancel ghost + Action primary)

### 8.7 Responsividade

| Breakpoint | Largura | Comportamento |
|---|---|---|
| Mobile | < 768px | Sidebar oculta (hamburger menu), tabelas scrolláveis, 1 coluna |
| Tablet | 768px-1199px | Sidebar colapsada (48px ícones), 2 colunas |
| Desktop | ≥ 1200px | Sidebar expandida (220px), layout completo |

### 8.8 Animações e Transições
- Todas as transições: **≤ 150ms** — snappy, não decorativas
- Hover states: resposta em **< 50ms**
- Sidebar collapse: 200ms ease-out
- Modal open: 150ms fade + scale(0.98→1)
- Toast slide-in: 150ms ease-out
- Page transitions: 100ms fade

### 8.9 Regras de Design (Do's & Don'ts)
- ✅ Design keyboard-accessible com shortcut hints visíveis
- ✅ Componentes compactos (28-36px) para maximizar densidade de informação
- ✅ Preços e números em JetBrains Mono para distinção visual
- ✅ Hover states responsivos (< 50ms)
- ✅ Usar layered backgrounds para profundidade (sem sombras pesadas)
- ❌ NÃO usar violet como fill de áreas grandes — é estritamente accent
- ❌ NÃO usar animações > 150ms
- ❌ NÃO introduzir cores quentes na paleta — sistema cool-toned
- ❌ NÃO usar sombras pesadas; profundidade via cor de background

---

## 9. FUNCIONALIDADES POR MÓDULO

| Módulo | Funcionalidades | Requisitos Lab |
|---|---|---|
| **Auth** | Registo, Login, Logout, Recuperar senha (token) | R1 |
| **Dashboard** | Top criptos, trending, market cap global, gainers/losers, pesquisa | R3, R4 |
| **Crypto Detail** | Preço atual, chart histórico (1D/7D/30D/1Y), stats mercado, MA7/MA30, volatilidade | R3 |
| **Watchlist** | Add/remove favoritos, preços atuais | R2 (CRUD) |
| **Portfolio** | Registar buy/sell, holdings, P&L total e por cripto | R2 (CRUD) |
| **Alerts** | Criar alertas above/below, histórico de disparos | R2 (CRUD) |
| **Reports** | Exportar portfólio/transações/watchlist em CSV e PDF | R7 |
| **Settings** | Tema dark/light (R5), idioma PT/EN (R6), perfil, password | R5, R6 |
| **Admin** | Gerir utilizadores, stats da plataforma | Condicional |

---

## 10. IMPLEMENTAÇÃO TRANSVERSAL

### 10.1 Dark/Light Mode (R5)
```typescript
// theme.service.ts
setTheme(theme: 'light' | 'dark') {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  // Persistir no backend: PUT /api/user/preferences
}
```

### 10.2 Multi-idioma (R6)
- **Biblioteca:** ngx-translate
- **Ficheiros:** `assets/i18n/pt.json` e `assets/i18n/en.json`
- **Pipe:** `{{ 'dashboard.title' | translate }}`
- **Switcher:** Dropdown no header/sidebar

### 10.3 Exportação (R7)
- **CSV:** `ExportService.php` → `fputcsv()` → `Content-Type: text/csv`
- **PDF:** FPDF ou DomPDF (lib PHP pura, ficheiro único, sem framework)
- **Frontend:** botão "Exportar" → `window.open(endpoint)` → download direto

---

## 11. FASES DE IMPLEMENTAÇÃO (Priorizado para Prazo)

### Fase 1 — Fundação (CRÍTICA — Dia 1)
- [ ] Modelar BD (schema.sql + seed.sql)
- [ ] Backend: Database.php, Router.php, Request.php, Response.php
- [ ] Backend: AuthController + AuthService (register, login, JWT)
- [ ] Frontend: Angular base, layout principal, routing
- [ ] Frontend: AuthService, AuthGuard, AuthInterceptor
- [ ] Frontend: Login + Register pages
- [ ] Tema dark/light (CSS variables + ThemeService)
- [ ] i18n base (pt.json, en.json, TranslatePipe)

### Fase 2 — Núcleo (Dia 1-2)
- [ ] Backend: CryptoService (proxy CoinGecko) + CryptoController
- [ ] Frontend: Dashboard (market overview, trending, global stats)
- [ ] Frontend: Crypto Detail (preço, chart, stats)
- [ ] Backend: WatchlistController + WatchlistService
- [ ] Frontend: Watchlist (add/remove, lista)
- [ ] Backend: AlertController + AlertService
- [ ] Frontend: Alerts (CRUD)

### Fase 3 — Diferenciadores (Dia 2)
- [ ] Backend: PortfolioController + PortfolioService (P&L)
- [ ] Frontend: Portfolio (transações, holdings)
- [ ] Backend: ExportService (CSV)
- [ ] Frontend: Reports page
- [ ] Backend: AnalyticsService (MA7, MA30, volatilidade)
- [ ] Forgot/reset password flow

### Fase 4 — Polimento (Dia 2+)
- [ ] PDF export
- [ ] Admin module (user management, stats)
- [ ] Settings (perfil, preferências)
- [ ] Responsividade completa
- [ ] Validações e error handling
- [ ] Componentes shared (empty-state, confirm-dialog, toasts)
- [ ] Limpeza de código

### Fase 5 — Entrega
- [ ] Revisão de commits
- [ ] Documentação técnica (≤ 5 páginas)
- [ ] README.md
- [ ] Testes funcionais finais

---

## 12. ESTRATÉGIA GITHUB

### Convenção de Commits
```
feat(scope): descrição     — Nova funcionalidade
fix(scope): descrição      — Correção de bug
refactor(scope): descrição — Refatoração sem alterar comportamento
style(scope): descrição    — Alterações visuais/CSS
docs(scope): descrição     — Documentação
```

### Exemplos
```
feat(auth): implement JWT login and register
feat(dashboard): add market overview with CoinGecko data
feat(watchlist): add/remove crypto favorites CRUD
fix(alerts): correct price comparison logic
style(theme): implement dark/light mode toggle
docs: add technical documentation
```

### Regras
- Commits frequentes e descritivos
- Cada funcionalidade = 1+ commits com scope claro
- Nunca commits gigantes sem contexto
- Branch principal: `main`

---

## 13. DOCUMENTO TÉCNICO (≤ 5 Páginas)

Estrutura recomendada:
1. Introdução e objetivo do sistema
2. Arquitetura e tecnologias (diagrama + stack)
3. Funcionalidades implementadas
4. Estrutura da base de dados (ER diagram)
5. APIs utilizadas (CoinGecko, endpoints)
6. Decisões técnicas relevantes
7. Dificuldades encontradas
8. Conclusão

---

## 14. CHECKLIST DE CONFORMIDADE COM LAB #04

| Requisito | ✅ | Como implementado |
|---|---|---|
| R1 — Auth completa | ✅ | Auth module: register, login, logout, forgot/reset password, JWT |
| R2 — BD ≥ 3 tabelas + CRUD | ✅ | 6 tabelas, CRUD em watchlist/portfolio/alerts |
| R3 — API externa | ✅ | CoinGecko v3 via proxy PHP |
| R4 — Interface responsiva | ✅ | SCSS breakpoints (mobile/tablet/desktop) |
| R5 — Light/dark mode | ✅ | CSS custom properties + ThemeService + toggle |
| R6 — Multi-idioma ≥ 2 | ✅ | PT + EN via ngx-translate |
| R7 — Exportação CSV/PDF | ✅ | ExportService PHP (fputcsv + FPDF) |
| Cond. — Tipos utilizador | ✅ | ENUM('admin','user') + AdminGuard |
| Cond. — Permissões | ✅ | AdminMiddleware backend + AdminGuard frontend |
| Stack Angular | ✅ | Frontend 100% Angular |
| Stack PHP puro | ✅ | Sem frameworks, PHP nativo + PDO + libs via Composer |
| Stack SQL relacional | ✅ | MySQL/MariaDB, 6 tabelas 3FN |
| HTTP + JSON | ✅ | Todos endpoints JSON |
| Componentes reutilizáveis | ✅ | SharedModule com 11+ componentes |
| Módulos Angular | ✅ | Lazy loading por feature |
| Sep. interface/lógica/serviços | ✅ | Component / Service / Model |
| Sep. negócio/dados/endpoints | ✅ | Controller / Service / Repository |
| GitHub + commits | ⚠️ | Estrutura definida, execução contínua |

---

## 15. O QUE NÃO FAZER

- ❌ SQL dentro de views/components
- ❌ Angular sem modularização
- ❌ PHP monolítico (tudo num ficheiro)
- ❌ Código duplicado
- ❌ Chamar API externa diretamente do Angular
- ❌ Autenticação insegura (passwords em plain text)
- ❌ Misturar responsabilidades (lógica no controller, SQL no service)
- ❌ CSS desorganizado sem sistema de design
- ❌ Commits gigantes sem contexto
- ❌ Centenas de funcionalidades mal feitas > poucas bem feitas

---

## 16. ESTRUTURA FINAL DO REPOSITÓRIO

```
crypto-monitor/
├── backend/           → PHP REST API (ver Parte 2, secção 5)
├── frontend/          → Angular SPA (ver Parte 2, secção 6)
├── database/
│   ├── schema.sql     → CREATE TABLE scripts
│   ├── seed.sql       → Dados iniciais (admin user)
│   └── migrations/    → Alterações incrementais
├── docs/
│   └── technical-document.pdf
└── README.md
```

---

> **FIM DO PLANO DEFINITIVO**
>
> Este plano é a fusão completa dos 4 planos originais + design system Violet Issue adaptado.
> Prioriza: qualidade estrutural, organização, separação de responsabilidades, e implementabilidade dentro do prazo.
