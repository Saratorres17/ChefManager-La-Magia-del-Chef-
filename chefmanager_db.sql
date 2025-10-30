-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-10-2025 a las 04:14:29
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `chefmanager_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `audit_log`
--

CREATE TABLE `audit_log` (
  `id` bigint(20) NOT NULL,
  `action` varchar(255) DEFAULT NULL,
  `details` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `when_action` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `delivery`
--

CREATE TABLE `delivery` (
  `id` bigint(20) NOT NULL,
  `proof_url` varchar(255) DEFAULT NULL,
  `route_code` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `employees`
--

CREATE TABLE `employees` (
  `id` bigint(20) NOT NULL,
  `dui` varchar(10) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `names` varchar(255) NOT NULL,
  `weekly_salary` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `employees`
--

INSERT INTO `employees` (`id`, `dui`, `last_name`, `names`, `weekly_salary`) VALUES
(1, '65111789-5', 'Salazar Cortez', 'Luis Enriquez', 350),
(2, '97057984-3', 'Martínez', 'Rodrigo Javier', 500),
(3, '04788984-1', 'Pineda Lazo', 'Sebastián ', 250),
(4, '23451212-2', 'Mixco Iraheta', 'Henry Daniel', 250),
(5, '12345678-9', 'Iraheta Mixco', 'Daniel Henry', 300),
(6, '23123123-5', 'Martinez Hernandez', 'Juan Jose', 300);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventory_item`
--

CREATE TABLE `inventory_item` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `sku` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventory_lot`
--

CREATE TABLE `inventory_lot` (
  `id` bigint(20) NOT NULL,
  `expiry_date` date DEFAULT NULL,
  `lot_code` varchar(255) DEFAULT NULL,
  `quantity` double DEFAULT NULL,
  `product_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventory_movement`
--

CREATE TABLE `inventory_movement` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `quantity` double DEFAULT NULL,
  `ref` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `lot_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orden`
--

CREATE TABLE `orden` (
  `id` bigint(20) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `producto_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ot_operation_logs`
--

CREATE TABLE `ot_operation_logs` (
  `id` bigint(20) NOT NULL,
  `username` varchar(255) NOT NULL,
  `action` varchar(255) NOT NULL,
  `details` varchar(500) DEFAULT NULL,
  `when_action` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ot_operation_logs`
--

INSERT INTO `ot_operation_logs` (`id`, `username`, `action`, `details`, `when_action`) VALUES
(1, 'admin', 'CREAR_COMPRA', 'Compra registrada: Tomate - asddistribuidora', '2025-10-30 03:06:13'),
(2, 'admin', 'CREAR_COMPRA', 'Compra registrada: Cebolla - Cebolladistribuidora', '2025-10-30 03:12:46');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ot_purchases`
--

CREATE TABLE `ot_purchases` (
  `id` bigint(20) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `distributor` varchar(255) NOT NULL,
  `total_price` double NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ot_purchases`
--

INSERT INTO `ot_purchases` (`id`, `product_name`, `distributor`, `total_price`, `created_at`) VALUES
(1, 'Tomate', 'asddistribuidora', 100, '2025-10-30 03:06:13'),
(2, 'Cebolla', 'Cebolladistribuidora', 20, '2025-10-30 03:12:46');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `payroll_entry`
--

CREATE TABLE `payroll_entry` (
  `id` bigint(20) NOT NULL,
  `employee_name` varchar(255) DEFAULT NULL,
  `gross_pay` double DEFAULT NULL,
  `net_pay` double DEFAULT NULL,
  `period_end` date DEFAULT NULL,
  `period_start` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `payroll_period`
--

CREATE TABLE `payroll_period` (
  `id` bigint(20) NOT NULL,
  `end_date` date DEFAULT NULL,
  `estimated_amount` double DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `product`
--

CREATE TABLE `product` (
  `id` bigint(20) NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `name` varchar(255) NOT NULL,
  `sku` varchar(50) NOT NULL,
  `units` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `product`
--

INSERT INTO `product` (`id`, `cost`, `name`, `sku`, `units`, `created_at`, `updated_at`) VALUES
(1, 2.50, 'Harina de Trigo 1kg', 'PRD001', 100, '2025-10-26 19:40:48', '2025-10-26 19:40:48'),
(2, 1.75, 'Azúcar Blanca 1kg', 'PRD002', 150, '2025-10-26 19:40:48', '2025-10-26 19:40:48'),
(3, 3.25, 'Aceite Vegetal 1L', 'PRD003', 80, '2025-10-26 19:40:48', '2025-10-26 19:40:48'),
(4, 0.85, 'Sal Marina 500g', 'PRD004', 200, '2025-10-26 19:40:48', '2025-10-26 19:40:48'),
(5, 1.20, 'Levadura Seca 50g', 'PRD005', 50, '2025-10-26 19:40:48', '2025-10-26 19:40:48'),
(7, 0.50, 'Tomates', 'PRD006', 10, '2025-10-30 02:06:19', '2025-10-30 02:06:19'),
(8, 0.25, 'Cebolla', 'PRD007', 5, '2025-10-30 02:06:58', '2025-10-30 02:06:58');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `production_order`
--

CREATE TABLE `production_order` (
  `id` bigint(20) NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `output_qty` double DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `output_product_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `categoria` varchar(255) DEFAULT NULL,
  `precio` double NOT NULL,
  `stock` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `receipt`
--

CREATE TABLE `receipt` (
  `id` bigint(20) NOT NULL,
  `date` date DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `supplier_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `receipt_item`
--

CREATE TABLE `receipt_item` (
  `id` bigint(20) NOT NULL,
  `expiry_date` date DEFAULT NULL,
  `lot_code` varchar(255) DEFAULT NULL,
  `quantity` double DEFAULT NULL,
  `unit_cost` double DEFAULT NULL,
  `product_id` bigint(20) NOT NULL,
  `receipt_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `room`
--

CREATE TABLE `room` (
  `id` bigint(20) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `department_name` varchar(255) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `municipality` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `services` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `store_code` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salas`
--

CREATE TABLE `salas` (
  `id` bigint(20) NOT NULL,
  `No_de_sala` int(11) DEFAULT NULL,
  `Nombre_comercial` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `distrito` varchar(255) DEFAULT NULL,
  `municipio` varchar(255) DEFAULT NULL,
  `departamento` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `salas`
--

INSERT INTO `salas` (`id`, `No_de_sala`, `Nombre_comercial`, `direccion`, `distrito`, `municipio`, `departamento`) VALUES
(1, 1, 'Súper  Selectos Gigante', 'Avenida Olimpica y 59 Av. Sur,Col. Escalón', 'San Salvador', 'San Salvador Centro', 'San Salvador'),
(2, 3, 'Súper Selectos Trigueros', '25 Av. Norte No 1138, ', 'San Salvador', 'San Salvador Centro', 'San Salvador'),
(3, 4, 'Súper Selectos Santa Emilia', 'Av. Masferrer y 7a. Calle Poniente Col. Lomas Verdes', 'San Salvador', 'San Salvador Centro', 'San Salvador'),
(4, 5, 'Súper Selectos Centro', '1a C. Pte. Y 1a AV. Norte No. 216', 'San Salvador', 'San Salvador Centro', 'San Salvador'),
(5, 6, 'Súper Selectos Los Angeles', 'Centro Comercial Los Angeles', 'Soyapango', 'San Salvador Este', 'San Salvador'),
(6, 7, 'Súper Selectos San Miguelito I', '27 C. Pte y 3a Av. Nte. ', 'San Salvador', 'San Salvador Centro', 'San Salvador'),
(7, 8, 'Súper Selectos Metrosur', 'Planta Baja Metrocentro Sur # 413', 'San Salvador', 'San Salvador Centro', 'San Salvador'),
(8, 9, 'Súper Selectos Escalón', 'Paseo General Escalón, Cntr. Com. El Paseo Local Ancla 7, ', 'San Salvador', 'San Salvador Centro', 'San Salvador'),
(9, 10, 'Súper Selectos Miralvalle I', 'Bvrd. San Antonio Abad, Edif. Balam Acab., ', 'San Salvador', 'San Salvador Centro', 'San Salvador'),
(10, 11, 'Súper Selectos Metrocentro', 'Metrocentro 6a Etapa, ', 'San Salvador', 'San Salvador Centro', 'San Salvador'),
(11, 13, 'Súper Selectos Soyapango', '4a Av. Sur y ; Centro Comercial Soyapango, ', 'Soyapango', 'San Salvador Este', 'San Salvador'),
(12, 14, 'Súper Selectos Novocentro', '2a. Calle Pte. Y 6a.Av. Sur,  ', 'Santa Tecla', 'La Libertad Sur', 'La Libertad'),
(13, 15, 'Súper Selectos Sonsonate ', '6a. Av. Y C. Obispo Marroquín,  ', 'Sonsonate', 'Sonsonate Centro', 'Sonsonate'),
(14, 16, 'Súper Selectos Mejicanos', 'Final 5a. Av. Nte. Universitaria, ', 'Mejicanos, ', 'San Salvador Centro', 'San Salvador'),
(15, 17, 'Súper Selectos Santa Ana Colón', 'Av. Moraga Sur y 11 Calle Poniente, ', 'Santa Ana', 'Santa Ana Centro', 'Santa Ana'),
(16, 18, 'Súper Selectos San Miguel Barrios', '4a.Av.Sur y 7a Calle Oriente', 'San ,Miguel', 'San Miguel Centro', 'San ,Miguel'),
(17, 19, 'Súper Selectos San Luis', 'Calle San Antonio Abad y Av. Izalco, ', 'San Salvador', 'San Salvador Centro', 'San Salvador'),
(18, 20, 'Súper Selectos Metropolis', 'Av. Bernal y Calle Zacamil, Centro Comercial Plaza Metropolis', 'Mejicanos', 'San Salvador Centro', 'San Salvador'),
(19, 21, 'Súper Selectos Los Santos', 'Calle a Santa Tecla y Calle Amberes, ', 'San Salvador', 'San Salvador Centro', 'San Salvador'),
(20, 22, 'Súper Selectos San Miguel Galerias', 'Av. Roosevelt y Calle Almendros, ', 'San ,Miguel', 'San Miguel Centro', 'San ,Miguel'),
(21, 23, 'Súper Selectos Apopa I', 'Km. 12 Carretera Troncal del Norte CC Pericentro ', 'Apopa', 'San Salvador Oeste', 'San Salvador'),
(22, 24, 'Súper Selectos Autopista sur', 'Calle al Estadio Cuscatlan y Autopista Sur, Centro Comercial Autopista Sur', 'San Salvador', 'San Salvador Centro', 'San Salvador'),
(23, 25, 'Súper Selectos Zacamil', '29 Av. Nte. Y Calle Zacamil, CC Zacamil,  ', 'Mejicanos, ', 'San Salvador Centro', 'San Salvador'),
(24, 26, 'Súper Selectos  Plaza Merliot', 'Calle chiltiupan, Entre 17a y 21a AV. Norte., CC Plaza Merliot, ', 'Santa Tecla', 'La Libertad Sur', 'La Libertad'),
(25, 27, 'Súper Selectos Zacatecoluca', 'Av.Monterrey  y 1a. Calle Oriente; ', 'Zacatecoluca', 'La Paz Este', 'La Paz'),
(26, 28, 'Súper Selectos Santa Ana Centro', '2a. Calle Pte. Y 2a. Av. Nte.# 5, ', 'Santa Ana', 'Santa Ana Centro', 'Santa Ana'),
(27, 29, 'Súper Selectos Centro Libertad', '4ta. Calle Oriente # L-7 entre 2a y 4 4ta. Av. Sur.', 'San Salvador', 'San Salvador Centro', 'San Salvador'),
(28, 30, 'Súper Selectos Ahuachapán', 'Carretera Ahuachapan desvío a Sonsonate', 'Ahuachapan', 'Ahuachapan Centro', 'Ahuachapan'),
(29, 31, 'Súper Selectos San Jacinto', 'C.Mexico y Av. Diplomáticos Barrio San Jacinto, ', 'San Salvador', 'San Salvador Centro', 'San Salvador'),
(30, 32, 'Súper Selectos Ciudad Delgado', 'Av. Paleca y Calle la Joya, ', 'Ciudad Delgado', 'San Salvador Centro', 'San Salvador'),
(31, 33, 'Súper Selectos Usulután', 'Carretera del Litoral Plaza Com.Puerta de oriente ', 'Usulutan', 'Usulutan Este', 'Usulutan'),
(32, 34, 'Súper Selectos Santa Ana Metrocentro', 'Centro Comercial Metrocentro ', 'Santa Ana', 'Santa Ana Centro', 'Santa Ana'),
(33, 36, 'Súper Selectos España', 'Entre Avenida España y Tercera C. Poniente, ', 'San Salvador', 'San Salvador Centro', 'San Salvador'),
(34, 37, 'Súper Selectos Arce', 'Calle Arce #470 Distrito Comercial Central ', 'San Salvador', 'San Salvador Centro', 'San Salvador'),
(35, 38, 'Súper Selectos Bethoven', 'Avenida Altamira,  Paseo General Escalón, Col. Escalon', 'San Salvador', 'San Salvador Centro', 'San Salvador'),
(36, 39, 'Súper Selectos Merliot II', 'Calle la Cañada y Boulevard Merliot', 'Santa Tecla', 'La Libertad Sur', 'La Libertad'),
(37, 40, 'Súper Selectos Centro Antel ', 'Calle Ruben Dario Y 5a. Av. Sur #411', 'San Salvador', 'San Salvador Centro', 'San Salvador'),
(38, 42, 'Súper Selectos Masferrer', 'Final Paseo Escalón Frente Redondel Masferrer ', 'San Salvador', 'San Salvador Centro', 'San Salvador'),
(39, 43, 'Súper Selectos la Sultana', 'Bvrd.y Av. La Ceiba # 7 Antiguo Cuscatlan ', 'Antiguo Cuscatlan', 'La Libertad Este', 'La Libertad'),
(40, 44, 'Súper Selectos Santa Tecla', '2a Calle Oriente y 3a. Av.Nte. No 2-9 ', 'Santa Tecla', 'La Libertad Sur', 'La Libertad'),
(41, 45, 'Súper Selectos Sonsonate II', 'Av.Oidor Ramirez de Quiñonez y Paseo 15 de Septiembre', 'Sonsonate', 'Sonsonate Centro', 'Sonsonate'),
(42, 46, 'Súper Selectos San Miguel Terminal', 'Final 4a. Av. Nte. Ruta Militar', 'San ,Miguel', 'San Miguel Centro', 'San ,Miguel'),
(43, 47, 'Súper Selectos Apopa II', 'Km.12 1/2, Carretera Troncal del Norte', 'Apopa', 'San Salvador Oeste', 'San Salvador'),
(44, 48, 'Súper Selectos Centro San José', '6a.  Av. Norte y 1a.C. Pte. #  334 S.S.', 'San Salvador', 'San Salvador Centro', 'San Salvador'),
(45, 49, 'Súper Selectos San Miguelito II', ' 29 Calle  Pte. Y 5a Av. Norte. ', 'San Salvador', 'San Salvador Centro', 'San Salvador'),
(46, 50, 'Súper Selectos Miralvalle II', 'Blvd. Constitución y Calle a Motocross', 'San Salvador', 'San Salvador Centro', 'San Salvador'),
(47, 52, 'Súper Selectos Mega Selectos', 'Entre C. a Tonacatepeque y C. Plan del pino', 'Soyapango', 'San Salvador Este', 'San Salvador'),
(48, 53, 'Súper Selectos San Benito', 'Av.Las Magnolias, Polg \"A\", Block \"B\" #11, San Benito', 'San Salvador', 'San Salvador Centro', 'San Salvador'),
(49, 54, 'Súper Selectos Santa Lucía', 'Av. Principal Ex cine renovacion, col.santa lucia', 'Ilopango', 'San Salvador Este', 'San Salvador'),
(50, 55, 'Súper Selectos La Cima', 'C.a Huizucar entre Pje.Recinos y C.La Constitución', 'San Salvador', 'San Salvador Centro', 'San Salvador'),
(51, 57, 'Súper Selectos  Usulután Centro', '1a. Calle Ote. # 42 Barrio El Calvario', 'Usulutan', 'Usulutan Este', 'Usulutan'),
(52, 58, 'Súper Selectos San Vicente', '2a. Av. Sur.ex -local arena ', 'San Vicente', 'San Vicente Sur', 'San Vicente'),
(53, 59, 'Súper  Selectos Ilobasco II', 'Av.Carlos Bonilla y 1a.Calle Pte. # 11', 'Ilobasco', 'Cabañas Oeste', 'Cabañas'),
(54, 60, 'Súper  Selectos Cojutepeque II', '1A. Av. Sur y 4a. Calle Pte.', 'Cojutepeque', 'Cuscatlán Sur', 'Cuscatlan'),
(55, 61, 'Súper Selectos San Martín', 'Av. Morazán # 17 ', 'San Martin', 'San Salvador Este', 'San Salvador'),
(56, 62, 'Súper Selectos Aguilares', 'Av. Central Nte. Final 2a Calle Oriente', 'Aguilares', 'San Salvador Norte', 'San Salvador'),
(57, 63, 'Súper Selectos Libertad', 'Pje. San José # 11-3 Puerto de la Libertad', 'La Libertad', 'La Libertad Costa', 'La Libertad'),
(58, 64, 'Súper Selectos Lourdes', 'Av. 5 de Nov. Carretera a San Salvador', 'Colon', 'La Libertad Oeste', 'La Libertad'),
(59, 65, 'Súper  Selectos Cara Sucia', 'Carr. A la Front.La Hachadura,  Cara Sucia', 'San Francisco Menendez', 'Ahuachapan Sur', 'Ahuachapan'),
(60, 66, 'Súper  Selectos Chalchuapa', 'Callejón Santa #1-Bis', 'Chalchuapa', 'Santa Ana Oeste', 'Santa Ana'),
(61, 67, 'Súper  Selectos Ahuachapan II', '8a. Calle Pte.Frente al parque de Ahuchapán', 'Ahuachapan', 'Ahuachapan Centro', 'Ahuachapan'),
(62, 68, 'Súper Selectos  Metapán', 'Carrt. A Guatemala,EX Cine Orellana', 'Metapan', 'Santa Ana Norte', 'Santa Ana'),
(63, 69, 'Súper Selectos Sonsonate  III', 'Ctro. Comercial Metrocentro Ancla # 4', 'Sonsonate', 'Sonsonate Centro', 'Sonsonate'),
(64, 201, 'Súper Selectos Apopa III', 'Carretera Troncal del Norte Km. 12, CC Peri Plaza', 'Apopa', 'San Salvador Oeste', 'San Salvador'),
(65, 203, 'Súper Selectos Plaza Mundo ', 'Km. 4 1/2 Boulev. del Ejercito, C.C. Plaza Mundo,Ancla \"A\"', 'Soyapango', 'San Salvador Este', 'San Salvador'),
(66, 205, 'Súper Selectos Multiplaza', 'Centro Comercial Multiplaza, Ancla #3 Edificio F', 'Antiguo Cuscatlan', 'La Libertad Este', 'La Libertad'),
(67, 206, 'Súper Selectos Lourdes II', '2a y 4a Calle Oriente #1-1', 'Colon', 'La Libertad Oeste', 'La Libertad'),
(68, 207, 'Súper Selectos Santa Rosa de Lima', 'Av.Fernando Benitez y 1a.  Calle Poniente Sta.Rosa de Lima, ', 'Santa Rosa De Lima', 'La Union Norte', 'La Union'),
(69, 208, 'Súper Selectos El Faro', 'Carretera el Litoral KM 23 1/2, Ancla B1 Centro Comercial el Faro, ', 'La Libertad', 'La Libertad Costa', 'La Libertad'),
(70, 209, 'Súper Selectos La Joya', 'Kilometro 12  Zona \"A\" Centro Comercial la Joya Local E', 'Santa Tecla', 'La Libertad Sur', 'La Libertad'),
(71, 210, 'Súper Selectos Ciudad Real', 'Canton Los Amate Ciudad Real jurisdiccion de san sebastian, ', 'Chalchuapa', 'Santa Ana Oeste', 'Santa Ana'),
(72, 211, 'Súper Selectos San Miguel Centro', '8a.  calle pte entre 3 y av. Nte Barrio  San francisco  ', 'San ,Miguel', 'San Miguel Centro', 'San ,Miguel'),
(73, 212, 'Súper  Selectos Izalco', '9°Calle Poniente y final Av. Morazan Barrio Dolores, ', 'Izalco', 'Sonsonate Este', 'Sonsonate'),
(74, 213, 'Súper Selectos Juayua', 'Calle Mercedes Caceres Oriente y av. Daniel cordon', 'Juayua', 'Sonsonate Norte', 'Sonsonate'),
(75, 214, 'Súper Selectos Ilobasco', '4a. Calle Poniente y 3a. Av. Sur,', 'Ilobasco', 'Cabañas Oeste', 'Cabañas'),
(76, 215, 'Súper Selectos San Bartolo', 'Carretera Panamericana km. 10 1/2, Urbanización llano Verde', 'Ilopango', 'San Salvador Este', 'San Salvador'),
(77, 216, 'Súper Selectos Zaragoza ', '1a. Av. Nte Ancla L-2 # 15, Cond.  Plaza Zaragoza', 'Zaragoza', 'La Libertad Este', 'La Libertad'),
(78, 217, 'Súper Selectos Quezaltepeque', 'Calle Urrutia y Av. Delgado # 2', 'Quezaltepeque', 'La Libertad Norte', 'La Libertad'),
(79, 218, 'Súper Selectos La Unión II', '3a. y 5a.  Avenida Sur No. 2-3 Barrio Concepción', 'La Union', 'La Union Sur', 'La Union'),
(80, 219, 'Súper  Selectos Chalatenango', 'Calle Morazan y 2 av. Sur ', 'Chalatenango', 'Chalatenango Sur ', 'Chalatenango'),
(81, 220, 'Súper Selectos Sensuntepeque', '4a. Calle oriente Bo. Sta. Barbara #6', 'Sensuntepeque', 'Cabañas Este', 'Cabañas'),
(82, 221, 'Súper Selectos San Francisco Gotera', 'Entre 1a.  Calle Oriente, Av. Thompson Nte. Bo El Calvario', 'San Francisco Gotera', 'Morazan Sur', 'Morazan'),
(83, 222, 'Súper Selectos  Metrocentro 8av Etapa', 'Condominio Metrocentro 8av. Etapa, Local No. 281', 'San Salvador', 'San Salvador Centro', 'San Salvador'),
(84, 225, 'Súper Selectos San Miguel  Plaza Viva', 'Centro Comercial Plaza Viva, Avenida Roosevelt, Km 141, Jurisdicción de San Miguel', 'San ,Miguel', 'San Miguel Centro', 'San ,Miguel'),
(85, 226, 'Súper Selectos Cojutepeque Centro', 'Barrio El Centro y Calle Matias  Delgado', 'Cojutepeque', 'Cuscatlán Sur', 'Cuscatlan'),
(86, 227, 'Súper Selectos Jiquilisco', '2a. Avenida sur y 2a. Calle Oriente #1, Barrio El Calvario', 'Jiquilisco', 'Usulutan Oeste', 'Usulutan'),
(87, 228, 'Súper Selectos Las Palmas', 'km. 12 1/2 carretera al puerto de la libertad, centro comercial las palmas', 'Santa Tecla', 'La Libertad Sur', 'La Libertad'),
(88, 229, 'Súper Selectos Santa Rosa de Lima II', 'Barrio El Calvario', 'Santa Rosa De Lima', 'La Union Norte', 'La Union'),
(89, 230, 'Súper Selectos La Union', 'Barrio Honduras, Calle San Carlos, 4a Avenida Sur ·1-1', 'La Union', 'La Union Sur', 'La Union'),
(90, 231, 'Súper  Selectos El Transito', 'Av. Ferrocarril #5 barrio la cruz ', 'El Transito', 'San Miguel Oeste', 'San Miguel'),
(91, 232, 'Súper Selectos Santa Elena', 'Avenida Izalco, Block número 8, Boulevard Santa Elena ', 'Antiguo Cuscatlan', 'La Libertad Este', 'La Libertad'),
(92, 233, 'Súper Selectos Santiago de Maria ', 'Calle Bolívar, entre 2a y 4a Av. Norte, Barrio el centro', 'Santiago De Maria ', 'Usulutan Norte', 'Usulutan'),
(93, 234, 'Súper  Selectos Atiquizaya ', ' Av. 5 de Nov. Y calle central  n° 4-107,Barrio el centro ', 'Atiquizaya', 'Ahuachapa Norte', 'Ahuachapan'),
(94, 235, 'Súper Selectos Santo Tomas', 'Kilometro 18 sobre carretera a comalapa y kilometro 13 sobre calle antigua a zacatecoluca', 'Santo Tomas', 'San Salvador Sur', 'San Salvador'),
(95, 236, 'Súper Selectos Santa Rosa', 'Centro Comercial Sta. Rosa, final boulevard Monseñor Romero, intercepción con Calle Real y Prolongación 9° av. Poniente', 'Santa Tecla', 'La Libertad Sur', 'La Libertad'),
(96, 237, 'Súper Selectos El Encuentro', 'Km. 24 1/2 Carretera a Santa Ana Local Ancla Centro Comercial El Encuentro', 'Colon', 'La Libertad Oeste', 'La Libertad'),
(97, 238, 'Súper Selectos Las Cascadas', 'Centro Comercial Las Cascadas, Interseccion de la Calle Chiltiupán, Avenida Masferrer y Carretera Panamericana', 'Antiguo Cuscatlan', 'La Libertad Este', 'La Libertad'),
(98, 239, 'Súper  Selectos San Gabriel', 'Urbanizacion San Gabriel, Suchinango, Centro Comercial Metromall, San Gabriel, Ancla H, Nivel 1', 'Apopa', 'San Salvador Oeste', 'San Salvador'),
(99, 240, 'Súper  Selectos San Marcos El Encuentro', 'Centro Comercial El Encuentro San Marcos, Local Ancla, Calle antigua a Zacatecoluca', 'San Marcos', 'San Salvador Sur', 'San Salvador'),
(100, 241, 'Súper  Selectos El Encuentro El Sitio', 'Centro Comercial El encuentro El Sitio, Local Ancla, Carretera Panamericana y Calle Antigua a Quelepa, Canton El Sitio', 'San Miguel ', 'San Miguel  Centro', 'San Miguel '),
(101, 242, 'Súper  Selectos Plaza Mundo Apopa', 'Km. 12 ,  Carretera Troncal del Norte, Centro Comercial Plaza Mundo, Local ANC-01-1F', 'Apopa', 'San Salvador Oeste', 'San Salvador'),
(102, 243, 'Súper  Selectos San Martin El Encuentro', 'Centro Comercial El Encuentro San Martin, Local Ancla, Km. 15 1/2, Carretera Panamericana, Canton Las Palmas', 'San Martin', 'San Salvador Este', 'San Salvador'),
(103, 244, 'Súper  Selectos Opico El Encuentro', 'Centro Comercial El Encuentro Opico, Local Ancla, Colonia Oscar Osorio, Polígono 2, Lote Numero 5', 'San Juan Opico', 'La Libertad Centro', 'La Libertad'),
(104, 245, 'Súper  Selectos Sonsonate  El Encuentro', 'Centro Comercial El Encuentro Sonsonate, Local Ancla, Barrio El Ángel, Hacienda El Cañal', 'Sonsonate', 'Sonsonate Centro', 'Sonsonate'),
(105, 246, 'Súper  Selectos Marsella', 'Centro Comercial Marsella, Kilometro 34 1/2 Sobre Carretera a San Juan Opico', 'San Juan Opico', 'La Libertad Centro', 'La Libertad'),
(106, 247, 'Súper  Selectos Aguilares El Encuentro', 'Centro Comercial El Encuentro, Local Ancla, Hacienda Pishishapa, Lote N°2', 'Aguilares', 'San Salvador Norte', 'San Salvador'),
(107, 248, 'Súper  Selectos Santa Tecla Las Ramblas', 'Centro Comercial Las Ramblas, Local Ancla 1, Kilometro 10 1/2, Carretera Panamericana', 'Santa Tecla', 'La Libertad Sur', 'La Libertad'),
(108, 249, 'Súper Selectos Acajutla', 'Centro Comercial Acajutla, local Ancla, Avenida Obando y Calle las Conchitas', 'Acajutla', 'Sonsonate Oeste', 'Sonsonate'),
(109, 250, 'Súper Selectos Santa Ana Las Ramblas', 'Centro Comercial Las Ramblas Santa Ana, Local Ancla seis, Carretera Panamericana y Calle Portezuelo, Cantón Comecayo', 'Santa Ana', 'Santa Ana Centro', 'Santa Ana'),
(110, 251, 'Súper Selectos Valle Dulce El Encuentro', 'Centro Comercial El Encuentro Valle Dulce, Ancla Uno, Hacienda El ángel L-1', 'Apopa', 'San Salvador Oeste', 'San Salvador'),
(111, 252, 'Súper Selectos Haciendas del Mediterraneo', 'Centro Comercial Mall Mediterráneo, Local Ancla, Residencial Eco Tierra Hacienda, Lote Comercial,   Cantón Chipilapa', 'Ahuachapan', 'Ahuachapan Centro', 'Ahuachapan'),
(112, 253, 'Súper Selectos Distrito Zaragoza', 'Centro Comercial Distrito Zaragoza, kilómetro 20, Carretera al Puerto de la Libertad y desvío a San José Villanueva', 'Zaragoza', 'La Libertad Este', 'La Libertad'),
(113, 254, 'Súper Selectos Plaza Mundo Usulután', 'Centro Comercial Plaza Mundo Usulután, Kilometro 119, Local Ancla ANC 022A, Carretera del Litoral CA – DOS y Ruta Nacional Catorce, Cantón Ojo de Agua', 'Usulutan', 'Usulutan Este', 'Usulutan'),
(114, 255, 'Súper Selectos San Miguel Panamericana', 'Centro Comercial Mall  Panamericana Local Ancla, Residencial Villa Panamericana, Cantón Papalón', 'San ,Miguel', 'San Miguel Centro', 'San ,Miguel'),
(115, 256, 'Súper  Selectos La Libertad el Encuentro', 'Centro Comercial El Encuentro La Libertad, Local Ancla Uno, Jurisdiccion de el Puerto de La Libertad, ', 'La Libertad', 'La Libertad Costa', 'La Libertad'),
(116, 257, 'Súper Selectos Soyapango Espíritu Santo', 'Centro Comercial Boulevard Espiritu Santo,Local Ancla N° 3, Kilometro 20, Carretera de Oro, Distrito Soyapango, Municipio de San Salvador Este, Departamento San Salvador. ', 'Soyapango', 'San Salvador Este', 'San Salvador'),
(117, 258, 'Súper Selectos Zacatecoluca El Encuentro', 'Centro Comercial El Encuentro, Local Ancla Uno, Cantón Ulapa.', 'Zacatecoluca', 'La Paz Este', 'La Paz');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sale`
--

CREATE TABLE `sale` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `customer` varchar(255) DEFAULT NULL,
  `total` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `supplier`
--

CREATE TABLE `supplier` (
  `id` bigint(20) NOT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `enabled` bit(1) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `rol` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre`, `correo`, `password`, `rol`) VALUES
(1, 'Administrador', 'admin@chef.com', '{noop}admin123', 'ADMIN');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `audit_log`
--
ALTER TABLE `audit_log`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `delivery`
--
ALTER TABLE `delivery`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKnp2buu5x43cjgpdvjkby8kxk4` (`dui`);

--
-- Indices de la tabla `inventory_item`
--
ALTER TABLE `inventory_item`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `inventory_lot`
--
ALTER TABLE `inventory_lot`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKogohaw01h3tg3a4wdqrqbwa76` (`product_id`);

--
-- Indices de la tabla `inventory_movement`
--
ALTER TABLE `inventory_movement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKthylg3mxipg6vk3a30p1bcas6` (`lot_id`),
  ADD KEY `FKd3qrr9gsj573m4udrauik1j87` (`product_id`);

--
-- Indices de la tabla `orden`
--
ALTER TABLE `orden`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_orden_producto` (`producto_id`);

--
-- Indices de la tabla `ot_operation_logs`
--
ALTER TABLE `ot_operation_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `ot_purchases`
--
ALTER TABLE `ot_purchases`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `payroll_entry`
--
ALTER TABLE `payroll_entry`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `payroll_period`
--
ALTER TABLE `payroll_period`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKq1mafxn973ldq80m1irp3mpvq` (`sku`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `idx_product_sku` (`sku`);

--
-- Indices de la tabla `production_order`
--
ALTER TABLE `production_order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKe218pegigffxwke9ghn6snfwr` (`output_product_id`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `receipt`
--
ALTER TABLE `receipt`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK76be0gur5257gn4ocs942s9ml` (`supplier_id`);

--
-- Indices de la tabla `receipt_item`
--
ALTER TABLE `receipt_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKadhg4s6y4syjwnexabmyxkuyn` (`product_id`),
  ADD KEY `FKsohgmt8ntavcgj10ha2duc8la` (`receipt_id`);

--
-- Indices de la tabla `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKj2trs11atork1k3rcndhrd26n` (`store_code`);

--
-- Indices de la tabla `salas`
--
ALTER TABLE `salas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `sale`
--
ALTER TABLE `sale`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `audit_log`
--
ALTER TABLE `audit_log`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `delivery`
--
ALTER TABLE `delivery`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `employees`
--
ALTER TABLE `employees`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `inventory_item`
--
ALTER TABLE `inventory_item`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inventory_lot`
--
ALTER TABLE `inventory_lot`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inventory_movement`
--
ALTER TABLE `inventory_movement`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `orden`
--
ALTER TABLE `orden`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `ot_operation_logs`
--
ALTER TABLE `ot_operation_logs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `ot_purchases`
--
ALTER TABLE `ot_purchases`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `payroll_entry`
--
ALTER TABLE `payroll_entry`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `payroll_period`
--
ALTER TABLE `payroll_period`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `product`
--
ALTER TABLE `product`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `production_order`
--
ALTER TABLE `production_order`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `receipt`
--
ALTER TABLE `receipt`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `receipt_item`
--
ALTER TABLE `receipt_item`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `room`
--
ALTER TABLE `room`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `salas`
--
ALTER TABLE `salas`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT de la tabla `sale`
--
ALTER TABLE `sale`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `supplier`
--
ALTER TABLE `supplier`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `inventory_lot`
--
ALTER TABLE `inventory_lot`
  ADD CONSTRAINT `FKogohaw01h3tg3a4wdqrqbwa76` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Filtros para la tabla `inventory_movement`
--
ALTER TABLE `inventory_movement`
  ADD CONSTRAINT `FKd3qrr9gsj573m4udrauik1j87` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  ADD CONSTRAINT `FKthylg3mxipg6vk3a30p1bcas6` FOREIGN KEY (`lot_id`) REFERENCES `inventory_lot` (`id`);

--
-- Filtros para la tabla `orden`
--
ALTER TABLE `orden`
  ADD CONSTRAINT `fk_orden_producto` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id`);

--
-- Filtros para la tabla `production_order`
--
ALTER TABLE `production_order`
  ADD CONSTRAINT `FKe218pegigffxwke9ghn6snfwr` FOREIGN KEY (`output_product_id`) REFERENCES `product` (`id`);

--
-- Filtros para la tabla `receipt`
--
ALTER TABLE `receipt`
  ADD CONSTRAINT `FK76be0gur5257gn4ocs942s9ml` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`);

--
-- Filtros para la tabla `receipt_item`
--
ALTER TABLE `receipt_item`
  ADD CONSTRAINT `FKadhg4s6y4syjwnexabmyxkuyn` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  ADD CONSTRAINT `FKsohgmt8ntavcgj10ha2duc8la` FOREIGN KEY (`receipt_id`) REFERENCES `receipt` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
