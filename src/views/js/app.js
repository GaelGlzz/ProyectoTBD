import { customAlert, customConfirm } from './modalAlerts.js'; 
let usuarioActual = null;
const appContainer = document.getElementById('app-container');

// =============== LOGIN ==================
async function renderLogin() {
  appContainer.innerHTML = `
    <div class="login-container card">
        <h2><i class="fas fa-plane-departure icon"></i> AeroControl</h2>
        <p class="text-center text-muted">Gestión Integral Aeroportuaria</p>
        
        <div id="login-error" style="display: none;" class="alert alert-danger"></div>
        
        <form id="login-form">
            <div class="form-group">
                <label for="username">Usuario:</label>
                <input type="text" id="username" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="password">Contraseña:</label>
                <input type="password" id="password" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary">
                <i class="fas fa-sign-in-alt icon"></i> Ingresar
            </button>
        </form>
    </div>
  `;

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');

    try {
      const result = await window.api.login(username, password);
      if (result.success) {
        usuarioActual = result.user;
        renderDashboard();
      } else {
        errorDiv.textContent = result.message;
        errorDiv.style.display = 'block';
      }
    } catch (error) {
      console.error('Error login:', error);
      errorDiv.textContent = 'Error de conexión';
      errorDiv.style.display = 'block';
    }
  });
}

// =============== DASHBOARD ==================
function renderDashboard() {
  const navbar = `
      <a href="#" class="nav-link" data-page="vuelos">Control de Vuelos</a> <br>
      <a href="#" class="nav-link" data-page="pasajeros">Gestión de Pasajeros</a> <br>
      <a href="#" class="nav-link" data-page="boletos">Manejo de Boletos</a> <br>
      <a href="#" class="nav-link" data-page="aviones">Gestión de Aviones</a> <br>
      <a href="#" class="nav-link" data-page="aeropuertos">Admin. Aeropuertos</a> <br>
      <a href="#" class="nav-link" id="logout-btn" style="color:red;">Cerrar Sesión</a> <br>
  `;

  appContainer.innerHTML = `
    <div class="dashboard-container">
      <div class="sidebar">
        <h3><i class="fas fa-plane"></i> AeroControl</h3>
        ${navbar}
      </div>
      <div class="main-content">
        <div class="card">
          <h2>Bienvenido, ${usuarioActual.nombre}</h2>
          <div id="content-area">
            <div class="welcome-banner">
              <h3>Sistema de Gestión Aeroportuaria</h3>
              <p>Seleccione una opción del menú para administrar las operaciones.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      renderPage(link.getAttribute('data-page'));
    });
  });

  document.getElementById('logout-btn').addEventListener('click', () => {
    usuarioActual = null;
    renderLogin();
  });
}

async function renderPage(page) {
  const content = document.getElementById('content-area');
  content.innerHTML = '<p>Cargando datos...</p>';

  try {
    if (page === 'vuelos') {
      const vuelos = await window.api.getVuelos();
      let rows = vuelos.map(v => `
        <tr>
          <td>${v.id_vuelo}</td>
          <td>${v.id_avion}</td>
          <td>${v.origen_ciudad} -> ${v.destino_ciudad}</td>
          <td>${new Date(v.hora_salida).toLocaleString()}</td>
          <td>${v.estado}</td>
        </tr>
      `).join('');

      content.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3>Control de Vuelos</h3>
            <button class="btn btn-success" onclick="showRegistrarVuelo()">+ Nuevo Vuelo</button>
            <button class="btn btn-warning" onclick="showModificarVuelo()">! Modificar Vuelo</button>
        </div> <br>
        <table class="table">
          <thead>
            <tr><th>ID</th><th>Avion</th><th>Ruta</th><th>Salida</th><th>Estado</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    } else if (page === 'pasajeros') {
      const pasajeros = await window.api.getPasajeros();
      let rows = pasajeros.map(p => `
        <tr>
          <td>${p.id_pasajero}</td>
          <td>${p.nombre} ${p.apellido}</td>
          <td>${p.correo}</td>
          <td>
            <button class="btn btn-sm btn-info" onclick="verHistorial(${p.id_pasajero})">Historial</button>
          </td>
        </tr>
      `).join('');

      content.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3>Gestión de Pasajeros</h3>
            <button class="btn btn-success" onclick="showRegistrarPasajero()">+ Nuevo Pasajero</button>
        </div> <br>
        <table class="table">
          <thead>
            <tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Acciones</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    } else if (page === 'boletos') {
      const boletos = await window.api.getBoletos();
      let rows = boletos.map(b => `
        <tr>
          <td>${b.id_boleto}</td>
          <td>${b.nombre} ${b.apellido}</td>
          <td>${b.origen} -> ${b.destino}</td>
          <td>${b.asiento}</td>
          <td>${b.terminal}</td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="realizarCheckIn(${b.id_boleto})">Check-in</button>
          </td>
        </tr>
      `).join('');

      content.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3>Manejo de Boletos</h3>
            <button class="btn btn-success" onclick="showEmitirBoleto()">+ Emitir Boleto</button>
        </div> <br>
        <table class="table">
          <thead>
            <tr><th>ID</th><th>Pasajero</th><th>Vuelo</th><th>Asiento</th><th>Terminal</th><th>Acciones</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    } else if (page === 'aviones') {
      const aviones = await window.api.getAviones();
      let rows = aviones.map(a => `
        <tr>
          <td>${a.id_avion}</td>
          <td>${a.modelo}</td>
          <td>${a.aerolinea}</td>
          <td>${a.capacidad_pasajeros}</td>
        </tr>
      `).join('');

      content.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3>Gestión de Aviones</h3>
            <button class="btn btn-success" onclick="showRegistrarAvion()">+ Nuevo Avión</button>
        </div> <br>
        <table class="table">
          <thead>
            <tr><th>ID</th><th>Modelo</th><th>Aerolínea</th><th>Capacidad</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    } else if (page === 'aeropuertos') {
      const aeropuertos = await window.api.getAeropuertos();
      let rows = aeropuertos.map(a => `
        <tr>
          <td>${a.id_aeropuerto}</td>
          <td>${a.nombre}</td>
          <td>${a.pais}</td>
          <td>${a.ciudad}</td>
        </tr>
      `).join('');

      content.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3>Administración de Aeropuertos</h3>
            <button class="btn btn-success" onclick="showRegistrarAeropuerto()">+ Nuevo Aeropuerto</button>
        </div> <br>
        <table class="table">
          <thead>
            <tr><th>ID</th><th>Nombre</th><th>País</th><th>Ciudad</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    }
  } catch (error) {
    console.error(error);
    content.innerHTML = `<p class="alert alert-danger">Error: ${error.message}</p>`;
  }
}

// ================= HELPERS =================
// ================= PASAJEROS =================
window.showRegistrarPasajero = () => {
  const html = `
        <div class="form-group"><label>Nombre</label><input id="p-nombre" class="form-control"></div>
        <div class="form-group"><label>Apellido</label><input id="p-apellido" class="form-control"></div>
        <div class="form-group"><label>Correo</label><input id="p-correo" class="form-control"></div>
        <div class="form-group"><label>Teléfono</label><input id="p-telefono" class="form-control"></div>
        <button class="btn btn-primary mt-2" onclick="submitPasajero()">Guardar</button>
    `;
  showModal('Registrar Pasajero', html);
};

window.submitPasajero = async () => {
  const data = {
    nombre: document.getElementById('p-nombre').value.trim(),
    apellido: document.getElementById('p-apellido').value.trim(),
    correo: document.getElementById('p-correo').value.trim(),
    telefono: document.getElementById('p-telefono').value.trim()
  };

  if (!data.nombre || !data.apellido || !data.correo || !data.telefono) {
    customAlert('Por favor, complete todos los campos');
    return;
  }

  if (!data.correo.includes('@')) {
    customAlert('Por favor, ingrese un correo válido');
    return;
  }

  await window.api.registrarPasajero(data);
  closeModal();
  renderPage('pasajeros');
};

// ================= VUELOS =================
window.showRegistrarVuelo = async () => {
  const aeropuertos = await window.api.getAeropuertos();
  const aviones = await window.api.getAviones();
  const options = aeropuertos.map(a => `<option value="${a.id_aeropuerto}">${a.ciudad} (${a.pais})</option>`).join('');
  const options2 = aviones.map(av => `<option value="${av.id_avion}">${av.id_avion} (${av.aerolinea})</option>`).join('');

  const html = `
        <div class="form-group"><label>Salida</label><input type="datetime-local" id="v-salida" class="form-control"></div>
        <div class="form-group"><label>Llegada</label><input type="datetime-local" id="v-llegada" class="form-control"></div>
        <div class="form-group"><label>Avion</label><select id="v-avion" class="form-control">${options2}</select></div>
        <div class="form-group"><label>Origen</label><select id="v-origen" class="form-control">${options}</select></div>
        <div class="form-group"><label>Destino</label><select id="v-destino" class="form-control">${options}</select></div>
        <div class="form-group"><label>Estado</label><select id="v-estado" class="form-control">
            <option>Programado</option><option>En Curso</option><option>Aterrizado</option><option>Cancelado</option>
        </select></div>
        <button class="btn btn-primary mt-2" onclick="submitVuelo()">Guardar</button>
    `;
  showModal('Registrar Vuelo', html);
};

window.submitVuelo = async () => {
  const data = {
    id_avion: document.getElementById('v-avion').value,
    hora_salida: document.getElementById('v-salida').value,
    hora_llegada: document.getElementById('v-llegada').value,
    id_aeropuerto_origen: document.getElementById('v-origen').value,
    id_aeropuerto_destino: document.getElementById('v-destino').value,
    estado: document.getElementById('v-estado').value
  };

  if (!data.hora_salida || !data.hora_llegada) {
    customAlert('Por favor, complete las fechas de salida y llegada');
    return;
  }

  if (data.id_aeropuerto_origen === data.id_aeropuerto_destino) {
    customAlert('El aeropuerto de origen y destino deben ser diferentes');
    return;
  }

  if (new Date(data.hora_salida) >= new Date(data.hora_llegada)) {
    customAlert('La hora de llegada debe ser posterior a la hora de salida');
    return;
  }

  await window.api.registrarVuelo(data);
  closeModal();
  renderPage('vuelos');
};

window.showModificarVuelo = async()=>{
  const vuelos = await window.api.getVuelos();
  const options = vuelos.map(v => `<option value="${v.id_vuelo}">${v.id_aeropuerto_origen} (${v.estado})</option>`).join('');

  const html = `
        <div class="form-group"><label>Vuelo</label><select id="v-vuelo" class="form-control">${options}</select></div>
        <div class="form-group"><label>Salida</label><input type="datetime-local" id="v-salida" class="form-control"></div>
        <div class="form-group"><label>Llegada</label><input type="datetime-local" id="v-llegada" class="form-control"></div>
        <div class="form-group"><label>Estado</label><select id="v-estado" class="form-control">
            <option>Programado</option><option>En Curso</option><option>Aterrizado</option><option>Cancelado</option>
        </select></div>
        <button class="btn btn-primary mt-2" onclick="modificarVuelo()">Modificar</button>
    `;
  showModal('Modificar Vuelo', html);
};

window.modificarVuelo = async () => {
  const data = {
    hora_salida: document.getElementById('v-salida').value,
    hora_llegada: document.getElementById('v-llegada').value,
    estado: document.getElementById('v-estado').value,
    id_vuelo : document.getElementById('v-vuelo').value
  };

  if (!data.hora_salida || !data.hora_llegada) {
    customAlert('Por favor, complete las fechas de salida y llegada');
    return;
  }

  if (!data.id_vuelo) {
    customAlert('Elige un Vuelo');
    return;
  }

  if (new Date(data.hora_salida) >= new Date(data.hora_llegada)) {
    customAlert('La hora de llegada debe ser posterior a la hora de salida');
    return;
  }

  await window.api.modificarVuelo(data);
  closeModal();
  renderPage('vuelos');
};

// ================= BOLETOS =================
window.showEmitirBoleto = async () => {
  const pasajeros = await window.api.getPasajeros();
  const vuelos = await window.api.getVuelos();

  const pOptions = pasajeros.map(p => `<option value="${p.id_pasajero}">${p.nombre} ${p.apellido}</option>`).join('');
  const vOptions = vuelos.map(v => `<option value="${v.id_vuelo}">${v.origen_ciudad} -> ${v.destino_ciudad} (${new Date(v.hora_salida).toLocaleDateString()})</option>`).join('');

  const html = `
        <div class="form-group"><label>Pasajero</label><select id="b-pasajero" class="form-control">${pOptions}</select></div>
        <div class="form-group"><label>Vuelo</label><select id="b-vuelo" class="form-control">${vOptions}</select></div>
        <div class="form-group"><label>Precio</label><input type="number" id="b-precio" class="form-control"></div>
        <div class="form-group"><label>Terminal</label><input id="b-terminal" class="form-control"></div>
        <div class="form-group"><label>Asiento</label><input id="b-asiento" class="form-control"></div>
        <button class="btn btn-primary mt-2" onclick="submitBoleto()">Emitir</button>
    `;
  showModal('Emitir Boleto', html);
};

window.submitBoleto = async () => {
  const data = {
    id_pasajero: document.getElementById('b-pasajero').value,
    id_vuelo: document.getElementById('b-vuelo').value,
    precio: document.getElementById('b-precio').value,
    terminal: document.getElementById('b-terminal').value.trim(),
    asiento: document.getElementById('b-asiento').value.trim()
  };

  if (!data.id_pasajero || !data.id_vuelo || !data.precio || !data.terminal || !data.asiento) {
    customAlert('Por favor, complete todos los campos');
    return;
  }

  if (parseFloat(data.precio) <= 0) {
    customAlert('El precio debe ser mayor a 0');
    return;
  }

  await window.api.emitirBoleto(data);
  closeModal();
  renderPage('boletos');
};

window.realizarCheckIn = async (id) => {
  if (confirm('¿Confirmar Check-in para este boleto?')) {
    await window.api.realizarCheckIn(id);
    customAlert('Check-in realizado correctamente');
    renderPage('boletos');
  }
};

window.verHistorial = async (id) => {
  const historial = await window.api.getHistorialPasajero(id);
  let html = '<table class="table"><thead><tr><th>Vuelo</th><th>Fecha</th><th>Precio</th></tr></thead><tbody>';
  historial.forEach(h => {
    html += `<tr><td>${h.origen} -> ${h.destino}</td><td>${new Date(h.hora_salida).toLocaleDateString()}</td><td>$${h.precio}</td></tr>`;
  });
  html += '</tbody></table>';
  showModal('Historial de Vuelo', html);
};

// ================= AVIONES =================
window.showRegistrarAvion = () => {
  const html = `
        <div class="form-group"><label>Modelo</label><input id="a-modelo" class="form-control"></div>
        <div class="form-group"><label>Aerolínea</label><input id="a-aerolinea" class="form-control"></div>
        <div class="form-group"><label>Capacidad</label><input type="number" id="a-capacidad" class="form-control"></div>
        <button class="btn btn-primary mt-2" onclick="submitAvion()">Guardar</button>
    `;
  showModal('Registrar Avión', html);
};

window.submitAvion = async () => {
  const data = {
    modelo: document.getElementById('a-modelo').value.trim(),
    aerolinea: document.getElementById('a-aerolinea').value.trim(),
    capacidad_pasajeros: document.getElementById('a-capacidad').value
  };

  if (!data.modelo || !data.aerolinea || !data.capacidad_pasajeros) {
    customAlert('Por favor, complete todos los campos');
    return;
  }

  if (parseInt(data.capacidad_pasajeros) <= 0) {
    customAlert('La capacidad debe ser mayor a 0');
    return;
  }

  await window.api.registrarAvion(data);
  closeModal();
  renderPage('aviones');
};

window.showRegistrarAeropuerto = () => {
  const html = `
        <div class="form-group"><label>Nombre</label><input id="ae-nombre" class="form-control"></div>
        <div class="form-group"><label>País</label><input id="ae-pais" class="form-control"></div>
        <div class="form-group"><label>Estado</label><input id="ae-estado" class="form-control"></div>
        <div class="form-group"><label>Ciudad</label><input id="ae-ciudad" class="form-control"></div>
        <button class="btn btn-primary mt-2" onclick="submitAeropuerto()">Guardar</button>
    `;
  showModal('Registrar Aeropuerto', html);
};

window.submitAeropuerto = async () => {
  const data = {
    nombre : document.getElementById('ae-nombre').value.trim(),
    pais: document.getElementById('ae-pais').value.trim(),
    estado: document.getElementById('ae-estado').value.trim(),
    ciudad: document.getElementById('ae-ciudad').value.trim()
  };

  if (!data.nombre || !data.pais || !data.estado || !data.ciudad) {
    customAlert('Por favor, complete todos los campos');
    return;
  }

  await window.api.registrarAeropuerto(data);
  closeModal();
  renderPage('aeropuertos');
};

// Modal Logic
function showModal(title, content) {
  const modal = document.createElement('div');
  modal.id = 'genericModal';
  modal.style = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;z-index:1000;';
  modal.innerHTML = `
        <div style="background:white;padding:20px;border-radius:8px;width:500px;max-height:90vh;overflow-y:auto;">
            <div style="display:flex;justify-content:space-between;margin-bottom:15px;">
                <h3>${title}</h3>
                <button onclick="closeModal()" style="border:none;background:none;font-size:20px;cursor:pointer;">&times;</button>
            </div>
            <div>${content}</div>
        </div>
    `;
  document.body.appendChild(modal);
}

window.closeModal = () => {
  const modal = document.getElementById('genericModal');
  if (modal) modal.remove();
};


// Iniciar
renderLogin();