-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for aerocontrol
DROP DATABASE IF EXISTS `aerocontrol`;
CREATE DATABASE IF NOT EXISTS `aerocontrol` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `aerocontrol`;

-- Dumping structure for table aerocontrol.aeropuerto
DROP TABLE IF EXISTS `aeropuerto`;
CREATE TABLE IF NOT EXISTS `aeropuerto` (
  `id_aeropuerto` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `pais` varchar(100) DEFAULT NULL,
  `estado` varchar(100) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_aeropuerto`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table aerocontrol.aeropuerto: ~2 rows (approximately)
REPLACE INTO `aeropuerto` (`id_aeropuerto`, `nombre`, `pais`, `estado`, `ciudad`) VALUES
	(1, 'papa', 'papa', 'apap', 'appa'),
	(2, 'asdas', 'asdasd', 'asd', 'asd');

-- Dumping structure for table aerocontrol.avion
DROP TABLE IF EXISTS `avion`;
CREATE TABLE IF NOT EXISTS `avion` (
  `id_avion` int(11) NOT NULL AUTO_INCREMENT,
  `modelo` varchar(100) DEFAULT NULL,
  `capacidad_pasajeros` int(11) DEFAULT NULL,
  `aerolinea` varchar(100) DEFAULT NULL,
  `pesoCargaMaximo` bigint(20) NOT NULL,
  `CargaActual` bigint(20) DEFAULT 0,
  `id_ultimoAeropuerto` int(11) DEFAULT 1,
  `ultima_hora_llegada` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_avion`),
  KEY `id_ultimoAeropuerto` (`id_ultimoAeropuerto`),
  CONSTRAINT `id_ultimoAeropuerto` FOREIGN KEY (`id_ultimoAeropuerto`) REFERENCES `vuelo` (`id_aeropuerto_destino`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table aerocontrol.avion: ~2 rows (approximately)
REPLACE INTO `avion` (`id_avion`, `modelo`, `capacidad_pasajeros`, `aerolinea`, `pesoCargaMaximo`, `CargaActual`, `id_ultimoAeropuerto`, `ultima_hora_llegada`) VALUES
	(1, '1', 100, '1', 500, 20, 2, '2025-11-29 16:53:00'),
	(2, 'P3', 300, 'papichulo', 6000, 0, 2, '2025-12-03 08:23:00');

-- Dumping structure for table aerocontrol.boleto
DROP TABLE IF EXISTS `boleto`;
CREATE TABLE IF NOT EXISTS `boleto` (
  `id_boleto` int(11) NOT NULL AUTO_INCREMENT,
  `id_pasajero` int(11) DEFAULT NULL,
  `tipoPasajero` varchar(30) NOT NULL,
  `id_vuelo` int(11) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `terminal` varchar(50) DEFAULT NULL,
  `asiento` varchar(10) DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'No-Emitido',
  PRIMARY KEY (`id_boleto`),
  KEY `id_pasajero` (`id_pasajero`),
  KEY `id_vuelo` (`id_vuelo`),
  CONSTRAINT `boleto_ibfk_1` FOREIGN KEY (`id_pasajero`) REFERENCES `pasajero` (`id_pasajero`),
  CONSTRAINT `boleto_ibfk_2` FOREIGN KEY (`id_vuelo`) REFERENCES `vuelo` (`id_vuelo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table aerocontrol.boleto: ~5 rows (approximately)
REPLACE INTO `boleto` (`id_boleto`, `id_pasajero`, `tipoPasajero`, `id_vuelo`, `precio`, `terminal`, `asiento`, `estado`) VALUES
	(1, 1, '', 1, 50.00, '1', 'A2', 'Emitido'),
	(2, 1, '', 2, 50.00, 'A4', 'asd', 'Emitido'),
	(3, 1, '', 2, 53.00, '2', '1', 'Emitido'),
	(4, 1, '', 3, 2141.00, 'as', 'a2', 'Emitido'),
	(5, 1, '', 3, 43223.00, 'A', 'd', 'Emitido');

-- Dumping structure for view aerocontrol.datos_pasajeros
DROP VIEW IF EXISTS `datos_pasajeros`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `datos_pasajeros` (
	`nombre` VARCHAR(1) NULL COLLATE 'utf8mb4_general_ci',
	`apellido` VARCHAR(1) NULL COLLATE 'utf8mb4_general_ci',
	`correo` VARCHAR(1) NULL COLLATE 'utf8mb4_general_ci'
) ENGINE=MyISAM;

-- Dumping structure for table aerocontrol.equipaje
DROP TABLE IF EXISTS `equipaje`;
CREATE TABLE IF NOT EXISTS `equipaje` (
  `id_equipaje` int(11) NOT NULL AUTO_INCREMENT,
  `id_pasajero` int(11) DEFAULT NULL,
  `peso` decimal(10,2) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_equipaje`),
  KEY `id_pasajero` (`id_pasajero`),
  CONSTRAINT `equipaje_ibfk_1` FOREIGN KEY (`id_pasajero`) REFERENCES `pasajero` (`id_pasajero`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table aerocontrol.equipaje: ~2 rows (approximately)
REPLACE INTO `equipaje` (`id_equipaje`, `id_pasajero`, `peso`, `tipo`, `estado`) VALUES
	(1, 1, 6.00, NULL, 'Abordando'),
	(2, 1, 14.00, NULL, 'Abordando'),
	(3, 1, 100.00, NULL, 'Abordando');

-- Dumping structure for table aerocontrol.pasajero
DROP TABLE IF EXISTS `pasajero`;
CREATE TABLE IF NOT EXISTS `pasajero` (
  `id_pasajero` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `edad` int(11) NOT NULL,
  `nacionalidad` varchar(40) NOT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_pasajero`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table aerocontrol.pasajero: ~1 rows (approximately)
REPLACE INTO `pasajero` (`id_pasajero`, `nombre`, `apellido`, `edad`, `nacionalidad`, `correo`, `telefono`) VALUES
	(1, 'A', 'A', 32, 'aa', '@gmail.com', 'afasd');

-- Dumping structure for table aerocontrol.usuarios
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `rol` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `usuario` (`usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-
INSERT INTO usuarios (id_usuario, nombre, password, rol) VALUES 
(1'admin', 'pass123', 'administrador'),
(2,'analista', 'pass123', 'analista'),
(3,'general', 'pass123', 'general');
   
UPDATE usuarios SET rol = 'administrador' WHERE usuario = 'admin';
UPDATE usuarios SET rol = 'analista' WHERE usuario = 'analista'; 
UPDATE usuarios SET rol = 'general' WHERE usuario = 'general';


CREATE USER IF NOT EXISTS 'admin_aeropuerto'@'localhost' IDENTIFIED BY 'Admin123';
GRANT ALL PRIVILEGES ON aerocontrol.* TO 'admin_aeropuerto'@'localhost' WITH GRANT OPTION;

--Analista
CREATE USER IF NOT EXISTS 'analista'@'localhost' IDENTIFIED BY 'Analista123';
GRANT SELECT ON aerocontrol.* TO 'analista'@'localhost';

--Usuario General
CREATE USER IF NOT EXISTS 'usuario'@'localhost' IDENTIFIED BY 'Usuario123';

-- Ver vuelos
GRANT SELECT ON aerocontrol.vuelo TO 'usuario'@'localhost';

-- Ver aeropuertos
GRANT SELECT ON aerocontrol.aeropuerto TO 'usuario'@'localhost';

-- Ver pasajeros
GRANT SELECT ON aerocontrol.pasajero TO 'usuario'@'localhost';

-- Registrar nuevos pasajeros
GRANT INSERT ON aerocontrol.pasajero TO 'usuario'@'localhost';

-- Ver equipaje
GRANT SELECT ON aerocontrol.equipaje TO 'usuario'@'localhost';

-- Dumping structure for table aerocontrol.vuelo
DROP TABLE IF EXISTS `vuelo`;
CREATE TABLE IF NOT EXISTS `vuelo` (
  `id_vuelo` int(11) NOT NULL AUTO_INCREMENT,
  `hora_salida` datetime DEFAULT NULL,
  `hora_llegada` datetime DEFAULT NULL,
  `id_aeropuerto_origen` int(11) DEFAULT NULL,
  `id_aeropuerto_destino` int(11) DEFAULT NULL,
  `id_avion` int(11) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_vuelo`),
  KEY `id_aeropuerto_origen` (`id_aeropuerto_origen`),
  KEY `id_aeropuerto_destino` (`id_aeropuerto_destino`),
  KEY `id_avion` (`id_avion`),
  CONSTRAINT `vuelo_ibfk_1` FOREIGN KEY (`id_aeropuerto_origen`) REFERENCES `aeropuerto` (`id_aeropuerto`),
  CONSTRAINT `vuelo_ibfk_2` FOREIGN KEY (`id_aeropuerto_destino`) REFERENCES `aeropuerto` (`id_aeropuerto`),
  CONSTRAINT `vuelo_ibfk_3` FOREIGN KEY (`id_avion`) REFERENCES `avion` (`id_avion`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table aerocontrol.vuelo: ~8 rows (approximately)
REPLACE INTO `vuelo` (`id_vuelo`, `hora_salida`, `hora_llegada`, `id_aeropuerto_origen`, `id_aeropuerto_destino`, `id_avion`, `estado`) VALUES
	(1, '2025-11-14 22:08:00', '2025-11-28 22:06:00', 2, 1, 1, 'Cancelado'),
	(2, '2025-11-28 22:07:00', '2025-11-29 22:07:00', 2, 1, 1, 'Programado'),
	(3, '2025-11-15 22:07:00', '2025-11-28 22:07:00', 1, 2, 1, 'Cancelado'),
	(4, '2025-11-27 09:17:00', '2025-11-29 09:17:00', 1, 2, 1, 'Programado'),
	(5, '2025-11-27 22:03:00', '2025-11-29 10:03:00', 2, 1, 1, 'Programado'),
	(6, '2025-11-27 10:04:00', '2025-11-29 10:04:00', 1, 2, 1, 'Programado'),
	(7, '2025-11-28 10:04:00', '2025-11-29 10:04:00', 2, 1, 1, 'Programado'),
	(8, '2025-11-26 16:31:00', '2025-11-27 16:32:00', 1, 2, 1, 'Cancelado'),
	(13, '2025-11-27 16:35:00', '2025-11-28 16:35:00', 2, 1, 1, 'Programado'),
	(14, '2025-11-28 16:53:00', '2025-11-29 16:53:00', 1, 2, 1, 'Cancelado'),
	(15, '2025-12-01 08:22:00', '2025-12-03 08:23:00', 1, 2, 2, 'Programado');

-- Dumping structure for view aerocontrol.vuelos_a_abordar
DROP VIEW IF EXISTS `vuelos_a_abordar`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `vuelos_a_abordar` (
	`hora_salida` DATETIME NULL,
	`id_avion` INT(11) NULL,
	`nombre` VARCHAR(1) NULL COLLATE 'utf8mb4_general_ci',
	`estado` VARCHAR(1) NULL COLLATE 'utf8mb4_general_ci'
) ENGINE=MyISAM;

-- Dumping structure for trigger aerocontrol.actualizar_carga_avion_despues_emitir_boleto
DROP TRIGGER IF EXISTS `actualizar_carga_avion_despues_emitir_boleto`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `actualizar_carga_avion_despues_emitir_boleto` AFTER INSERT ON `boleto` FOR EACH ROW BEGIN
    DECLARE total_peso_equipaje DECIMAL(10, 2);
    DECLARE avion_id INT;

    -- 1. Obtener el ID del avión asociado al vuelo del nuevo boleto
    SELECT id_avion INTO avion_id
    FROM vuelo
    WHERE id_vuelo = NEW.id_vuelo;

    -- 2. Calcular la suma del peso de todo el equipaje del pasajero
    SELECT COALESCE(SUM(peso), 0) INTO total_peso_equipaje
    FROM equipaje
    WHERE id_pasajero = NEW.id_pasajero
    AND estado IN ('Abordo');

    -- 3. Actualizar la CargaActual del avión
    UPDATE avion
    SET CargaActual = CargaActual + total_peso_equipaje
    WHERE id_avion = avion_id;
    	
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger aerocontrol.actualizar_hora_llegada_avion
DROP TRIGGER IF EXISTS `actualizar_hora_llegada_avion`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `actualizar_hora_llegada_avion` AFTER INSERT ON `vuelo` FOR EACH ROW BEGIN
    UPDATE avion
    SET ultima_hora_llegada = NEW.hora_llegada
    WHERE id_avion = NEW.id_avion;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger aerocontrol.control_flujo_avion_vuelo
DROP TRIGGER IF EXISTS `control_flujo_avion_vuelo`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `control_flujo_avion_vuelo` BEFORE INSERT ON `vuelo` FOR EACH ROW BEGIN
    DECLARE ultimo_aeropuerto_id INT;
    DECLARE ultima_llegada DATETIME;
    DECLARE error_msg VARCHAR(512); 
    
    SELECT 
        COALESCE(id_ultimoAeropuerto, 1), 
        ultima_hora_llegada 
    INTO 
        ultimo_aeropuerto_id, 
        ultima_llegada
    FROM avion
    WHERE id_avion = NEW.id_avion;

    -- ===============================================
    -- validacion para el aeropuerto de origen
    -- ===============================================
    IF NEW.id_aeropuerto_origen <> ultimo_aeropuerto_id THEN
        SET error_msg = 'Error de flujo: El avion no esta en el aeropuerto de origen especificado.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_msg;
    END IF;

    -- ===============================================
    -- validacion para que la hora de donde sale sea mayor a la ultima de llegada
    -- ===============================================
    IF ultima_llegada IS NOT NULL AND NEW.hora_salida < ultima_llegada THEN
        SET error_msg = CONCAT('ERROR DE HORARIO: La salida debe ser posterior a la llegada anterior (', 
                               DATE_FORMAT(ultima_llegada, '%Y-%m-%d %H:%i:%s'), 
                               ').');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_msg;
    END IF;

    UPDATE avion
    SET id_ultimoAeropuerto = NEW.id_aeropuerto_destino
    WHERE id_avion = NEW.id_avion;
    
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `datos_pasajeros`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `datos_pasajeros` AS SELECT nombre, apellido, correo 
FROM pasajero 
;

-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `vuelos_a_abordar`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vuelos_a_abordar` AS SELECT hora_salida,vuelo.id_avion,aeropuerto.nombre,vuelo.estado
FROM vuelo INNER JOIN aeropuerto ON vuelo.id_aeropuerto_origen = aeropuerto.id_aeropuerto

/*------------------------------------------------DISPARADORES------------------------------------------------------*/ 
;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
