# PLANO DEFINITIVO — Parte 2: Backend PHP, Frontend Angular e Endpoints REST

---

## 5. ESTRUTURA DO BACKEND (PHP Puro)

### 5.1 Organização de Diretórios

```
backend/
├── public/
│   ├── index.php                 # Entry point único (bootstrap)
│   └── .htaccess                 # Rewrite all → index.php
│
├── config/
│   ├── database.php              # Credenciais PDO
│   ├── cors.php                  # Headers CORS
│   └── app.php                   # JWT_SECRET, API keys, constantes
│
├── core/
│   ├── Database.php              # Singleton PDO
│   ├── Router.php                # Roteador HTTP (METHOD + URI → Controller)
│   ├── Request.php               # Abstração do request (body, headers, params)
│   ├── Response.php              # Helpers JSON (200, 401, 404, 422, 500)
│   └── JWTHelper.php             # Encode/decode JWT
│
├── middleware/
│   ├── AuthMiddleware.php        # Valida JWT → injeta $user
│   ├── AdminMiddleware.php       # Verifica role = 'admin'
│   └── CorsMiddleware.php        # Headers CORS automáticos
│
├── controllers/
│   ├── AuthController.php        # register, login, logout, forgot, reset
│   ├── CryptoController.php      # markets, trending, detail, history, search
│   ├── WatchlistController.php   # CRUD watchlist
│   ├── PortfolioController.php   # CRUD transações, holdings, P&L
│   ├── AlertController.php       # CRUD alertas de preço
│   ├── AnalyticsController.php   # MA7, MA30, volatilidade
│   ├── ExportController.php      # CSV e PDF
│   ├── UserController.php        # Perfil, preferências
│   └── AdminController.php       # Gestão de utilizadores, stats
│
├── services/
│   ├── AuthService.php           # Hash, validação, geração de token
│   ├── CryptoService.php         # Proxy CoinGecko, cache, rate limit
│   ├── WatchlistService.php      # Lógica de favoritos
│   ├── PortfolioService.php      # Cálculo P&L, valor do portfólio
│   ├── AlertService.php          # Lógica de trigger de alertas
│   ├── AnalyticsService.php      # Moving Average, volatilidade
│   ├── ExportService.php         # Geração CSV e PDF
│   └── EmailService.php          # Envio de email (PHPMailer)
│
├── repositories/
│   ├── UserRepository.php        # Queries users + password_resets
│   ├── WatchlistRepository.php   # Queries watchlist
│   ├── PortfolioRepository.php   # Queries portfolio_transactions
│   ├── AlertRepository.php       # Queries price_alerts
│   └── ExportLogRepository.php   # Queries export_logs
│
├── helpers/
│   ├── ValidationHelper.php      # Sanitização + validação de inputs
│   └── CacheHelper.php           # Cache em ficheiro para API calls
│
├── routes/
│   └── api.php                   # Mapeamento completo de rotas
│
├── storage/
│   ├── exports/                  # PDFs/CSVs temporários
│   ├── cache/                    # Cache de API
│   └── logs/                     # Logs de erro
│
├── vendor/                       # Composer (JWT, PHPMailer, FPDF)
├── composer.json
└── .env                          # Credenciais (NÃO versionado)
```

### 5.2 Separação de Responsabilidades (Backend)

| Camada | Responsabilidade | Regra |
|---|---|---|
| `index.php` | Bootstrap: config, cors, router | Entry point único |
| `Router` | Despacha METHOD+URI → Controller | Sem lógica de negócio |
| `Controller` | Valida input, chama Service, devolve JSON | Zero SQL, zero lógica |
| `Service` | Regras de negócio, orquestração, cálculos | Chama Repository |
| `Repository` | Queries PDO parametrizadas | Zero lógica de negócio |
| `Middleware` | Auth JWT, admin check, CORS | Cross-cutting |
| `Helper` | Validação, cache, utilitários | Stateless |

### 5.3 Fluxo de Request
```
HTTP Request
  → index.php (bootstrap)
    → CorsMiddleware (headers)
      → Router (match METHOD + URI)
        → AuthMiddleware (verifica JWT)
          → Controller (valida input)
            → Service (lógica)
              → Repository (SQL)
                → Response JSON
```

---

## 6. ESTRUTURA DO FRONTEND (Angular)

### 6.1 Organização de Diretórios

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/                               # Singleton — AppModule only
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts             # Login, register, JWT storage
│   │   │   │   ├── crypto.service.ts           # Chamadas /api/crypto/*
│   │   │   │   ├── theme.service.ts            # Dark/light toggle + localStorage
│   │   │   │   ├── i18n.service.ts             # Carrega pt.json/en.json
│   │   │   │   ├── portfolio.service.ts        # Chamadas /api/portfolio/*
│   │   │   │   ├── watchlist.service.ts        # Chamadas /api/watchlist/*
│   │   │   │   ├── alert.service.ts            # Chamadas /api/alerts/*
│   │   │   │   └── export.service.ts           # Chamadas /api/export/*
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts               # Bloqueia rotas sem JWT
│   │   │   │   └── admin.guard.ts              # Bloqueia rotas sem role=admin
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts         # Injeta Authorization: Bearer
│   │   │   │   └── error.interceptor.ts        # 401 → logout, 500 → toast
│   │   │   └── models/
│   │   │       ├── user.model.ts
│   │   │       ├── crypto.model.ts
│   │   │       ├── portfolio.model.ts
│   │   │       ├── alert.model.ts
│   │   │       └── api-response.model.ts
│   │   │
│   │   ├── shared/                             # Componentes reutilizáveis
│   │   │   ├── components/
│   │   │   │   ├── navbar/                     # Barra superior
│   │   │   │   ├── sidebar/                    # Navegação lateral
│   │   │   │   ├── crypto-card/                # Card de cripto reutilizável
│   │   │   │   ├── crypto-table/               # Tabela genérica de criptos
│   │   │   │   ├── price-chart/                # Chart.js wrapper
│   │   │   │   ├── theme-toggle/               # Botão dark/light
│   │   │   │   ├── lang-switcher/              # Dropdown PT/EN
│   │   │   │   ├── loading-spinner/            # Spinner de carregamento
│   │   │   │   ├── toast-notification/         # Notificações
│   │   │   │   ├── confirm-dialog/             # Diálogos de confirmação
│   │   │   │   ├── empty-state/                # Estado vazio de listas
│   │   │   │   └── stat-card/                  # Card de estatística
│   │   │   ├── pipes/
│   │   │   │   ├── currency-format.pipe.ts     # $45,123.45
│   │   │   │   ├── percent-change.pipe.ts      # +2.34% (com cor verde/vermelho)
│   │   │   │   └── translate.pipe.ts           # {{ 'key' | translate }}
│   │   │   ├── directives/
│   │   │   └── shared.module.ts
│   │   │
│   │   ├── layouts/
│   │   │   ├── main-layout/                    # Navbar + Sidebar + router-outlet
│   │   │   └── auth-layout/                    # Centrado, sem nav
│   │   │
│   │   ├── features/                           # Feature modules (lazy loaded)
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   ├── forgot-password/
│   │   │   │   ├── reset-password/
│   │   │   │   └── auth.module.ts
│   │   │   ├── dashboard/
│   │   │   │   ├── components/
│   │   │   │   │   ├── market-overview/        # Top criptos tabela
│   │   │   │   │   ├── trending-section/       # Moedas em tendência
│   │   │   │   │   ├── gainers-losers/         # Top ganhos/perdas 24h
│   │   │   │   │   └── global-stats/           # Market cap total, BTC dominance
│   │   │   │   ├── dashboard.component.ts
│   │   │   │   └── dashboard.module.ts
│   │   │   ├── crypto-detail/
│   │   │   │   ├── components/
│   │   │   │   │   ├── price-header/           # Preço atual + variação
│   │   │   │   │   ├── historical-chart/       # Gráfico 1D/7D/30D/1Y
│   │   │   │   │   ├── market-stats/           # Cap, volume, supply
│   │   │   │   │   └── analytics-panel/        # MA, volatilidade
│   │   │   │   └── crypto-detail.module.ts
│   │   │   ├── watchlist/
│   │   │   │   ├── watchlist.component.ts
│   │   │   │   └── watchlist.module.ts
│   │   │   ├── portfolio/
│   │   │   │   ├── components/
│   │   │   │   │   ├── portfolio-summary/      # Valor total, P&L
│   │   │   │   │   ├── holdings-table/         # Holdings por cripto
│   │   │   │   │   └── transaction-form/       # Formulário buy/sell
│   │   │   │   └── portfolio.module.ts
│   │   │   ├── alerts/
│   │   │   │   ├── alerts-list/
│   │   │   │   ├── alert-form/
│   │   │   │   └── alerts.module.ts
│   │   │   ├── reports/
│   │   │   │   ├── reports.component.ts
│   │   │   │   └── reports.module.ts
│   │   │   ├── settings/
│   │   │   │   ├── profile/
│   │   │   │   ├── preferences/
│   │   │   │   └── settings.module.ts
│   │   │   └── admin/
│   │   │       ├── user-management/
│   │   │       ├── system-stats/
│   │   │       └── admin.module.ts
│   │   │
│   │   ├── app-routing.module.ts
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   │
│   ├── assets/
│   │   ├── i18n/
│   │   │   ├── pt.json
│   │   │   └── en.json
│   │   └── images/
│   │
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   │
│   └── styles/
│       ├── _variables.scss         # Design tokens (cores, tipografia)
│       ├── _themes.scss            # Dark/light mode
│       ├── _typography.scss        # Inter, JetBrains Mono
│       ├── _components.scss        # Estilos base de componentes
│       ├── _utilities.scss         # Classes utilitárias
│       └── styles.scss             # @import de todos
│
├── angular.json
└── package.json
```

### 6.2 Separação de Responsabilidades (Frontend)

| Camada | Responsabilidade |
|---|---|
| Component | Template + interação UI. Delega tudo ao Service |
| Service | Chamadas HTTP, estado partilhado (BehaviorSubject) |
| Guard | Proteção de rotas (AuthGuard, AdminGuard) |
| Interceptor | Token injection, error handling global |
| Model/Interface | Tipos TypeScript — contrato de dados |
| Pipe | Formatação reutilizável (moeda, %, tradução) |
| Shared Components | crypto-card, price-chart, etc. — zero lógica de negócio |
| Feature Modules | Lazy loaded, isolados por domínio |

### 6.3 Routing

```typescript
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Auth layout (sem navbar/sidebar)
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login',           loadChildren: () => import('./features/auth/auth.module') },
      { path: 'register',        loadChildren: ... },
      { path: 'forgot-password', loadChildren: ... },
      { path: 'reset-password/:token', loadChildren: ... },
    ]
  },

  // Main layout (navbar + sidebar) — protegido
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard',   loadChildren: () => import('./features/dashboard/...') },
      { path: 'crypto/:id',  loadChildren: () => import('./features/crypto-detail/...') },
      { path: 'watchlist',   loadChildren: () => import('./features/watchlist/...') },
      { path: 'portfolio',   loadChildren: () => import('./features/portfolio/...') },
      { path: 'alerts',      loadChildren: () => import('./features/alerts/...') },
      { path: 'reports',     loadChildren: () => import('./features/reports/...') },
      { path: 'settings',    loadChildren: () => import('./features/settings/...') },
      {
        path: 'admin',
        canActivate: [AdminGuard],
        loadChildren: () => import('./features/admin/...')
      },
    ]
  },

  { path: '**', redirectTo: '/dashboard' }
];
```

---

## 7. ENDPOINTS REST API (Completos)

### 7.1 Autenticação
| Método | Endpoint | Proteção | Descrição |
|---|---|---|---|
| POST | `/api/auth/register` | Público | Registo |
| POST | `/api/auth/login` | Público | Login → JWT |
| POST | `/api/auth/logout` | Auth | Logout (invalidar token) |
| POST | `/api/auth/forgot-password` | Público | Gera token de reset |
| POST | `/api/auth/reset-password` | Público | Reset com token |

### 7.2 Perfil do Utilizador
| Método | Endpoint | Proteção | Descrição |
|---|---|---|---|
| GET | `/api/user/profile` | Auth | Obter perfil |
| PUT | `/api/user/profile` | Auth | Atualizar perfil |
| PUT | `/api/user/password` | Auth | Alterar senha |
| PUT | `/api/user/preferences` | Auth | Tema, idioma, moeda base |

### 7.3 Criptomoedas (Proxy CoinGecko)
| Método | Endpoint | Proteção | Descrição |
|---|---|---|---|
| GET | `/api/crypto/markets` | Auth | Top criptos (?page, ?per_page, ?currency) |
| GET | `/api/crypto/trending` | Auth | Moedas em tendência |
| GET | `/api/crypto/global` | Auth | Stats globais do mercado |
| GET | `/api/crypto/{id}` | Auth | Detalhe de uma moeda |
| GET | `/api/crypto/{id}/history` | Auth | Histórico (?days=7) |
| GET | `/api/crypto/{id}/analytics` | Auth | MA7, MA30, volatilidade |
| GET | `/api/crypto/search` | Auth | Pesquisa (?q=bitcoin) |

### 7.4 Watchlist
| Método | Endpoint | Proteção | Descrição |
|---|---|---|---|
| GET | `/api/watchlist` | Auth | Listar favoritos |
| POST | `/api/watchlist` | Auth | Adicionar favorito |
| DELETE | `/api/watchlist/{id}` | Auth | Remover favorito |

### 7.5 Portfólio
| Método | Endpoint | Proteção | Descrição |
|---|---|---|---|
| GET | `/api/portfolio` | Auth | Holdings + P&L calculados |
| GET | `/api/portfolio/transactions` | Auth | Listar transações |
| POST | `/api/portfolio/transactions` | Auth | Registar compra/venda |
| PUT | `/api/portfolio/transactions/{id}` | Auth | Editar transação |
| DELETE | `/api/portfolio/transactions/{id}` | Auth | Apagar transação |

### 7.6 Alertas
| Método | Endpoint | Proteção | Descrição |
|---|---|---|---|
| GET | `/api/alerts` | Auth | Listar alertas |
| POST | `/api/alerts` | Auth | Criar alerta |
| PUT | `/api/alerts/{id}` | Auth | Editar alerta |
| DELETE | `/api/alerts/{id}` | Auth | Apagar alerta |

### 7.7 Exportação
| Método | Endpoint | Proteção | Descrição |
|---|---|---|---|
| GET | `/api/export/portfolio?format=csv` | Auth | Export portfólio CSV |
| GET | `/api/export/portfolio?format=pdf` | Auth | Export portfólio PDF |
| GET | `/api/export/watchlist?format=csv` | Auth | Export watchlist CSV |
| GET | `/api/export/transactions?format=csv` | Auth | Export transações CSV |

### 7.8 Administração
| Método | Endpoint | Proteção | Descrição |
|---|---|---|---|
| GET | `/api/admin/users` | Auth+Admin | Listar utilizadores |
| PUT | `/api/admin/users/{id}` | Auth+Admin | Editar utilizador |
| DELETE | `/api/admin/users/{id}` | Auth+Admin | Desativar utilizador |
| GET | `/api/admin/stats` | Auth+Admin | Stats da plataforma |

### 7.9 Formato de Resposta Padrão

```json
{
  "success": true,
  "data": { ... },
  "message": "Operação realizada com sucesso"
}
```

```json
{
  "success": false,
  "error": "Credenciais inválidas",
  "code": 401
}
```

---

> **Continua na Parte 3:** UI/UX Design System, Funcionalidades por Módulo, Fases de Implementação, GitHub Strategy, Checklist
