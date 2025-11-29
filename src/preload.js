const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Auth
  login: (username, password) => ipcRenderer.invoke('login', username, password),

  // Getters
  getVuelos: () => ipcRenderer.invoke('getVuelos'),
  getPasajeros: () => ipcRenderer.invoke('getPasajeros'),
  getPasajerosEquipaje: () => ipcRenderer.invoke('getPasajerosEquipaje'),
  getEquipaje: () => ipcRenderer.invoke('getEquipaje'),
  getAviones: () => ipcRenderer.invoke('getAviones'),
  getBoletos: () => ipcRenderer.invoke('getBoletos'),
  getAeropuertos: () => ipcRenderer.invoke('getAeropuertos'),
  getHistorialPasajero: (id) => ipcRenderer.invoke('getHistorialPasajero', id),
  getUltimoAeropuertoAvion: (idAvion) => ipcRenderer.invoke('getUltimoAeropuertoAvion', idAvion),
  revisarBoleto: (idBoleto) => ipcRenderer.invoke('revisarBoleto', idBoleto),
  revisarVuelo: (idVuelo) => ipcRenderer.invoke('revisarVuelo', idVuelo),

  // Actions
  registrarPasajero: (data) => ipcRenderer.invoke('registrarPasajero', data),
  registrarVuelo: (data) => ipcRenderer.invoke('registrarVuelo', data),
  modificarVuelo: (data) => ipcRenderer.invoke('modificarVuelo', data),
  cancelarVuelo: (data) => ipcRenderer.invoke('cancelarVuelo', data), 
  registrarAeropuerto: (data) => ipcRenderer.invoke('registrarAeropuerto', data),
  registrarAvion: (data) => ipcRenderer.invoke('registrarAvion', data),
  mantenimientoAvion: (data) => ipcRenderer.invoke('mantenimientoAvion', data),
  sacarmantenimientoAvion: (data) => ipcRenderer.invoke('mantenimientoAvion', data), 
  registrarEquipaje: (data) => ipcRenderer.invoke('registrarEquipaje', data),
  eliminarEquipaje: (id) => ipcRenderer.invoke('eliminarEquipaje', id),
  confirmarEntregaEquipaje: (id) => ipcRenderer.invoke('confirmarEntregaEquipaje', id),
  confirmarExtravioEquipaje: (id) => ipcRenderer.invoke('confirmarExtravioEquipaje', id),
  emitirBoleto: (data) => ipcRenderer.invoke('emitirBoleto', data),
  cancelarBoleto: (id) => ipcRenderer.invoke('cancelarBoleto', id),
  realizarCheckIn: (id) => ipcRenderer.invoke('realizarCheckIn', id),
  asignarAvion: (idVuelo, idAvion) => ipcRenderer.invoke('asignarAvion', idVuelo, idAvion),

  //Stored Procedures
  obtenertipoPasajero: () => ipcRenderer.invoke('obtenertipoPasajero')
});