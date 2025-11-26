const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Auth
  login: (username, password) => ipcRenderer.invoke('login', username, password),

  // Getters
  getVuelos: () => ipcRenderer.invoke('getVuelos'),
  getPasajeros: () => ipcRenderer.invoke('getPasajeros'),
  getEquipaje: () => ipcRenderer.invoke('getEquipaje'),
  getAviones: () => ipcRenderer.invoke('getAviones'),
  getBoletos: () => ipcRenderer.invoke('getBoletos'),
  getAeropuertos: () => ipcRenderer.invoke('getAeropuertos'),
  getHistorialPasajero: (id) => ipcRenderer.invoke('getHistorialPasajero', id),

  // Actions
  registrarPasajero: (data) => ipcRenderer.invoke('registrarPasajero', data),
  registrarVuelo: (data) => ipcRenderer.invoke('registrarVuelo', data),
  modificarVuelo: (data) => ipcRenderer.invoke('modificarVuelo', data),
  registrarAeropuerto: (data) => ipcRenderer.invoke('registrarAeropuerto', data),
  registrarAvion: (data) => ipcRenderer.invoke('registrarAvion', data),
  registrarEquipaje: (data) => ipcRenderer.invoke('registrarEquipaje', data),
  emitirBoleto: (data) => ipcRenderer.invoke('emitirBoleto', data),
  realizarCheckIn: (id) => ipcRenderer.invoke('realizarCheckIn', id),
  asignarAvion: (idVuelo, idAvion) => ipcRenderer.invoke('asignarAvion', idVuelo, idAvion),
});