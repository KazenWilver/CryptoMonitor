# 💎 CryptoMonitor — Sistema de Monitoramento de Criptomoedas

Sistema completo de monitoramento de criptomoedas com dashboard em tempo real, portfólio com P&L, alertas de preço, watchlist, análise de mercado e relatórios.

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Frontend** | Angular 19, SCSS, TypeScript, Chart.js |
| **Backend** | PHP Puro (sem frameworks), PDO |
| **Base de Dados** | MySQL 8.4 |
| **Servidor** | WAMP (Apache + MySQL + PHP) |
| **API Externa** | CoinGecko API v3 |
| **Autenticação** | JWT (HMAC-SHA256) |
| **Design System** | Violet Crypto (dark-first) |

## Funcionalidades Implementadas

### Requisitos Obrigatórios ✅

| # | Requisito | Estado |
|---|---|---|
| R1 | Sistema de autenticação completo (registo, login, logout, recuperação de senha) | ✅ |
| R2 | Base de dados relacional com pelo menos três tabelas e suporte a operações CRUD | ✅ (6 tabelas) |
| R3 | Integração com pelo menos uma API externa | ✅ (CoinGecko API — 7 endpoints) |
| R4 | Interface responsiva | ✅ |
| R5 | Implementação de modo claro e modo escuro com alternância funcional | ✅ |
| R6 | Suporte a múltiplos idiomas (mínimo duas línguas) | ✅ (7 idiomas: PT, EN, ES, FR, ZH, HI, JA) |
| R7 | Funcionalidade de exportação de dados ou relatórios (CSV ou PDF) | ✅ |

### Funcionalidades Detalhadas

- **Autenticação**: Registo, Login, Logout, Recuperação de password (JWT stateless)
- **Dashboard**: Market cap global, trending coins, top 20 por market cap
- **Mercado**: Listagem completa de 100+ criptomoedas, pesquisa global, detalhe com gráficos interativos (Chart.js)
- **Watchlist**: Adicionar/remover favoritos (CRUD) com notificações toast
- **Portfólio**: Registar transações buy/sell, holdings com P&L em tempo real
- **Alertas**: Criar alertas above/below com preço alvo (CRUD)
- **Análise**: Média Móvel 7D/30D, Volatilidade, Tendência (bullish/bearish/neutral)
- **Relatórios**: Exportação em CSV e PDF (portfólio, watchlist, transações)
- **Configurações**: Dark/Light mode, 7 idiomas (🇧🇷 PT, 🇬🇧 EN, 🇪🇸 ES, 🇫🇷 FR, 🇨🇳 ZH, 🇮🇳 HI, 🇯🇵 JA), perfil, password
- **Notificações**: Sistema de toast global (sucesso/erro/aviso) em todas as ações
- **Admin**: Gestão de utilizadores, estatísticas da plataforma

## Estrutura do Projeto

```
crypto-monitor/
├── backend/
│   ├── config/           → Configuração (app, database, cors)
│   ├── controllers/      → 9 Controladores HTTP
│   ├── core/             → Database, Router, Request, Response, JWT
│   ├── helpers/          → Validação, Cache
│   ├── middleware/       → Auth, Admin middleware
│   ├── repositories/     → Data access layer (PDO)
│   ├── routes/           → 35+ API route definitions
│   ├── services/         → 7 Service classes (business logic)
│   ├── .htaccess         → URL rewrite + Authorization header pass-through
│   └── index.php         → Entry point (front controller)
├── frontend/
│   └── src/app/
│       ├── core/         → Models, Services, Guards, Interceptors, Pipes
│       ├── features/     → 9 Feature Modules (lazy-loaded)
│       │   ├── auth/         → Login, Register
│       │   ├── dashboard/    → Painel principal
│       │   ├── market/       → Listagem de mercado
│       │   ├── watchlist/    → Favoritos
│       │   ├── portfolio/    → Portfólio com P&L
│       │   ├── alerts/       → Alertas de preço
│       │   ├── reports/      → Relatórios e exportação
│       │   ├── settings/     → Configurações
│       │   └── admin/        → Administração
│       ├── layout/       → Sidebar, Header, MainLayout
│       └── shared/       → SharedModule (TranslatePipe, CommonModule)
├── database/
│   ├── schema.sql        → 6 tabelas em 3FN
│   └── seed.sql          → Dados iniciais (admin + user)
├── .gitignore
└── README.md
```

## Pré-Requisitos

- **WAMP** 3.3+ (inclui Apache, MySQL, PHP)
  - Download: https://wampserver.aviatechno.net
- **Node.js** 18+ e npm
  - Download: https://nodejs.org
- **Chave API CoinGecko** (gratuita)
  - Obter em: https://www.coingecko.com/en/api

## Instalação e Execução (Passo a Passo)

### 1. Iniciar o WAMP

Abrir o **WampServer** e aguardar que o ícone fique **verde** (Apache + MySQL a correr).

### 2. Criar Symlink para o Projeto

Abrir **PowerShell como Administrador** e executar:

```powershell
New-Item -ItemType Junction -Path "C:\wamp64\www\crypto-monitor" -Target "CAMINHO_DO_PROJETO"
```

> Substituir `CAMINHO_DO_PROJETO` pelo caminho real, ex: `C:\Users\User\Documents\ISPTEC\ES2\Lab 4 - Sistema de Monitoramento de Criptomoedas`

### 3. Importar a Base de Dados

```powershell
# Importar schema (6 tabelas)
Get-Content "database\schema.sql" | & "C:\wamp64\bin\mysql\mysql8.4.7\bin\mysql.exe" -u root

# Importar seed (utilizadores de teste)
Get-Content "database\seed.sql" | & "C:\wamp64\bin\mysql\mysql8.4.7\bin\mysql.exe" -u root
```

> **Nota:** Se a versão do MySQL for diferente, ajustar o caminho. Verificar com:
> `Get-ChildItem "C:\wamp64\bin\mysql" -Directory`

### 4. Configurar o Backend

Editar o ficheiro `backend/.env`:

```env
DB_HOST=localhost
DB_NAME=crypto_monitor
DB_USER=root
DB_PASS=
JWT_SECRET=crypto_monitor_secret_key_2024
COINGECKO_API_KEY=SUA_CHAVE_AQUI
```

> **Testar o backend**: abrir no browser: `http://localhost/crypto-monitor/backend/api/auth/login`
> Deve retornar `{"success":false,"error":"Método não permitido","code":405}` (GET não é permitido — isso é correto).

### 5. Instalar e Rodar o Frontend

```powershell
cd frontend
npm install
npx ng serve
```

> O servidor Angular arranca em `http://localhost:4200`

### 6. Aceder à Aplicação

Abrir no browser: **http://localhost:4200**

## Credenciais de Teste

| Conta | Email | Password | Papel |
|---|---|---|---|
| Administrador | `admin@cryptomonitor.ao` | `Admin@123` | admin |
| Utilizador | `user@cryptomonitor.ao` | `User@123` | user |

## Arquitetura

### Backend (Repository Pattern)
```
Request → Router → Middleware → Controller → Service → Repository → Database
```

### Frontend (Modular Angular)
```
AppModule → Lazy-Loaded FeatureModules → Components → Services → HTTP → Backend API
```

### Base de Dados (6 tabelas)
```
users ←─── password_resets
  │
  ├──── watchlist
  ├──── portfolio_transactions
  ├──── price_alerts
  └──── export_logs
```

## API Endpoints (35+)

| Método | Endpoint | Descrição | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Registar conta | ❌ |
| POST | `/api/auth/login` | Iniciar sessão | ❌ |
| POST | `/api/auth/forgot-password` | Recuperar senha | ❌ |
| POST | `/api/auth/reset-password` | Redefinir senha | ❌ |
| GET | `/api/crypto/markets` | Listar mercado | ✅ |
| GET | `/api/crypto/trending` | Moedas em tendência | ✅ |
| GET | `/api/crypto/global` | Dados globais | ✅ |
| GET | `/api/crypto/{id}` | Detalhe de moeda | ✅ |
| GET | `/api/crypto/{id}/history` | Histórico de preços | ✅ |
| GET | `/api/crypto/search?q=` | Pesquisar moedas | ✅ |
| GET/POST/DELETE | `/api/watchlist` | CRUD Watchlist | ✅ |
| GET/POST/PUT/DELETE | `/api/portfolio/*` | CRUD Portfólio | ✅ |
| GET/POST/PUT/DELETE | `/api/alerts/*` | CRUD Alertas | ✅ |
| GET | `/api/export/{tipo}/{formato}` | Exportação CSV/PDF | ✅ |
| PUT | `/api/user/profile` | Atualizar perfil | ✅ |
| PUT | `/api/user/password` | Alterar password | ✅ |
| GET/PUT/DELETE | `/api/admin/users/*` | Gestão de utilizadores | 🔒 Admin |
| GET | `/api/admin/stats` | Estatísticas | 🔒 Admin |

## Licença

Projeto académico — ISPTEC, Engenharia de Software 2, Lab #04
