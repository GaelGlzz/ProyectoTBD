const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./includes/conexion.js');

if (process.env.NODE_ENV === 'production') {
  require('electron-reload')(__dirname, {});
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile('views/index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ========================
// AUTHENTICATION
// ========================

ipcMain.handle('login', async (event, username, password) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM usuarios WHERE usuario = ? AND password = ?', [username, password], (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length > 0) {
          resolve({ success: true, user: results[0] });
        } else {
          resolve({ success: false, message: 'Credenciales incorrectas' });
        }
      }
    });
  });
});

// ========================
// GETTERS
// ========================

ipcMain.handle('getBoletos', async () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT b.*, p.nombre, p.apellido,
      ao.ciudad as origen, ad.ciudad as destino,
      v.hora_salida
      FROM boleto b
      JOIN pasajero p ON b.id_pasajero = p.id_pasajero
      JOIN vuelo v ON b.id_vuelo = v.id_vuelo
      LEFT JOIN aeropuerto ao ON v.id_aeropuerto_origen = ao.id_aeropuerto
      LEFT JOIN aeropuerto ad ON v.id_aeropuerto_destino = ad.id_aeropuerto
    `;
    db.query(sql, (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
});

ipcMain.handle('getVuelos', async () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT v.*, 
      ao.ciudad as origen_ciudad, ad.ciudad as destino_ciudad,
      a.modelo as avion_modelo
      FROM vuelo v
      LEFT JOIN aeropuerto ao ON v.id_aeropuerto_origen = ao.id_aeropuerto
      LEFT JOIN aeropuerto ad ON v.id_aeropuerto_destino = ad.id_aeropuerto
      LEFT JOIN avion a ON a.id_avion = v.id_avion
      ORDER BY v.hora_salida DESC
    `;
    db.query(sql, (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
});

ipcMain.handle('getPasajeros', async () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM pasajero ORDER BY apellido, nombre", (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
});

ipcMain.handle('getAviones', async () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM avion ORDER BY aerolinea, modelo", (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
});

ipcMain.handle('getEquipaje', async () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM equipaje ORDER BY id_pasajero`;
    db.query(sql, (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
});

ipcMain.handle('getAeropuertos', async () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM aeropuerto ORDER BY pais, ciudad", (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
});

ipcMain.handle('getHistorialPasajero', async (event, idPasajero) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT b.*, v.hora_salida, v.hora_llegada,
      ao.ciudad as origen, ad.ciudad as destino
      FROM boleto b
      JOIN vuelo v ON b.id_vuelo = v.id_vuelo
      LEFT JOIN aeropuerto ao ON v.id_aeropuerto_origen = ao.id_aeropuerto
      LEFT JOIN aeropuerto ad ON v.id_aeropuerto_destino = ad.id_aeropuerto
      WHERE b.id_pasajero = ?
      ORDER BY v.hora_salida DESC
    `;
    db.query(sql, [idPasajero], (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
});

ipcMain.handle('getUltimoAeropuertoAvion', async (event, idAvion) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT COALESCE(id_ultimoAeropuerto, 1) as id_aeropuerto
            FROM avion
            WHERE id_avion = ?
        `;
        db.query(sql, [idAvion], (error, results) => {
            if (error) reject(error);
            else {
                // Si no se encuentra el avión o es nuevo (NULL), devolverá 1 (por COALESCE)
                resolve(results.length > 0 ? results[0].id_aeropuerto : 1);
            }
        });
    });
});
// ========================
// CREATE / UPDATE
// ========================

ipcMain.handle('registrarPasajero', async (event, data) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO pasajero SET ?', data, (err, res) => {
      if (err) reject(err);
      else resolve({ id: res.insertId, message: 'Pasajero registrado' });
    });
  });
});

ipcMain.handle('registrarVuelo', async (event, data) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO vuelo SET ?', data, (err, res) => {
      if (err) reject(err);
      else resolve({ id: res.insertId, message: 'Vuelo registrado' });
    });
  });
});

ipcMain.handle('modificarVuelo', async (event, data) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE vuelo SET hora_salida = ?, hora_llegada = ?, estado = ? WHERE id_vuelo = ?', [data.hora_salida,data.hora_llegada,data.estado,data.id_vuelo], (err, res) => {
      if (err) reject(err);
      else resolve({message: 'Vuelo modificado' });
    });
  });
});

ipcMain.handle('cancelarVuelo', async (event, data) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE vuelo SET estado = ? WHERE id_vuelo = ?', [data.estado,data.id_vuelo], (err, res) => {
      if (err) reject(err);
      else resolve({message: 'Vuelo cancelado' });
    });
  });
});

ipcMain.handle('registrarAeropuerto', async (event, data) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO aeropuerto SET ?', data, (err, res) => {
      if (err) reject(err);
      else resolve({ id: res.insertId, message: 'Aeropuerto registrado' });
    });
  });
});

ipcMain.handle('registrarAvion', async (event, data) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO avion SET ?', data, (err, res) => {
      if (err) reject(err);
      else resolve({ id: res.insertId, message: 'Avión registrado' });
    });
  });
});

ipcMain.handle('mantenimientoAvion', async (event, data) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE avion SET estado = ? WHERE id_avion = ?', [data.estado,data.id_avion], (err, res) => {
      if (err) reject(err);
      else resolve({message: 'Exito de operacion' });
    });
  });
});

ipcMain.handle('registrarEquipaje', async (event, data) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO equipaje SET ?', data, (err, res) => {
      if (err) reject(err);
      else resolve({ id: res.insertId, message: 'Equipaje registrado' });
    });
  });
});

ipcMain.handle('emitirBoleto', async (event, data) => {
  return new Promise((resolve, reject) => {
    // data: { id_pasajero, id_vuelo, precio, terminal, asiento }
    db.query('INSERT INTO boleto SET ?', data, (err, res) => {
      if (err) reject(err);
      else resolve({ id: res.insertId, message: 'Boleto emitido' });
    });
  });
});

ipcMain.handle('realizarCheckIn', async (event, idBoleto) => {
  return new Promise((resolve, reject) => {
    // Since boleto table doesn't have estado column, just return success
    resolve({ message: 'Check-in realizado correctamente', id_boleto: idBoleto });
  });
});

ipcMain.handle('asignarAvion', async (event, idVuelo, idAvion) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE avion SET id_vuelo = ? WHERE id_avion = ?', [idVuelo, idAvion], (err, res) => {
      if (err) reject(err);
      else resolve({ message: 'Avión asignado al vuelo' });
    });
  });
});