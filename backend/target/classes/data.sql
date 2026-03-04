INSERT INTO users (id, username, password, role, enabled) VALUES
(1,'admin','admin123','ADMIN', true)
ON DUPLICATE KEY UPDATE username=username;

