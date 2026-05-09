USE crypto_monitor;

-- Admin padrão: admin@cryptomonitor.ao / Admin@123
INSERT INTO users (name, email, password_hash, role, theme)
VALUES ('Administrador', 'admin@cryptomonitor.ao',
        '$2y$10$Txk9Ym8/7OFpwbz82ZBUFOtk2kJLhoMU3qZ3PJwsBd/8PlkF8vZYq', 'admin', 'dark');

-- Utilizador de teste: user@cryptomonitor.ao / User@123
INSERT INTO users (name, email, password_hash, role, theme)
VALUES ('Utilizador Teste', 'user@cryptomonitor.ao',
        '$2y$10$rydMp6ne3VC3SAsz1q6GjuJihwpujfJ/f4Iae35HIjbPcBi2ufT.O', 'user', 'dark');
