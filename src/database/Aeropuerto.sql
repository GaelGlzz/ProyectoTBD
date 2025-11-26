CREATE DATABASE IF NOT EXISTS aerocontrol;
USE aerocontrol;

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    usuario VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    rol VARCHAR(50)
);

INSERT INTO usuarios (nombre, usuario, password, rol) VALUES 
('Admin', 'admin', 'admin123', 'Gerente');

CREATE TABLE IF NOT EXISTS aeropuerto (
    id_aeropuerto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    pais VARCHAR(100),
    estado VARCHAR(100),
    ciudad VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS avion (
    id_avion INT AUTO_INCREMENT PRIMARY KEY,
    modelo VARCHAR(100),
    capacidad_pasajeros INT,
    aerolinea VARCHAR(100),
    pesoCargaMaximo BIGINT NOT NULL,
    CargaActual BIGINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS vuelo (
    id_vuelo INT AUTO_INCREMENT PRIMARY KEY,
    hora_salida DATETIME,
    hora_llegada DATETIME,
    id_aeropuerto_origen INT,
    id_aeropuerto_destino INT,
    id_avion INT,
    estado VARCHAR(50),
    FOREIGN KEY (id_aeropuerto_origen) REFERENCES aeropuerto(id_aeropuerto),
    FOREIGN KEY (id_aeropuerto_destino) REFERENCES aeropuerto(id_aeropuerto),
    FOREIGN KEY (id_avion) REFERENCES avion(id_avion)
);

CREATE TABLE IF NOT EXISTS pasajero (
    id_pasajero INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    edad INT NOT NULL,
    nacionalidad VARCHAR(40) NOT NULL,
    correo VARCHAR(100),
    telefono VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS boleto (
    id_boleto INT AUTO_INCREMENT PRIMARY KEY,
    id_pasajero INT,
    tipoPasajero VARCHAR(30) NOT NULL,
    id_vuelo INT,
    precio DECIMAL(10, 2),
    terminal VARCHAR(50),
    asiento VARCHAR(10),
    estado VARCHAR(20) DEFAULT 'Emitido',
    FOREIGN KEY (id_pasajero) REFERENCES pasajero(id_pasajero),
    FOREIGN KEY (id_vuelo) REFERENCES vuelo(id_vuelo)
);

-- Optional: Keep equipaje for completeness if needed, but prompt emphasized 5 main tables.
-- I will include it as it was in the previous requirement and adds value.
CREATE TABLE IF NOT EXISTS equipaje (
    id_equipaje INT AUTO_INCREMENT PRIMARY KEY,
    id_pasajero INT,
    peso DECIMAL(10, 2),
    tipo VARCHAR(50),
    estado VARCHAR(50),
    FOREIGN KEY (id_pasajero) REFERENCES pasajero(id_pasajero)
);

/*------------------------------------------------VISTAS------------------------------------------------------*/
CREATE VIEW datos_Pasajeros AS
SELECT nombre, apellido, correo 
FROM pasajero;

CREATE VIEW vuelos_a_abordar AS
SELECT hora_salida,vuelo.id_avion,aeropuerto.nombre,vuelo.estado
FROM vuelo INNER JOIN aeropuerto ON vuelo.id_aeropuerto_origen = aeropuerto.id_aeropuerto

/*------------------------------------------------DISPARADORES------------------------------------------------------*/

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