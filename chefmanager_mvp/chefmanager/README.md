# ChefManager — MVP Full‑Stack

Este repositorio contiene una versión funcional mínima que cubre las funcionalidades **Must Have** del documento: autenticación (demo), inventario/productos, recepción de compras con lotes, órdenes de producción (estados), entregas (estados), nómina (periodos) y módulo de **Salas (Super Selectos)** con búsqueda; además de KPIs de ejemplo.

## Estructura
- `/backend` Spring Boot (Java 17, JPA, MySQL)
- `/frontend` React + Vite
- `mysql_seed.sql` inserts iniciales (opcional)

## Puesta en marcha
1) **Base de datos** (MySQL)
```sql
CREATE DATABASE chefmanager_db CHARACTER SET utf8mb4;
CREATE USER 'chef'@'%' IDENTIFIED BY 'chef123';
GRANT ALL PRIVILEGES ON chefmanager_db.* TO 'chef'@'%';
FLUSH PRIVILEGES;
```
Opcional: ejecutar `mysql_seed.sql`.

2) **Backend**
```bash
cd backend
mvn spring-boot:run
```

3) **Frontend**
```bash
cd ../frontend
npm install
npm run dev
```

4) Usuario de demo
- Usuario: `admin`
- Contraseña: `admin123`
