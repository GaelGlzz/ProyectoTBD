-- Permisos y creacion de roles

-- Administrador General
CREATE USER IF NOT EXISTS 'admin_aeropuerto'@'localhost' IDENTIFIED BY 'Admin123';
GRANT ALL PRIVILEGES ON aerocontrol.* TO 'admin_aeropuerto'@'localhost' WITH GRANT OPTION;

-- Analista
CREATE USER IF NOT EXISTS 'analista'@'localhost' IDENTIFIED BY 'Analista123';
GRANT SELECT ON aerocontrol.* TO 'analista'@'localhost';

-- Usuario General
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
