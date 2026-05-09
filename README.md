# CryptoMonitor — Sistema de Monitoramento de Criptomoedas

Sistema completo de monitoramento de criptomoedas com dashboard em tempo real, portfólio com P&L, alertas de preço, watchlist, análise de mercado e relatórios.

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Frontend** | Angular 19, SCSS, TypeScript |
| **Backend** | PHP Puro (sem frameworks), PDO |
| **Base de Dados** | MySQL/MariaDB |
| **API Externa** | CoinGecko API v3 |
| **Autenticação** | JWT (HMAC-SHA256) |
| **Design System** | Violet Crypto (dark-first) |

## Funcionalidades

- **Autenticação**: Registo, Login, Logout, Recuperação de password (JWT stateless)
- **Dashboard**: Market cap global, trending coins, top 20 por market cap
- **Mercado**: Listagem completa de 100+ criptomoedas, pesquisa, detalhe com stats
- **Watchlist**: Adicionar/remover favoritos (CRUD)
- **Portfólio**: Registar transações buy/sell, holdings com P&L em tempo real
- **Alertas**: Criar alertas above/below com preço alvo (CRUD)
- **Análise**: Média Móvel 7D/30D, Volatilidade, Tendência (bullish/bearish/neutral)
- **Relatórios**: Exportação em CSV e PDF
- **Configurações**: Dark/Light mode (R5), Português/English (R6), perfil, password
- **Admin**: Gestão de utilizadores, estatísticas da plataforma

## Estrutura do Projeto

```
crypto-monitor/
├── backend/
│   ├── config/           → Configuração (app, database, cors)
│   ├── controllers/      → Controladores HTTP
│   ├── core/             → Database, Router, Request, Response, JWT
│   ├── helpers/          → Validação, Cache
│   ├── middleware/       → Auth, Admin middleware
│   ├── repositories/     → Data access layer (PDO)
│   ├── routes/           → API route definitions
│   ├── services/         → Business logic layer
│   └── index.php         → Entry point
├── frontend/
│   └── src/app/
│       ├── core/         → Models, Services, Guards, Interceptors, Pipes
│       ├── features/     → Auth, Dashboard, Market, Watchlist, Portfolio,
│       │                   Alerts, Reports, Settings, Admin (lazy-loaded)
│       ├── layout/       → Sidebar, Header, MainLayout
│       └── shared/       → SharedModule (TranslatePipe, etc.)
├── database/
│   ├── schema.sql        → 6 tabelas em 3FN
│   └── seed.sql          → Dados iniciais
└── README.md
```

## Requisitos

- PHP 8.0+ com extensões: pdo_mysql, curl, mbstring
- MySQL 8.0+ ou MariaDB 10.5+
- Node.js 18+ e npm
- Apache/Nginx com mod_rewrite

## Instalação

### Base de Dados
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### Backend
```bash
cd backend
cp .env.example .env    # Editar credenciais
# Configurar Apache/XAMPP para apontar para /backend
```

### Frontend
```bash
cd frontend
npm install
ng serve
```

Aceder em `http://localhost:4200`

### Credenciais de Teste
- **Admin**: admin@cryptomonitor.ao / Admin@123
- **User**: user@cryptomonitor.ao / User@123

## Arquitetura

### Backend (Repository Pattern)
```
Request → Router → Middleware → Controller → Service → Repository → Database
```

### Frontend (Modular Angular)
```
AppModule → LazyLoaded FeatureModules → Components → Services → HTTP → Backend API
```

## API Endpoints (35+)

| Método | Endpoint | Descrição |
|---|---|---|
| POST | /api/auth/register | Registar |
| POST | /api/auth/login | Login |
| GET | /api/crypto/markets | Listar mercado |
| GET | /api/crypto/{id} | Detalhe moeda |
| GET/POST/DELETE | /api/watchlist | CRUD Watchlist |
| GET/POST/PUT/DELETE | /api/portfolio/* | CRUD Portfolio |
| GET/POST/PUT/DELETE | /api/alerts/* | CRUD Alerts |
| GET | /api/export/* | Exportação CSV/PDF |
| GET/PUT/DELETE | /api/admin/* | Admin endpoints |

## Licença

Projeto académico — ISPTEC, Engenharia de Software 2, Lab #04
