
-- Minimal schema seed (Spring will auto-create JPA tables). Optional inserts:
INSERT INTO product (sku, name, unit, min_stock, max_stock, cost) VALUES
('AJO-250','Pasta de Ajo 250g','UND',10,100,1.10),
('AJO-500','Pasta de Ajo 500g','UND',10,100,1.90);

INSERT INTO supplier (name, contact, phone, email) VALUES
('Proveedor A','María','+503 7000 0000','maria@proveedora.com');

INSERT INTO room (store_code, name, department_name, municipality, address, latitude, longitude, status, services)
VALUES ('SS-001','Super Selectos Metrocentro','San Salvador','San Salvador','Local 12, Metrocentro',13.698,-89.191,'OPERATIVE','parqueo,panaderia');
