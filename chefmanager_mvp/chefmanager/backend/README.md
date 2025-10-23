# ChefManager Backend (Spring Boot)

## Requisitos
- Java 17
- Maven 3.9+
- MySQL 8.x

## Configuración
1. Crea la base `chefmanager_db` en MySQL y un usuario:
```sql
CREATE DATABASE chefmanager_db CHARACTER SET utf8mb4;
CREATE USER 'chef'@'%' IDENTIFIED BY 'chef123';
GRANT ALL PRIVILEGES ON chefmanager_db.* TO 'chef'@'%';
FLUSH PRIVILEGES;
```
2. Ajusta `src/main/resources/application.properties` si es necesario.

## Ejecutar
```bash
mvn spring-boot:run
```

## Endpoints principales
- `POST /api/auth/login` (demo: admin/admin123)
- CRUD: `/api/products`, `/api/rooms`
- Recepción de compras: `/api/receipts` `POST /{id}/items` `POST /{id}/confirm`
- Órdenes de producción: `/api/pos` `POST /{id}/status`
- Entregas: `/api/deliveries` `POST /{id}/status`
- Nómina: `/api/payroll/periods` `POST /{id}/precalc` `POST /{id}/approve`
- KPIs: `/api/kpi/*`
