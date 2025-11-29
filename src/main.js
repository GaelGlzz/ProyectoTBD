const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const db = require('./includes/conexion.js');
const PDFDocument = require('pdfkit');
const fs = require('fs');

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
          const user = results[0];
          resolve({
            success: true,
            user: {
              id_usuario: user.id_usuario,
              nombre: user.nombre,
              usuario: user.usuario,
              role: user.nombre  // nombre contains: Admin, Operativo, or Analista
            }
          });
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

ipcMain.handle('getPasajerosEquipaje', async () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM pasajero_con_equipaje", (error, results) => {
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
    db.query("SELECT * FROM aeropuerto ORDER BY id_aeropuerto", (error, results) => {
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

ipcMain.handle('revisarBoleto', async (event, idBoleto) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT estado FROM boleto WHERE id_boleto = ?', [idBoleto], (err, res) => {
      if (err) reject(err);
      else resolve(res[0].estado);
    });
  });
});

ipcMain.handle('revisarVuelo', async (event, idVuelo) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT estado FROM vuelo WHERE id_vuelo = ?', [idVuelo], (err, res) => {
      if (err) reject(err);
      else resolve(res[0].estado);
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
    db.query('UPDATE vuelo SET hora_salida = ?, hora_llegada = ?, estado = ? WHERE id_vuelo = ?', [data.hora_salida, data.hora_llegada, data.estado, data.id_vuelo], (err, res) => {
      if (err) reject(err);
      else resolve({ message: 'Vuelo modificado' });
    });
  });
});

ipcMain.handle('cancelarVuelo', async (event, data) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE vuelo SET estado = ? WHERE id_vuelo = ?', [data.estado, data.id_vuelo], (err, res) => {
      if (err) reject(err);
      else resolve({ message: 'Vuelo cancelado' });
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
    db.query('UPDATE avion SET estado = ? WHERE id_avion = ?', [data.estado, data.id_avion], (err, res) => {
      if (err) reject(err);
      else resolve({ message: 'Exito de operacion' });
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

ipcMain.handle('eliminarEquipaje', async (event, data) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM equipaje WHERE id_equipaje = ?', data, (err, res) => {
      if (err) reject(err);
      else resolve({ id: res.insertId, message: 'Equipaje eliminado' });
    });
  });
});


ipcMain.handle('emitirBoleto', async (event, data) => {
  return new Promise((resolve, reject) => {
    // data: { id_pasajero, id_vuelo, precio, terminal, asiento } 
    db.query('INSERT INTO boleto SET ?', data, (err, res) => {
      if (err) reject(err);
      else {
        resolve(res.insertId);
      }
    });
  });
});

ipcMain.handle('cancelarBoleto', async (event, id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM boleto WHERE id_boleto = ?', id, (err, res) => {
      if (err) reject(err);
      else resolve({ id: res.insertId, message: 'Boleto eliminado' });
    });
  });
});

ipcMain.handle('realizarCheckIn', async (event, idBoleto) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE boleto SET estado = "Emitido" WHERE id_boleto = ?', [idBoleto], (err, res) => {
      if (err) reject(err);
      else resolve({ message: 'Check-in realizado correctamente', id_boleto: idBoleto });
    });
  });
});

ipcMain.handle('confirmarEntregaEquipaje', async (event, id) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE equipaje SET estado = "Entregado" WHERE id_equipaje = ?', [id], (err, res) => {
      if (err) reject(err);
      else resolve({ message: 'Entrega realizada correctamente', id_equipaje: id });
    });
  });
});

ipcMain.handle('confirmarExtravioEquipaje', async (event, id) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE equipaje SET estado = "Extraviado" WHERE id_equipaje = ?', [id], (err, res) => {
      if (err) reject(err);
      else resolve({ message: 'Extravio confirmado', id_equipaje: id });
    });
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

/*Llamar FUNCIONES almacenados*/
ipcMain.handle('obtenertipoPasajero', async () => {
  return new Promise((resolve, reject) => {
    const sql = `
        SET @Id_boleto = (SELECT MAX(id_boleto) FROM boleto);
        SET @Id_pasajero = (SELECT id_pasajero FROM boleto WHERE id_boleto = @Id_boleto);
        SET @Id_vuelo = (SELECT id_vuelo FROM boleto WHERE id_boleto = @Id_boleto);
        SET @b= obtenerTipoPasajero(@Id_pasajero);
        UPDATE boleto SET tipoPasajero = @b WHERE id_boleto = @Id_boleto;
        SET @precio = obtener_descuento_boleto(@Id_boleto);
        UPDATE boleto SET precio = @precio WHERE id_boleto = @Id_boleto
        `;
    db.query(sql, (err, res) => {
      if (err) reject(err);
      else resolve({ message: 'Pasajero registrado' });
    });
  });
});

// ========================
// REPORTS
// ========================

ipcMain.handle('generarReporteVuelosAeropuerto', async (event, idAeropuerto) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT v.id_vuelo, v.hora_salida, v.hora_llegada, v.estado,
             ao.ciudad as origen, ad.ciudad as destino,
             a.modelo as avion
      FROM vuelo v
      LEFT JOIN aeropuerto ao ON v.id_aeropuerto_origen = ao.id_aeropuerto
      LEFT JOIN aeropuerto ad ON v.id_aeropuerto_destino = ad.id_aeropuerto
      LEFT JOIN avion a ON v.id_avion = a.id_avion
      WHERE v.id_aeropuerto_origen = ? OR v.id_aeropuerto_destino = ?
      ORDER BY v.hora_salida DESC
    `;

    db.query(sql, [idAeropuerto, idAeropuerto], (err, results) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const doc = new PDFDocument();
        const filename = `reporte_vuelos_${Date.now()}.pdf`;
        const filePath = path.join(app.getPath('documents'), filename);
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        doc.fontSize(20).text(`Reporte de Vuelos por Aeropuerto ID: ${idAeropuerto}`, { align: 'center' });
        doc.moveDown();

        if (results.length === 0) {
          doc.fontSize(12).text('No se encontraron vuelos para este aeropuerto.');
        } else {
          results.forEach(v => {
            doc.fontSize(12).text(`Vuelo ID: ${v.id_vuelo}`);
            doc.text(`Ruta: ${v.origen} -> ${v.destino}`);
            doc.text(`Salida: ${new Date(v.hora_salida).toLocaleString()}`);
            doc.text(`Llegada: ${new Date(v.hora_llegada).toLocaleString()}`);
            doc.text(`Avión: ${v.avion || 'N/A'}`);
            doc.text(`Estado: ${v.estado}`);
            doc.moveDown();
            doc.moveTo(doc.x, doc.y).lineTo(500, doc.y).stroke();
            doc.moveDown();
          });
        }

        doc.end();

        stream.on('finish', () => {
          shell.openPath(filePath);
          resolve({ success: true, path: filePath });
        });

        stream.on('error', (streamErr) => {
          reject(streamErr);
        });

      } catch (pdfError) {
        reject(pdfError);
      }
    });
  });
});

ipcMain.handle('generarReporteBoletosAvion', async (event, idAvion) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT b.id_boleto, b.asiento, b.precio, b.estado,
             p.nombre, p.apellido, p.correo,
             v.id_vuelo, ao.ciudad as origen, ad.ciudad as destino
      FROM boleto b
      JOIN pasajero p ON b.id_pasajero = p.id_pasajero
      JOIN vuelo v ON b.id_vuelo = v.id_vuelo
      LEFT JOIN aeropuerto ao ON v.id_aeropuerto_origen = ao.id_aeropuerto
      LEFT JOIN aeropuerto ad ON v.id_aeropuerto_destino = ad.id_aeropuerto
      WHERE v.id_avion = ?
      ORDER BY v.hora_salida DESC, b.id_boleto
    `;

    db.query(sql, [idAvion], (err, results) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const doc = new PDFDocument();
        const filename = `reporte_boletos_avion_${idAvion}_${Date.now()}.pdf`;
        const filePath = path.join(app.getPath('documents'), filename);
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        doc.fontSize(20).text(`Reporte de Boletos por Avión (ID: ${idAvion})`, { align: 'center' });
        doc.moveDown();

        if (results.length === 0) {
          doc.fontSize(12).text('No se encontraron boletos emitidos para vuelos de este avión.');
        } else {
          let currentVueloId = null;

          results.forEach(b => {
            if (currentVueloId !== b.id_vuelo) {
              currentVueloId = b.id_vuelo;
              doc.moveDown();
              doc.fontSize(14).fillColor('blue').text(`Vuelo ID: ${b.id_vuelo} (${b.origen} -> ${b.destino})`);
              doc.fillColor('black');
              doc.moveDown(0.5);
            }

            doc.fontSize(10).text(`Boleto: ${b.id_boleto} | Pasajero: ${b.nombre} ${b.apellido} (${b.correo})`);
            doc.text(`   Asiento: ${b.asiento} | Precio: $${b.precio} | Estado: ${b.estado}`);
            doc.moveDown(0.5);
          });
        }

        doc.end();

        stream.on('finish', () => {
          shell.openPath(filePath);
          resolve({ success: true, path: filePath });
        });

        stream.on('error', (streamErr) => {
          reject(streamErr);
        });

      } catch (pdfError) {
        reject(pdfError);
      }
    });
  });
});