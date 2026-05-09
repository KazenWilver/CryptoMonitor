-- ============================================================
-- SCHEMA: crypto_monitor
-- Sistema de Monitoramento de Criptomoedas
-- ============================================================

CREATE DATABASE IF NOT EXISTS crypto_monitor
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE crypto_monitor;

-- ------------------------------------------------------------
-- T1: users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
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

-- ------------------------------------------------------------
-- T2: password_resets
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS password_resets (
    id         INT          PRIMARY KEY AUTO_INCREMENT,
    user_id    INT          NOT NULL,
    token      VARCHAR(191) UNIQUE NOT NULL,
    expires_at DATETIME     NOT NULL,
    used       TINYINT(1)   NOT NULL DEFAULT 0,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- T3: watchlist
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS watchlist (
    id            INT          PRIMARY KEY AUTO_INCREMENT,
    user_id       INT          NOT NULL,
    crypto_id     VARCHAR(100) NOT NULL,
    crypto_symbol VARCHAR(20)  NOT NULL,
    crypto_name   VARCHAR(100) NOT NULL,
    added_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_crypto (user_id, crypto_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- T4: portfolio_transactions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS portfolio_transactions (
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

-- ------------------------------------------------------------
-- T5: price_alerts
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS price_alerts (
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

-- ------------------------------------------------------------
-- T6: export_logs
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS export_logs (
    id          INT          PRIMARY KEY AUTO_INCREMENT,
    user_id     INT          NOT NULL,
    report_type VARCHAR(100) NOT NULL,
    format      ENUM('csv','pdf') NOT NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
