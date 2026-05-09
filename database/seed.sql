USE crypto_monitor;

-- Admin padrão: admin@cryptomonitor.ao / Admin@123
INSERT INTO users (name, email, password_hash, role, theme)
VALUES ('Administrador', 'admin@cryptomonitor.ao',
        '$2y$12$LJ3m4ys3Gl5BEEP0MWhObu8MQhzirVR5RgpvI3pMB/.6dL.5rMKWi', 'admin', 'dark');

-- Utilizador de teste: user@cryptomonitor.ao / User@123
INSERT INTO users (name, email, password_hash, role, theme)
VALUES ('Utilizador Teste', 'user@cryptomonitor.ao',
        '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'dark');
