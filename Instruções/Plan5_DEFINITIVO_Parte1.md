# PLANO DEFINITIVO — Sistema de Monitoramento de Criptomoedas
## Parte 1: Contexto, Decisões Técnicas, Arquitetura e Base de Dados

> **Fusão dos 4 planos + Design System Violet Issue**
> Data: 09 Mai 2026 | Prazo Fase 1: 10 Mai 2026

---

## 1. CONTEXTO E REQUISITOS DO LAB #04

### 1.1 Regras Organizacionais
| Item | Detalhe |
|---|---|
| Grupo | Máx. 4 elementos |
| Sistemas | 8 total (4 conjunto 1 + 4 conjunto 2) |
| Responsabilidade | 1 sistema por elemento por conjunto |
| Autoria | Evidenciada por commits no GitHub |
| Fase 1 | 10 Mai 2026 — Conjunto 1 (inclui este sistema) |
| Fase 2 | 17 Mai 2026 — Conjunto 2 |
| Entrega final | GitHub + scripts BD + doc técnico ≤ 5 páginas |

### 1.2 Requisitos Obrigatórios
| # | Requisito | Notas |
|---|---|---|
| R1 | Autenticação completa | Registo, login, logout, recuperação de senha |
| R2 | BD relacional ≥ 3 tabelas + CRUD | SQL |
| R3 | ≥ 1 API externa | CoinGecko (primária) |
| R4 | Interface responsiva | Mobile-first |
| R5 | Modo claro/escuro funcional | CSS themes + toggle |
| R6 | Multi-idioma ≥ 2 línguas | PT + EN |
| R7 | Exportação de dados | CSV e PDF |

### 1.3 Requisitos Condicionais (justificados para este sistema)
- **Tipos de utilizador**: user + admin (admin gere plataforma e utilizadores)
- **Permissões diferenciadas**: admin gere utilizadores; user gere portfólio/alertas próprios

### 1.4 Stack Obrigatória
| Camada | Tecnologia |
|---|---|
| Frontend | Angular |
| Backend | PHP puro (sem frameworks — libs utilitárias permitidas) |
| Base de dados | SQL relacional (MySQL/MariaDB) |
| Comunicação | HTTP requests → JSON responses |

### 1.5 Critérios de Avaliação
1. Funcionamento correto do sistema
2. Qualidade das funcionalidades
3. Organização do código (separação de responsabilidades)
4. Uso adequado de BD e APIs
5. Qualidade da interface (UI/UX)
6. Clareza de autoria individual (commits)
7. Consistência do versionamento
8. Reutilização e modularidade

---

## 2. DECISÕES TÉCNICAS FUNDAMENTAIS

### 2.1 API Externa — CoinGecko (Primária)

| Critério | CoinGecko |
|---|---|
| Plano gratuito | ✅ Sim |
| Auth | Sem chave para endpoints básicos |
| Limite free | ~30 calls/min |
| Dados históricos | ✅ |
| Documentação | Excelente |

**Endpoints a usar:**
- `/coins/markets` — listagem com preço, market cap, variação 24h
- `/coins/{id}` — detalhe de uma moeda
- `/coins/{id}/market_chart` — histórico de preços (1D/7D/30D/1Y)
- `/search/trending` — moedas em tendência
- `/simple/price` — preço rápido
- `/global` — stats globais do mercado

**Regra arquitetural:** O backend PHP atua como **proxy** para a CoinGecko. O Angular **nunca** chama APIs externas diretamente. Isto esconde chaves, centraliza cache e controla rate limiting.

### 2.2 Web Scraping — NÃO UTILIZAR
- APIs oficiais cobrem 100% dos dados necessários
- Scraping viola ToS, é frágil e insustentável
- API é mais estável, tipada e alinhada com o requisito do lab

### 2.3 IA no Sistema
- **IA no desenvolvimento:** Obrigatório (uso de Claude, Copilot, etc.)
- **IA como funcionalidade:** Opcional, não obrigatória pelo PDF

**Decisão:** Implementar análise estatística como feature diferenciadora:
| Feature | Abordagem | Viabilidade |
|---|---|---|
| Moving Average 7/30 dias | Cálculo PHP sobre dados históricos | ✅ Horas |
| Score de volatilidade | Desvio padrão dos últimos N preços | ✅ Horas |

Apresentada como "Análise Inteligente de Mercado" — tecnicamente honesta e implementável.

### 2.4 Autenticação — JWT
- Stateless, ideal para SPA Angular + REST PHP
- Desacopla frontend/backend
- Interceptor Angular injeta `Authorization: Bearer <token>` automaticamente
- Middleware PHP valida o token em cada request protegido

**Fluxo:**
```
Login → PHP gera JWT → Angular guarda token (localStorage)
→ Interceptor adiciona header → Middleware valida → Acesso concedido
```

### 2.5 Pressupostos Explícitos
1. **"PHP puro"** = sem frameworks (Laravel, Symfony), mas libs utilitárias (firebase/php-jwt, FPDF/DomPDF) são permitidas via Composer
2. **Recuperação de senha:** geração de token seguro na BD + simulação de envio ou API de email (PHPMailer/Resend)
3. **Idiomas:** PT + EN (mínimo do PDF)

---

## 3. ARQUITETURA GERAL

```
┌─────────────────┐     HTTP/JSON     ┌──────────────────┐     HTTP      ┌──────────────┐
│  Angular SPA    │ ←───────────────→ │  PHP Backend     │ ←──────────→ │  CoinGecko   │
│  (Frontend)     │                   │  (REST API)      │              │  API v3      │
└─────────────────┘                   └────────┬─────────┘              └──────────────┘
                                               │
                                               │ PDO
                                               ▼
                                      ┌──────────────────┐
                                      │  MySQL/MariaDB   │
                                      │  (6 tabelas)     │
                                      └──────────────────┘
```

**Fluxo de dados:**
```
Angular Component → Service (HTTP) → PHP Controller → Service (negócio) → Repository (SQL) → Response JSON
```

---

## 4. BASE DE DADOS — SCHEMA COMPLETO (6 TABELAS, 3FN)

### 4.1 Tabela `users`
```sql
CREATE TABLE users (
    id            INT           PRIMARY KEY AUTO_INCREMENT,
    name          VARCHAR(120)  NOT NULL,
    email         VARCHAR(150)  UNIQUE NOT NULL,
    password_hash VARCHAR(255)  NOT NULL,
    role          ENUM('admin','user') NOT NULL DEFAULT 'user',
    language      VARCHAR(5)    NOT NULL DEFAULT 'pt',
    theme         VARCHAR(10)   NOT NULL DEFAULT 'dark',
    base_currency VARCHAR(10)   NOT NULL DEFAULT 'USD',
    is_active     TINYINT(1)    NOT NULL DEFAULT 1,
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 4.2 Tabela `password_resets`
```sql
CREATE TABLE password_resets (
    id         INT          PRIMARY KEY AUTO_INCREMENT,
    user_id    INT          NOT NULL,
    token      VARCHAR(255) UNIQUE NOT NULL,
    expires_at DATETIME     NOT NULL,
    used       TINYINT(1)   NOT NULL DEFAULT 0,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 4.3 Tabela `watchlist`
```sql
CREATE TABLE watchlist (
    id            INT          PRIMARY KEY AUTO_INCREMENT,
    user_id       INT          NOT NULL,
    crypto_id     VARCHAR(100) NOT NULL,  -- CoinGecko ID: 'bitcoin', 'ethereum'
    crypto_symbol VARCHAR(20)  NOT NULL,  -- 'BTC', 'ETH'
    crypto_name   VARCHAR(100) NOT NULL,
    added_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_crypto (user_id, crypto_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 4.4 Tabela `portfolio_transactions`
```sql
CREATE TABLE portfolio_transactions (
    id               INT              PRIMARY KEY AUTO_INCREMENT,
    user_id          INT              NOT NULL,
    crypto_id        VARCHAR(100)     NOT NULL,
    crypto_symbol    VARCHAR(20)      NOT NULL,
    crypto_name      VARCHAR(100)     NOT NULL,
    type             ENUM('buy','sell') NOT NULL,
    quantity         DECIMAL(24, 10)  NOT NULL,
    price_usd        DECIMAL(24, 10)  NOT NULL,
    transaction_date TIMESTAMP        NOT NULL,
    notes            TEXT,
    created_at       TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 4.5 Tabela `price_alerts`
```sql
CREATE TABLE price_alerts (
    id             INT              PRIMARY KEY AUTO_INCREMENT,
    user_id        INT              NOT NULL,
    crypto_id      VARCHAR(100)     NOT NULL,
    crypto_symbol  VARCHAR(20)      NOT NULL,
    condition_type ENUM('above','below') NOT NULL,
    target_price   DECIMAL(24, 10)  NOT NULL,
    is_active      TINYINT(1)       NOT NULL DEFAULT 1,
    triggered_at   TIMESTAMP        NULL,
    created_at     TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 4.6 Tabela `export_logs`
```sql
CREATE TABLE export_logs (
    id          INT          PRIMARY KEY AUTO_INCREMENT,
    user_id     INT          NOT NULL,
    report_type VARCHAR(100) NOT NULL,
    format      ENUM('csv','pdf') NOT NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 4.7 Relacionamentos
```
users (1) ──< password_resets (N)
users (1) ──< watchlist (N)
users (1) ──< portfolio_transactions (N)
users (1) ──< price_alerts (N)
users (1) ──< export_logs (N)
```

### 4.8 Seed Inicial
```sql
INSERT INTO users (name, email, password_hash, role, theme)
VALUES ('Administrador', 'admin@cryptomonitor.ao',
        '$2y$12$...bcrypt_hash_de_Admin123...', 'admin', 'dark');
```

### 4.9 Nota de Normalização
`crypto_id`, `crypto_symbol`, `crypto_name` repetidos nas tabelas watchlist/portfolio/alerts é **design intencional** — evita JOIN com tabela de criptos (que seria volátil e exigiria sincronização com API). Dados de mercado vêm sempre da API; dados de identidade da cripto são imutáveis após registo. Está em 3FN no contexto.

---

> **Continua na Parte 2:** Estrutura Backend PHP, Estrutura Frontend Angular, Endpoints REST API
