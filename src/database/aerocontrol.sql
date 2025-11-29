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
  `estado` varchar(16) DEFAULT 'En espera',
  PRIMARY KEY (`id_avion`),
  KEY `id_ultimoAeropuerto` (`id_ultimoAeropuerto`),
  CONSTRAINT `id_ultimoAeropuerto` FOREIGN KEY (`id_ultimoAeropuerto`) REFERENCES `vuelo` (`id_aeropuerto_destino`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table aerocontrol.avion: ~6 rows (approximately)
REPLACE INTO `avion` (`id_avion`, `modelo`, `capacidad_pasajeros`, `aerolinea`, `pesoCargaMaximo`, `CargaActual`, `id_ultimoAeropuerto`, `ultima_hora_llegada`, `estado`) VALUES
	(1, '1', 100, '1', 500, 0, 1, '2026-01-01 19:22:00', 'En espera'),
	(2, 'P3', 300, 'papichulo', 6000, 114, 1, '2025-12-12 19:08:00', 'En espera'),
	(3, 'AF', 124, 'AS', 1411, 0, 1, '2025-12-02 16:35:00', 'En espera'),
	(4, 'A@', 5, '12', 150, 0, 1, '2025-11-28 18:26:19', 'En mantenimiento'),
	(5, '12', 3, '411', 406, 0, 2, '2025-11-30 19:42:00', 'En espera'),
	(6, 'ad21', 2, '12', 64, 0, 2, '2025-11-30 18:28:00', 'En espera');

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
  `estado` varchar(20) DEFAULT 'No emitido',
  PRIMARY KEY (`id_boleto`),
  KEY `id_pasajero` (`id_pasajero`),
  KEY `id_vuelo` (`id_vuelo`),
  CONSTRAINT `boleto_ibfk_1` FOREIGN KEY (`id_pasajero`) REFERENCES `pasajero` (`id_pasajero`),
  CONSTRAINT `boleto_ibfk_2` FOREIGN KEY (`id_vuelo`) REFERENCES `vuelo` (`id_vuelo`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table aerocontrol.boleto: ~8 rows (approximately)
REPLACE INTO `boleto` (`id_boleto`, `id_pasajero`, `tipoPasajero`, `id_vuelo`, `precio`, `terminal`, `asiento`, `estado`) VALUES
	(7, 1, 'Normal', 18, 12312.00, 'aa', '11', 'Emitido'),
	(8, 1, 'Normal', 18, 3.00, '12', '11', 'Emitido'),
	(9, 1, 'Normal', 18, 500.00, 'aa', '1232', 'Invalido'),
	(12, 2, 'Mayor de Edad', 20, 390.00, 'asd', '123', 'Invalido'),
	(13, 1, 'Normal', 19, 134.00, '11', '11', 'Invalido'),
	(15, 1, 'Normal', 20, 123.00, '123', '123', 'Emitido'),
	(16, 1, 'Normal', 21, 1.00, '12', '12', 'Emitido'),
	(17, 2, 'Mayor de Edad', 22, 6.50, 'A@', 'A$', 'Emitido'),
	(18, 3, 'Normal', 23, 60.00, 'A#', 'W@', 'Emitido');

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
  `estado` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_equipaje`),
  KEY `id_pasajero` (`id_pasajero`),
  CONSTRAINT `equipaje_ibfk_1` FOREIGN KEY (`id_pasajero`) REFERENCES `pasajero` (`id_pasajero`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table aerocontrol.equipaje: ~3 rows (approximately)
REPLACE INTO `equipaje` (`id_equipaje`, `id_pasajero`, `peso`, `estado`) VALUES
	(9, 2, 41.00, 'Entregado'),
	(10, 3, 123.00, 'Para recoger');

-- Dumping structure for function aerocontrol.obtenerTipoPasajero
DROP FUNCTION IF EXISTS `obtenerTipoPasajero`;
DELIMITER //
CREATE FUNCTION `obtenerTipoPasajero`(p_idPasajero INT
) RETURNS varchar(20) CHARSET utf8mb4 COLLATE utf8mb4_general_ci
    READS SQL DATA
BEGIN
    DECLARE v_edad INT;
    DECLARE p_tipo VARCHAR(20);
    
    -- Obtener la edad del pasajero
    SELECT edad INTO v_edad 
    FROM pasajero 
    WHERE id_pasajero = p_idPasajero;

    -- Determinar el tipo de pasajero basado en la edad
    IF v_edad <= 5 THEN
      SET p_tipo = 'Menor de Edad';
    ELSEIF v_edad >= 65 THEN
      SET p_tipo = 'Mayor de Edad';
    ELSE
      SET p_tipo = 'Normal';
    END IF;
    
    RETURN p_tipo;
END//
DELIMITER ;

-- Dumping structure for function aerocontrol.obtener_descuento_boleto
DROP FUNCTION IF EXISTS `obtener_descuento_boleto`;
DELIMITER //
CREATE FUNCTION `obtener_descuento_boleto`(idBoleto INT
) RETURNS decimal(10,2)
    READS SQL DATA
BEGIN
    
    DECLARE b_tipoPasajero VARCHAR(20);
    DECLARE nuevoPrecio DECIMAL(10, 2);
    DECLARE oldPrecio DECIMAL(10, 2);
    
    -- Obtener tipoPasajero y precio original del boleto
    SELECT tipoPasajero, precio 
    INTO b_tipoPasajero, oldPrecio 
    FROM boleto 
    WHERE id_boleto = idBoleto;
    
    -- Aplicar el descuento según el tipo de pasajero
    IF b_tipoPasajero = 'Menor de Edad' THEN
      SET nuevoPrecio = oldPrecio * 0.80; -- 20% de descuento
    ELSEIF b_tipoPasajero = 'Mayor de Edad' THEN
      SET nuevoPrecio = oldPrecio * 0.65; -- 35% de descuento
    ELSE
      SET nuevoPrecio = oldPrecio; -- Sin descuento
    END IF;
    
    RETURN nuevoPrecio;
END//
DELIMITER ;

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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table aerocontrol.pasajero: ~3 rows (approximately)
REPLACE INTO `pasajero` (`id_pasajero`, `nombre`, `apellido`, `edad`, `nacionalidad`, `correo`, `telefono`) VALUES
	(1, 'A', 'A', 32, 'aa', '@gmail.com', 'afasd'),
	(2, '2', '343', 232, 'Mexicana', '@gmail.com', 'qqq'),
	(3, 'tres', 'gAAS', 35, 'Austriaca', '@gmail.com', '12412');

-- Dumping structure for view aerocontrol.pasajero_con_equipaje
DROP VIEW IF EXISTS `pasajero_con_equipaje`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `pasajero_con_equipaje` (
	`id_pasajero` INT(11) NOT NULL,
	`nombre` VARCHAR(1) NULL COLLATE 'utf8mb4_general_ci',
	`apellido` VARCHAR(1) NULL COLLATE 'utf8mb4_general_ci',
	`total_equipaje` BIGINT(21) NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for table aerocontrol.usuarios
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `usuario` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `rol` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `usuario` (`usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table aerocontrol.usuarios: ~3 rows (approximately)
REPLACE INTO `usuarios` (`id_usuario`, `nombre`, `usuario`, `password`, `rol`) VALUES
	(1, 'Admin', 'admin', 'admin123', 'Administrador'),
	(2, 'Usuario General', 'usuario1', 'user123', 'UsuarioGeneral'),
	(3, 'Analista', 'analista1', 'analyst123', 'Analista');

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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table aerocontrol.vuelo: ~19 rows (approximately)
REPLACE INTO `vuelo` (`id_vuelo`, `hora_salida`, `hora_llegada`, `id_aeropuerto_origen`, `id_aeropuerto_destino`, `id_avion`, `estado`) VALUES
	(1, '2025-11-14 22:08:00', '2025-11-28 22:06:00', 2, 1, 1, 'Cancelado'),
	(2, '2025-11-28 22:07:00', '2025-11-29 22:07:00', 2, 1, 1, 'Aterrizado'),
	(3, '2025-11-15 22:07:00', '2025-11-28 22:07:00', 1, 2, 1, 'Cancelado'),
	(4, '2025-11-27 09:17:00', '2025-11-29 09:17:00', 1, 2, 1, 'Aterrizado'),
	(5, '2025-11-27 22:03:00', '2025-11-29 10:03:00', 2, 1, 1, 'Aterrizado'),
	(6, '2025-11-27 10:04:00', '2025-11-29 10:04:00', 1, 2, 1, 'Aterrizado'),
	(7, '2025-11-28 10:04:00', '2025-11-29 10:04:00', 2, 1, 1, 'Aterrizado'),
	(8, '2025-11-26 16:31:00', '2025-11-27 16:32:00', 1, 2, 1, 'Cancelado'),
	(13, '2025-11-27 16:35:00', '2025-11-28 16:35:00', 2, 1, 1, 'Aterrizado'),
	(14, '2025-11-28 16:53:00', '2025-11-29 16:53:00', 1, 2, 1, 'Cancelado'),
	(15, '2025-12-01 08:22:00', '2025-12-03 08:23:00', 1, 2, 2, 'Aterrizado'),
	(16, '2025-12-08 19:08:00', '2025-12-12 19:08:00', 2, 1, 2, 'Aterrizado'),
	(17, '2025-11-28 16:32:00', '2025-11-29 16:32:00', 1, 2, 3, 'Aterrizado'),
	(18, '2025-12-01 16:35:00', '2025-12-02 16:35:00', 2, 1, 3, 'Aterrizado'),
	(19, '2025-12-11 18:22:00', '2025-12-13 18:22:00', 2, 1, 1, 'Aterrizado'),
	(20, '2025-12-10 18:28:00', '2025-12-12 18:28:00', 1, 2, 6, 'Aterrizado'),
	(21, '2025-12-17 19:06:00', '2025-12-18 19:06:00', 1, 2, 1, 'Aterrizado'),
	(22, '2025-12-31 19:22:00', '2026-01-01 19:22:00', 2, 1, 1, 'Aterrizado'),
	(23, '2025-11-29 19:42:00', '2025-11-30 19:42:00', 1, 2, 5, 'Aterrizado');

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
CREATE TRIGGER `actualizar_carga_avion_despues_emitir_boleto` AFTER UPDATE ON `boleto` FOR EACH ROW BEGIN
    DECLARE total_peso_equipaje DECIMAL(10, 2);
    DECLARE avion_id INT;
    
    -- Solo ejecutar si el Check-in se acaba de realizar (Estado cambia a 'Emitido')
    IF OLD.estado <> 'Emitido' AND NEW.estado = 'Emitido' THEN

        -- 1. Obtener el ID del avión asociado al vuelo del boleto (NEW.id_vuelo)
        SELECT id_avion INTO avion_id
        FROM vuelo
        WHERE id_vuelo = NEW.id_vuelo;

        -- 2. Calcular la suma del peso del equipaje del pasajero que ya ha pasado por el punto de control
        -- y está listo para ser cargado.
        SELECT COALESCE(SUM(peso), 0) INTO total_peso_equipaje
        FROM equipaje
        WHERE id_pasajero = NEW.id_pasajero
        AND estado IN ('Abordando'); -- <--- ESTADO PREVIO CONFIRMADO

        -- 3. Si hay peso que añadir...
        IF total_peso_equipaje > 0 THEN
            
            -- A. Actualizar la CargaActual del avión
            UPDATE AVION
            SET CargaActual = CargaActual + total_peso_equipaje
            WHERE id_avion = avion_id;

            -- B. Actualizar el estado del equipaje a 'A Bordo'
            UPDATE equipaje
            SET estado = 'Abordo' -- <--- ESTADO FINAL CONFIRMADO
            WHERE id_pasajero = NEW.id_pasajero
            AND estado = 'Abordando'; -- Solo cambiamos los que acabamos de sumar

        END IF;

    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger aerocontrol.actualizar_estado_avion_after_update
DROP TRIGGER IF EXISTS `actualizar_estado_avion_after_update`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `actualizar_estado_avion_after_update` AFTER UPDATE ON `vuelo` FOR EACH ROW BEGIN
    
    -- A. LÓGICA DE INICIO DE VUELO: 'Programado' a 'En Curso'
    IF OLD.estado = 'Programado' AND NEW.estado = 'En Curso' THEN
        
        -- Cambiar el estado del avión a 'En uso'
        UPDATE avion
        SET estado = 'En uso'
        WHERE id_avion = NEW.id_avion 
          AND estado = 'En espera'; 
          
          UPDATE BOLETO
        SET estado = 'Invalido'
        WHERE id_vuelo = NEW.id_vuelo
          AND estado = 'No Emitido';
          
    END IF;
    
    -- B. LÓGICA DE FIN DE VUELO: 'En Curso' a 'Aterrizado'
    IF OLD.estado = 'En Curso' AND NEW.estado = 'Aterrizado' THEN
        
            -- Cambiar el estado del avión a 'En espera'
            UPDATE avion
            SET estado = 'En espera', cargaActual = 0
            WHERE id_avion = NEW.id_avion ;
            
		        -- Cambia el estado de todas las maletas que pertenecen a pasajeros con boleto 
		        -- en este vuelo (NEW.id_vuelo) a 'Para Recoger'.
		        UPDATE EQUIPAJE AS E
		        INNER JOIN PASAJERO AS P ON E.id_pasajero = P.id_pasajero
		        INNER JOIN BOLETO AS B ON P.id_pasajero = B.id_pasajero
		        -- Nos aseguramos de que solo afecte a los boletos del vuelo que acaba de aterrizar
		        SET E.estado = 'Para recoger' 
		        WHERE B.id_vuelo = NEW.id_vuelo;
		        
    END IF;
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

-- Dumping structure for trigger aerocontrol.check_avion_disponibilidad_before_update
DROP TRIGGER IF EXISTS `check_avion_disponibilidad_before_update`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `check_avion_disponibilidad_before_update` BEFORE UPDATE ON `vuelo` FOR EACH ROW BEGIN
    DECLARE estado_actual_avion VARCHAR(50);
    
    -- Solo verificar si el vuelo está cambiando A 'En Curso'
    IF NEW.estado = 'En Curso' AND OLD.estado != 'En Curso' THEN
        
        -- Obtener el estado actual del avión involucrado
        SELECT estado INTO estado_actual_avion
        FROM avion
        WHERE id_avion = NEW.id_avion;

        -- Verificar si el avión ya está en uso
        IF estado_actual_avion IN ('En uso','En mantenimiento') THEN
            -- Lanza un error y detiene la operación
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 
                'ERROR: No se puede cambiar el vuelo a "En Curso". El avión ya está actualmente en uso en otro vuelo o se encuentra en mantenimiento.';
        END IF;
    END IF;
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

-- Dumping structure for trigger aerocontrol.tr_cancelar_vuelo_impacto
DROP TRIGGER IF EXISTS `tr_cancelar_vuelo_impacto`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `tr_cancelar_vuelo_impacto` AFTER UPDATE ON `vuelo` FOR EACH ROW BEGIN
    DECLARE avion_id INT;

    -- Solo ejecutar si el estado cambió a 'Cancelado'
    IF OLD.estado <> 'Cancelado' AND NEW.estado = 'Cancelado' THEN

        SET avion_id = NEW.id_avion;

        -- 1. Actualizar el estado de los Boletos relacionados a 'Inválido'
        -- Esto aplica a todos los boletos asociados a este vuelo, incluidos los 'Emitido'.
        UPDATE BOLETO
        SET estado = 'Invalido'
        WHERE id_vuelo = NEW.id_vuelo;

        -- 2. Resetear la CargaActual del avión a 0
        UPDATE AVION
        SET CargaActual = 0
        WHERE id_avion = avion_id;

        -- 3. Actualizar el estado de TODO equipaje asociado a los pasajeros del vuelo a 'Entregado'
        -- Buscamos el equipaje de todos los pasajeros que tenían un boleto en este vuelo.
        UPDATE EQUIPAJE
        SET estado = 'Entregado'
        WHERE id_pasajero IN (
            SELECT id_pasajero 
            FROM BOLETO 
            WHERE id_vuelo = NEW.id_vuelo
        );

    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger aerocontrol.tr_check_boleto_duplicado
DROP TRIGGER IF EXISTS `tr_check_boleto_duplicado`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `tr_check_boleto_duplicado` BEFORE INSERT ON `boleto` FOR EACH ROW BEGIN
    DECLARE num_boletos INT;
    DECLARE msg_error VARCHAR(255);

    -- 1. Contar cuántos boletos existen para este pasajero (NEW.id_pasajero)
    -- en este vuelo (NEW.id_vuelo).
    SELECT COUNT(*)
    INTO num_boletos
    FROM BOLETO
    WHERE id_pasajero = NEW.id_pasajero
      AND id_vuelo = NEW.id_vuelo;

    -- 2. Verificar si ya existe un boleto (num_boletos > 0)
    IF num_boletos > 0 THEN
        -- Si ya existe un boleto, no se permite la inserción.
        SET msg_error = CONCAT('El Pasajero con ID ', NEW.id_pasajero, 
                               ' ya tiene un boleto registrado para el Vuelo ID ', NEW.id_vuelo, '.');
        
        -- Generar un error para abortar la operación INSERT.
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg_error;
    END IF;
    
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger aerocontrol.tr_check_capacidad_vuelo
DROP TRIGGER IF EXISTS `tr_check_capacidad_vuelo`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER tr_check_capacidad_vuelo
BEFORE INSERT ON BOLETO
FOR EACH ROW
BEGIN
    DECLARE capacidad_avion INT;
    DECLARE boletos_actuales INT;
    DECLARE msg_error VARCHAR(255);

    -- 1. Obtener la capacidad de pasajeros del avión para el vuelo (NEW.id_vuelo)
    SELECT A.capacidad_pasajeros
    INTO capacidad_avion
    FROM AVION AS A
    INNER JOIN VUELO AS V ON A.id_avion = V.id_avion
    WHERE V.id_vuelo = NEW.id_vuelo;

    -- 2. Contar la cantidad de boletos ya registrados para este vuelo
    SELECT COUNT(*)
    INTO boletos_actuales
    FROM BOLETO
    WHERE id_vuelo = NEW.id_vuelo;

    -- 3. Verificar si se excede o iguala la capacidad (boletos_actuales >= capacidad_avion)
    IF boletos_actuales >= capacidad_avion THEN
        
        -- Si la capacidad se ha alcanzado, no se permite la inserción.
        SET msg_error = CONCAT('ERROR DE CAPACIDAD: El Vuelo ID ', NEW.id_vuelo, 
                               ' ha alcanzado su capacidad máxima de ', capacidad_avion, ' asientos. No se puede emitir el boleto.');
        
        -- Generar un error para abortar la operación INSERT.
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg_error;
    END IF;
    
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger aerocontrol.tr_prohibir_equipaje_vuelo_en_curso
DROP TRIGGER IF EXISTS `tr_prohibir_equipaje_vuelo_en_curso`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `tr_prohibir_equipaje_vuelo_en_curso` BEFORE INSERT ON `equipaje` FOR EACH ROW 
BEGIN
    DECLARE estado_vuelo_pasajero VARCHAR(50);
    DECLARE estado_boleto_pasajero VARCHAR(50);
    DECLARE msg_error VARCHAR(255);

    -- 1. Encontrar el estado del vuelo y del boleto más reciente/relevante del pasajero.
    SELECT V.estado, B.estado
    INTO estado_vuelo_pasajero, estado_boleto_pasajero
    FROM BOLETO AS B
    INNER JOIN VUELO AS V ON B.id_vuelo = V.id_vuelo
    WHERE B.id_pasajero = NEW.id_pasajero
    -- Solo consideramos boletos no cancelados/aterrizados
    AND V.estado IN ('Programado', 'En Curso') 
    ORDER BY V.hora_salida DESC 
    LIMIT 1;

    -- 2. Verificar las condiciones de bloqueo
    IF estado_vuelo_pasajero IS NULL THEN
        
        -- Verificar si el pasajero no tiene boleto activo (Opcional, pero recomendado)
        SET msg_error = CONCAT('ERROR: El Pasajero ID ', NEW.id_pasajero, ' no tiene un boleto activo/programado para registrar equipaje.');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg_error;

    ELSEIF estado_vuelo_pasajero = 'En Curso' THEN
        
        -- Condición A: Vuelo ha despegado
        SET msg_error = CONCAT('ERROR DE REGISTRO DE EQUIPAJE: No se puede agregar equipaje. El vuelo del Pasajero ID ', 
                               NEW.id_pasajero, ' ya se encuentra en estado "En Curso" (Ha despegado).');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg_error;
        
    ELSEIF estado_boleto_pasajero = 'Emitido' THEN
        
        -- Condición B: Check-in realizado
        SET msg_error = CONCAT('ERROR DE REGISTRO DE EQUIPAJE: No se puede agregar equipaje. El Pasajero ID ', 
                               NEW.id_pasajero, ' ya realizó el Check-in (Boleto Emitido) y no se permite más equipaje.');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg_error;
        
    END IF;
    
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `datos_pasajeros`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `datos_pasajeros` AS SELECT nombre, apellido, correo 
FROM pasajero 
;

-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `pasajero_con_equipaje`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `pasajero_con_equipaje` AS SELECT p.id_pasajero, p.nombre, p.apellido, COUNT(e.id_equipaje) AS total_equipaje
FROM pasajero p
JOIN equipaje e ON p.id_pasajero = e.id_pasajero
GROUP BY p.id_pasajero, p.nombre 
;

-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `vuelos_a_abordar`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vuelos_a_abordar` AS SELECT hora_salida,vuelo.id_avion,aeropuerto.nombre,vuelo.estado
FROM vuelo INNER JOIN aeropuerto ON vuelo.id_aeropuerto_origen = aeropuerto.id_aeropuerto 
;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
