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

CREATE TABLE IF NOT EXISTS avion (
    id_avion INT AUTO_INCREMENT PRIMARY KEY,
    modelo VARCHAR(100),
    capacidad_pasajeros INT,
    aerolinea VARCHAR(100),
    pesoCargaMaximo BIGINT NOT NULL
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
    tipoPasajero VARCHAR(30) NOT NULL
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
CREATE VIEW datos_Pasajeros IF NOT EXISTS AS
SELECT nombre, apellido, correo 
FROM pasajero;

CREATE VIEW vuelos_a_abordar IF NOT EXISTS AS
SELECT hora_salida,vuelo.id_avion,aeropuerto.nombre,estado
FROM vuelo INNER JOIN aeropuerto ON vuelo.id_aeropuerto = aeropuerto.id_aeropuerto

/*------------------------------------------------DISPARADORES------------------------------------------------------*/