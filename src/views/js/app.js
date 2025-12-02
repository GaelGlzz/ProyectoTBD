import { customAlert, customConfirmAsync } from './modalAlerts.js';
let usuarioActual = null;
const appContainer = document.getElementById('app-container');
let vuelosCache = []; // Variable global para guardar los datos de los vuelos
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
  const userRole = usuarioActual.role;

  let navbarItems = [];
  if (userRole === 'Admin') {
    navbarItems = [
      '<a href="#" class="nav-link" data-page="vuelos">Control de Vuelos</a>',
      '<a href="#" class="nav-link" data-page="pasajeros">Gestión de Pasajeros</a>',
      '<a href="#" class="nav-link" data-page="equipaje">Gestión de Equipaje</a>',
      '<a href="#" class="nav-link" data-page="boletos">Manejo de Boletos</a>',
      '<a href="#" class="nav-link" data-page="aviones">Gestión de Aviones</a>',
      '<a href="#" class="nav-link" data-page="aeropuertos">Admin. Aeropuertos</a>',
      '<a href="#" class="nav-link" data-page="reportes">Generar Reportes</a>'
    ];
  } else if (userRole === 'Operador') {
    navbarItems = [
      '<a href="#" class="nav-link" data-page="vuelos">Control de Vuelos</a>',
      '<a href="#" class="nav-link" data-page="pasajeros">Gestión de Pasajeros</a>',
      '<a href="#" class="nav-link" data-page="equipaje">Gestión de Equipaje</a>',
      '<a href="#" class="nav-link" data-page="boletos">Manejo de Boletos</a>',
    ];
  } else if (userRole === 'Analista') {
    navbarItems = [
      '<a href="#" class="nav-link" data-page="vuelos">Control de Vuelos</a>',
      '<a href="#" class="nav-link" data-page="pasajeros">Gestión de Pasajeros</a>',
      '<a href="#" class="nav-link" data-page="boletos">Manejo de Boletos</a>',
      '<a href="#" class="nav-link" data-page="aviones">Gestión de Aviones</a>',
      '<a href="#" class="nav-link" data-page="aeropuertos">Admin. Aeropuertos</a>',
      '<a href="#" class="nav-link" data-page="reportes">Generar Reportes</a>'
    ];
  }

  const navbar = navbarItems.join(' <br>\n      ') + ' <br>\n      <a href="#" class="nav-link" id="logout-btn" style="color:red;">Cerrar Sesión</a> <br>';


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
      <td>${new Date(v.hora_llegada).toLocaleString()}</td>
      <td>$${v.precio}</td>
      <td>${v.estado}</td>
    </tr>
  `).join('');
      // Ocultar botones para Analista
      const actionButtons = usuarioActual.role === 'Analista' ? '' : `
    <button class="btn btn-success" onclick="showRegistrarVuelo()">+ Nuevo Vuelo</button>
    <button class="btn btn-warning" onclick="showModificarVuelo()">! Modificar Vuelo</button>
    <button class="btn btn-danger" onclick="showCancelarVuelo()">! Cancelar Vuelo</button>
  `;
      content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
        <h3>Control de Vuelos</h3>
        ${actionButtons}
    </div> <br>
    <table class="table">
      <thead>
        <tr><th>ID</th><th>Avion</th><th>Ruta</th><th>Salida</th><th>LLegada</th><th>Precio</th><th>Estado</th></tr>
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
      <td>${p.edad} años</td>
      <td>${p.nacionalidad}</td>
      <td>${p.correo}</td>
      <td>
        <button class="btn btn-sm btn-info" onclick="verHistorial(${p.id_pasajero})">Historial</button>
      </td>
    </tr>
  `).join('');
      // Ocultar botón para Analista
      const actionButtons = usuarioActual.role === 'Analista' ? '' : `
    <button class="btn btn-success" onclick="showRegistrarPasajero()">+ Nuevo Pasajero</button>
  `;
      content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
        <h3>Gestión de Pasajeros</h3>
        ${actionButtons}
    </div> <br>
    <table class="table">
      <thead>
        <tr><th>ID</th><th>Nombre</th><th>Edad</th><th>Nacionalidad</th><th>Correo</th><th>Acciones</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
    } else if (page === 'boletos') {
      const userRole = usuarioActual.role;
      const disableCheckIn = userRole === 'Analista' ? 'disabled' : '';
      const hideEmitirBoleto = userRole === 'Analista' ? 'style="display:none;"' : '';
      const boletos = await window.api.getBoletos();
      const boletosParaCheckIn = boletos.filter(b => b.estado === 'No emitido');
      const demasBoletos = boletos.filter(b => b.estado !== 'No emitido');
      let rows = boletosParaCheckIn.map(b => `
        <tr>
          <td>${b.id_boleto}</td>
          <td>${b.nombre} ${b.apellido}</td>
          <td>${b.origen} -> ${b.destino}</td>
          <td>${b.tipoPasajero}</td>
          <td>${b.precio}</td>
          <td>${b.asiento}</td>
          <td>${b.terminal}</td>
          <td>
            <button id='btnCheckIn' class="btn btn-sm btn-primary" onclick="realizarCheckIn(${b.id_boleto}) ${disableCheckIn}">Check-in</button>
            <button class="btn btn-sm btn-secondary" onclick="cancelarBoleto(${b.id_boleto})">Cancelar</button>
          </td>
        </tr>
      `
    ).join('');
      let rows2 = demasBoletos.map(b => `
        <tr>
          <td>${b.id_boleto}</td>
          <td>${b.nombre} ${b.apellido}</td>
          <td>${b.origen} -> ${b.destino}</td>
          <td>${b.asiento}</td>
          <td>${b.terminal}</td>
          <td>${b.estado}</td>
        </tr>
      `).join('');

      content.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3>Manejo de Boletos</h3>
            <button class="btn btn-success" onclick="showEmitirBoleto()"${hideEmitirBoleto}>+ Emitir Boleto</button>
        </div> <br>
        <table id="tablaBoletos1" class="table">
          <thead>
            <tr><th>ID</th><th>Pasajero</th><th>Vuelo</th><th>Tipo de Pasajero</th><th>Precio</th><th>Asiento</th><th>Terminal</th><th>Acciones</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        <table class="table">
          <thead>
            <tr><th>ID</th><th>Pasajero</th><th>Vuelo</th><th>Asiento</th><th>Terminal</th><th>Estado</th></tr>
          </thead>
          <tbody>${rows2}</tbody>
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
      <td>${a.pesoCargaMaxima}</td>
      <td>${a.CargaActual}</td>
      <td>${a.estado}</td>
    </tr>
  `).join('');
      // Ocultar botones para Analista
      const actionButtons = usuarioActual.role === 'Analista' ? '' : `
    <button class="btn btn-success" onclick="showRegistrarAvion()">+ Nuevo Avión</button>
    <button class="btn btn-warning" onclick="showMantenimiento()">Mantenimiento</button>
  `;
      content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
        <h3>Gestión de Aviones</h3>
        ${actionButtons}
    </div> <br>
    <table class="table">
      <thead>
        <tr><th>ID</th><th>Modelo</th><th>Aerolínea</th><th>Capacidad</th><th>Peso de Carga Maximo</th><th>Carga Actual</th><th>Estado</th></tr>
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
          <td>${a.estado}</td>
          <td>${a.ciudad}</td>
        </tr>
      `).join('');
      //<button class="btn btn-success" onclick="showRegistrarAeropuerto()">+ Nuevo Aeropuerto</button> //
      content.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3>Administración de Aeropuertos</h3>
           
        </div> <br>
        <table class="table">
          <thead>
            <tr><th>ID</th><th>Nombre</th><th>País</th><th>Estado</th><th>Ciudad</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    } else if (page == 'equipaje') {
      const pasajeros = await window.api.getPasajerosEquipaje();
      const equipajes = await window.api.getEquipaje();
      let rows2 = pasajeros.map(p => `
        <tr class="clickable-row" onclick="mostrarEquipajePorPasajero(${p.id_pasajero}); mostrarEquipajeEntregadoExtraviado(${p.id_pasajero})">
          <td>${p.id_pasajero}</td>
          <td>${p.nombre} ${p.apellido}</td>
          <td>${p.total_equipaje}</td>
        </tr>
      `).join('');

      let rowsEquipajeInicial = `<tr><td colspan="4" class="text-center">Seleccione un pasajero para ver su equipaje.</td></tr>`;
      let rowsEquipajeEntregadoExtraviado = `<tr><td colspan="4" class="text-center">Seleccione un pasajero para ver su equipaje.</td></tr>`;

      window.equipajesCache = equipajes;
      window.equipajesCache2 = equipajes;

      content.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3>Administración de Equipaje </h3>
            <button class="btn btn-success" onclick="showRegistrarEquipaje()">+ Nuevo Equipaje</button>
        </div> <br>
        <table class="table table-hover">           <thead>
            <tr><th>Id Pasajero</th><th>Nombre</th><th>Total de equipaje</th></tr>
          </thead>
          <tbody>${rows2}</tbody>
        </table>
        <table class="table">
          <thead>
            <tr><th>Id Equipaje</th><th>Id Pasajero</th><th>Peso en Kg</th><th>Estado Actual</th></tr>
          </thead>
          <tbody id="equipaje-body">${rowsEquipajeInicial}</tbody>         </table>
        <table class="table">
          <thead>
            <tr><th>Id Equipaje</th><th>Id Pasajero</th><th>Peso en Kg</th><th>Estado Actual</th><th>Acciones</th></tr>
          </thead>
          <tbody id="equipaje-body2">${rowsEquipajeEntregadoExtraviado}</tbody>         </table>
      `;
    }
    else if (page === 'reportes') {
      const aeropuertos = await window.api.getAeropuertos();
      const aviones = await window.api.getAviones();

      const aeropuertosOptions = aeropuertos.map(a => `<option value="${a.id_aeropuerto}">${a.nombre} - ${a.ciudad}</option>`).join('');
      const avionesOptions = aviones.map(a => `<option value="${a.id_avion}">${a.modelo} (${a.aerolinea})</option>`).join('');

      content.innerHTML = `
        <h3>Generar Reportes</h3>
        <div class="row">
          <div class="col-md-6">
            <div class="card p-3">
              <h5>Reporte de Vuelos por Aeropuerto</h5>
              <div class="form-group">
                <label>Seleccionar Aeropuerto:</label>
                <select id="reporte-aeropuerto" class="form-control">
                  <option value="">-- Seleccione --</option>
                  ${aeropuertosOptions}
                </select>
              </div>
              <button class="btn btn-primary" onclick="generarReporteAeropuerto()">Generar PDF</button>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card p-3">
              <h5>Reporte de Boletos por Avión</h5>
              <div class="form-group">
                <label>Seleccionar Avión:</label>
                <select id="reporte-avion" class="form-control">
                  <option value="">-- Seleccione --</option>
                  ${avionesOptions}
                </select>
              </div>
              <button class="btn btn-primary" onclick="generarReporteAvion()">Generar PDF</button>
            </div>
          </div>
        </div>
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
  const nacionalidades = [
    "Mexicana", "Afgana", "Albana", "Alemana", "Argelina", "Argentina", "Armenia", "Australiana", "Austriaca", "Azerbaiyana", "Bahameña", "Bahreiní", "Bangladesí", "Barbadense", "Belga", "Beliceña", "Beninesa", "Bielorrusa", "Boliviana", "Bosnia", "Botswanesa", "Brasileña", "Británica", "Bruneana", "Búlgara", "Burkinesa",
    "Burundesa", "Caboverdiana", "Camboyana", "Camerunesa", "Canadiense", "Catarí", "Centrafricana", "Checa", "Chilena", "China", "Chipriota", "Colombiana", "Comorense", "Congoleña", "Costarricense", "Croata", "Cubana", "Danesa", "Dominicana",
    "Ecuatoriana", "Egipcia", "Salvadoreña", "Emiratí", "Eslovaca", "Eslovena", "Española", "Estadounidense", "Estonia", "Etíope", "Filipina", "Finlandesa", "Francesa", "Gabonesa", "Galesa", "Gambiana", "Georgiana", "Ghanesa", "Griega", "Guatemalteca", "Guineana",
    "Guyanesa", "Haitiana", "Hondureña", "Húngara", "India", "Indonesa", "Iraní", "Iraquí", "Irlandesa", "Islandesa", "Israelí", "Italiana", "Jamaiquina", "Japonesa", "Jordana", "Kazaja", "Keniana", "Kirguisa", "Kuwaití", "Laosiana", "Letona", "Libanesa", "Liberiana",
    "Libia", "Lituana", "Luxemburguesa", "Macedonia", "Malaya", "Malaui", "Maldiva", "Maliense", "Maltesa", "Marfileña", "Marroquí", "Moldava", "Monegasca", "Mongola", "Mozambiqueña", "Namibia", "Neozelandesa", "Nepalí", "Nicaragüense", "Nigeriana", "Norcoreana", "Noruega", "Omaní", "Pakistaní", "Palestina", "Panameña", "Paraguaya", "Peruana", "Polaca", "Portuguesa", "Puertorriqueña", "Qatarí", "Reino Unido", "Ruandesa", "Rumana", "Rusa", "Saharaui", "Samoana", "Saudí", "Senegalesa", "Serbia", "Singapurense", "Siria", "Somalí", "Sudafricana", "Sudanesa", "Sueca", "Suiza", "Surcoreana", "Tailandesa", "Tanzana", "Tayika", "Tunecina", "Turca", "Turcomana", "Ucraniana", "Ugandesa", "Uruguaya", "Uzbeca", "Venezolana", "Vietnamita", "Yemení", "Zambiana", "Zimbabuense"
  ];

  const options = nacionalidades.map(n => `<option value ="${n}">${n}</option>`).join("");

  const html = `
        <div class="form-group"><label>Nombre</label><input id="p-nombre" class="form-control"></div>
        <div class="form-group"><label>Apellido</label><input id="p-apellido" class="form-control"></div>
        <div class="form-group"><label>Edad</label><input id="p-edad" class="form-control" type="number"></div>
        <div class="form-group">
        <label>Nacionalidad</label>
        <select id="p-nacionalidad" class="form-control"> 
            ${options} 
        </select>
    </div>
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
    edad: document.getElementById('p-edad').value,
    nacionalidad: document.getElementById('p-nacionalidad').value.trim(),
    correo: document.getElementById('p-correo').value.trim(),
    telefono: document.getElementById('p-telefono').value.trim()
  };

  if (!data.nombre || !data.apellido || !data.edad || !data.nacionalidad || !data.correo || !data.telefono) {
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
  const aeropuertoMap = {};
  const optionsAeropuertos = aeropuertos.map(a => { 
    aeropuertoMap[a.id_aeropuerto] = `${a.ciudad} (${a.pais})`;
    return `<option value="${a.id_aeropuerto}">${a.ciudad} (${a.pais})</option>`;
  }).join('');

  const optionsAviones = aviones.map(av => `<option value="${av.id_avion}">${av.id_avion} (${av.aerolinea} - ${av.modelo})</option>`).join('');

  const html = `
    <div class="form-group"><label>Salida</label><input type="datetime-local" id="v-salida" class="form-control"></div>
    <div class="form-group"><label>Llegada</label><input type="datetime-local" id="v-llegada" class="form-control"></div>
    
    <div class="form-group">
        <label>Avion</label>
        <select id="v-avion" class="form-control" onchange="actualizarOrigenVuelo()"> 
            ${optionsAviones} 
        </select>
    </div>

    <div class="form-group">
      <label>Origen (Último destino del avión)</label>
      <input type="text" id="v-origen-display" class="form-control" disabled>
      <input type="hidden" id="v-origen-value">
    </div>
    
    <div class="form-group"><label>Destino</label><select id="v-destino" class="form-control">${optionsAeropuertos}</select></div>
    
    <div class="form-group"><label>Precio del Vuelo($)</label><input id="v-precio" class="form-control" type="number"></div>

    <div class="form-group"><label>Estado</label><select id="v-estado" class="form-control" disabled>
      <option>Programado</option><option>En Curso</option><option>Aterrizado</option><option>Cancelado</option>
    </select></div>
    <button class="btn btn-primary mt-2" onclick="submitVuelo()">Guardar</button>
  `;
  showModal('Registrar Vuelo', html);
  actualizarOrigenVuelo();
};

window.actualizarOrigenVuelo = async () => {
  const idAvion = document.getElementById('v-avion').value;
  const displayElement = document.getElementById('v-origen-display');
  const valueElement = document.getElementById('v-origen-value');

  if (!idAvion) {
    displayElement.value = 'Seleccione un avión';
    valueElement.value = '';
    return;
  }
  try {
    const idUltimoAeropuerto = await window.api.getUltimoAeropuertoAvion(idAvion);
    const aeropuertos = await window.api.getAeropuertos();
    const aeropuerto = aeropuertos.find(a => a.id_aeropuerto == idUltimoAeropuerto);

    if (aeropuerto) {
      displayElement.value = `${aeropuerto.ciudad} (${aeropuerto.pais})`;
      valueElement.value = idUltimoAeropuerto;
    } else {
      // No deberia pero por si el id 1 no existe
      displayElement.value = `Error: Aeropuerto ID ${idUltimoAeropuerto} no encontrado`;
      valueElement.value = idUltimoAeropuerto;
    }

  } catch (error) {
    console.error("Error al obtener último aeropuerto:", error);
    customAlert("Error al cargar la posición del avión.");
    displayElement.value = "Error de carga";
    valueElement.value = '';
  }
};

window.submitVuelo = async () => {
  const data = {
    id_avion: document.getElementById('v-avion').value,
    hora_salida: document.getElementById('v-salida').value,
    hora_llegada: document.getElementById('v-llegada').value,
    id_aeropuerto_origen: document.getElementById('v-origen-value').value,
    id_aeropuerto_destino: document.getElementById('v-destino').value,
    precio: document.getElementById('v-precio').value,
    estado: document.getElementById('v-estado').value
  };
  //validaciones de cliente
  if (!data.hora_salida || !data.hora_llegada) {
    customAlert('Por favor, complete las fechas de salida y llegada');
    return;
  }
  if (new Date(data.hora_salida) >= new Date(data.hora_llegada)) {
    customAlert('La hora de llegada debe ser posterior a la hora de salida');
    return;
  }
  if (!data.precio || data.precio <= 0) {
    customAlert('El precio del vuelo debe ser mayor que 0');
    return;
  }

  try {
    await window.api.registrarVuelo(data);
    customAlert('Vuelo registrado correctamente.');
    closeModal();
    renderPage('vuelos');
  } catch (error) {
    console.error('Error al registrar vuelo:', error);
    const rawMessage = error.message;
    let displayMessage = 'Error desconocido al registrar el vuelo.'; 

    if (rawMessage && rawMessage.includes('El avión no está disponible para programar un vuelo')) {
      displayMessage = 'ERROR: El avión seleccionado no está disponible (En uso/Mantenimiento).';
    } else if (rawMessage && rawMessage.includes('El aeropuerto de origen no puede ser igual al de destino')) {
      displayMessage = 'ERROR: Origen y Destino no pueden ser el mismo aeropuerto.';
    } else if (rawMessage && rawMessage.includes('ERROR DE HORARIO')) {
      // Capturamos otros errores de la DB (como el de horario que ya tenías)
      displayMessage = rawMessage.replace(/[\u0080-\uFFFF]/g, ' ');
    } else if (rawMessage && rawMessage.includes('Error de flujo')) {
      displayMessage = 'ERROR DE FLUJO: El avión no está en el aeropuerto de origen correcto.';
    }
    customAlert(displayMessage);
  }
};

window.showModificarVuelo = async () => {
  const vuelos = await window.api.getVuelos();
  const vuelosActivos = vuelos.filter(v => v.estado !== 'Cancelado' && v.estado !== 'Aterrizado');
  vuelosCache = vuelosActivos;
  const options = vuelosActivos.map(v => `<option value="${v.id_vuelo}">Id: ${v.id_vuelo} / Ruta: ${v.origen_ciudad} -> ${v.destino_ciudad} / Estado:(${v.estado})</option>`).join('');

  const html = `
        <div class="form-group"><label>Vuelo</label><select id="v-vuelo" class="form-control" onchange="cargarDatosVueloModificar()"><option value="">-- Seleccione un vuelo --</option>${options}</select></div>
        <div class="form-group"><label>Salida</label><input type="datetime-local" id="v-salida" class="form-control"></div>
        <div class="form-group"><label>Llegada</label><input type="datetime-local" id="v-llegada" class="form-control"></div>
        <div class="form-group"><label>Estado</label><select id="v-estado" class="form-control">
            <option>Programado</option><option>En Curso</option><option>Aterrizado</option>
        </select></div>
        <button class="btn btn-primary mt-2" onclick="modificarVuelo()">Modificar</button>
    `;
  showModal('Modificar Vuelo', html);
  if (vuelosActivos.length > 0) {
    setTimeout(() => {

      const selectorVuelo = document.getElementById('v-vuelo');
      if (selectorVuelo) {
        selectorVuelo.value = vuelosActivos[0].id_vuelo;
        cargarDatosVueloModificar();
      } else {
        console.error("Error: El selector 'v-vuelo' no se encontró en el DOM.");
      }
    }, 200);
  }
};

window.modificarVuelo = async () => {
  try {
  const data = {
    hora_salida: document.getElementById('v-salida').value,
    hora_llegada: document.getElementById('v-llegada').value,
    estado: document.getElementById('v-estado').value,
    id_vuelo: document.getElementById('v-vuelo').value
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
  } catch (error) {
    console.error('Error al emitir boleto:', error);
    const errorMessage = error.message || 'Error desconocido al modificar el vuelo.';

    if (errorMessage.includes('No se puede cambiar el vuelo a "Programado"')) {
      customAlert(errorMessage);
    } else {
      customAlert(`Error de registro: ${errorMessage}`);
    }
  }
  closeModal();
  renderPage('vuelos');
};

window.cargarDatosVueloModificar = () => {
  const idVuelo = document.getElementById('v-vuelo').value;

  if (!idVuelo) {
    document.getElementById('v-salida').value = '';
    document.getElementById('v-llegada').value = '';
    document.getElementById('v-estado').value = 'Programado';
    return;
  }

  const vueloSeleccionado = vuelosCache.find(v => v.id_vuelo == idVuelo);

  if (vueloSeleccionado) {
    const pad = (num) => (num < 10 ? '0' : '') + num;
    const formatDateTime = (dateTimeString) => {
      if (!dateTimeString || typeof dateTimeString !== 'object') {
        console.log('falle')
        return '';
      }

      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) {
        console.error("Error: new Date() no pudo parsear la cadena:", dateTimeString);
        return '';
      }

      const year = date.getFullYear();
      const month = pad(date.getMonth() + 1);
      const day = pad(date.getDate());
      const hours = pad(date.getHours());
      const minutes = pad(date.getMinutes());

      const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
      console.log(`porfavor funciona fecha formateada : ${formattedDate}`);

      return formattedDate;
    };

    const salidaInput = document.getElementById('v-salida');
    const llegadaInput = document.getElementById('v-llegada');

    if (salidaInput && llegadaInput) {
      const formattedSalida = formatDateTime(vueloSeleccionado.hora_salida);
      const formattedLlegada = formatDateTime(vueloSeleccionado.hora_llegada);
      salidaInput.value = formattedSalida;
      llegadaInput.value = formattedLlegada;

      document.getElementById('v-estado').value = vueloSeleccionado.estado;
    } else {
      console.error("Error: Inputs 'v-salida' o 'v-llegada' no se encontraron en el DOM.");
    }

    console.log(`datos cargados para buelo: ${idVuelo}:`, {
      salida: vueloSeleccionado.hora_salida,
      llegada: vueloSeleccionado.hora_llegada,
      estado: vueloSeleccionado.estado
    });

  } else {
    console.error(`Error: Vuelo con ID ${idVuelo} no encontrado en caché.`);
  }
};

window.showCancelarVuelo = async () => {
  const vuelos = await window.api.getVuelos();
  const vuelosActivos = vuelos.filter(v => v.estado == 'Programado');
  const options = vuelosActivos.map(v => `<option value="${v.id_vuelo}">Id: ${v.id_vuelo} / Ruta: ${v.origen_ciudad} -> ${v.destino_ciudad} / Estado:(${v.estado})</option>`).join('');

  const html = `
        <div class="form-group"><label>Vuelo</label><select id="v-vuelo" class="form-control">${options}</select></div>
         <div class="form-group"><select id="v-estado" style="display: none"  class="form-control">
            <option>Cancelado</option>
        </select></div>
        <button class="btn btn-primary mt-2" onclick="cancelarVuelo()">Cancelar</button>
    `;
  showModal('Cancelar Vuelo', html);
};

window.cancelarVuelo = async () => {
  const data = {
    estado: document.getElementById('v-estado').value,
    id_vuelo: document.getElementById('v-vuelo').value
  };


  if (!data.id_vuelo) {
    customAlert('Elige un Vuelo');
    return;
  }

  await window.api.cancelarVuelo(data);
  closeModal();
  renderPage('vuelos');
};

// ================= BOLETOS =================
window.showEmitirBoleto = async () => {
  const pasajeros = await window.api.getPasajeros();
  const vuelos = await window.api.getVuelos();
  const vuelosDisponibles = vuelos.filter(v => v.estado === 'Programado');

  const pOptions = pasajeros.map(p => `<option value="${p.id_pasajero}">${p.nombre} ${p.apellido}</option>`).join('');
  const vOptions = vuelosDisponibles.map(v => `<option value="${v.id_vuelo}">${v.origen_ciudad} -> ${v.destino_ciudad} (${new Date(v.hora_salida).toLocaleDateString()})</option>`).join('');

  const html = `
        <div class="form-group"><label>Pasajero</label><select id="b-pasajero" class="form-control">${pOptions}</select></div>
        <div class="form-group"><label>Vuelo</label><select id="b-vuelo" class="form-control">${vOptions}</select></div>
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
    terminal: document.getElementById('b-terminal').value.trim(),
    asiento: document.getElementById('b-asiento').value.trim()
  };

  if (!data.id_pasajero || !data.id_vuelo || !data.terminal || !data.asiento) {
    customAlert('Por favor, complete todos los campos');
    return;
  }

  if (parseFloat(data.precio) <= 0) {
    customAlert('El precio debe ser mayor a 0');
    return;
  }
  try {
    await window.api.emitirBoleto(data);
    await window.api.obtenertipoPasajero();

    closeModal();
    renderPage('boletos');
  } catch (error) {
    console.error('Error al emitir boleto:', error);
    const errorMessage = error.message || 'Error desconocido al emitir el boleto.';

    if (errorMessage.includes('ya tiene un boleto registrado')) {
      customAlert(errorMessage);
    } else {
      customAlert(`Error de registro: ${errorMessage}`);
    }
  }

};

window.realizarCheckIn = async (id) => {
  const resultadocheck = window.api.revisarBoleto(id);
  console.log(resultadocheck);
  if (resultadocheck == "Emitido") {
    customAlert('Check-in ya realizado para este boleto');
    return;
  }
  else {
    try {

      const mensaje = '¿Confirma realizar el Check-in para este boleto?';
      const confirmado = await customConfirmAsync(mensaje);

      if (confirmado) {
        await window.api.realizarCheckIn(id);
        customAlert('Check-in realizado correctamente');
        renderPage('boletos');
      } else {
        customAlert('Check-in cancelado.');
      }

    } catch (error) {
      console.error("Error al realizar Check-in:", error);
      customAlert(`Ocurrió un error: ${error.message}`);
    }
  }
};

window.cancelarBoleto = async (id) => {
  try {
    const mensaje = '¿Quiere cancelar este boleto?';
    const confirmado = await customConfirmAsync(mensaje); 

    if (confirmado) {
      await window.api.cancelarBoleto(id);
      customAlert('Boleto cancelado correctamente');
      renderPage('boletos');
    } else {
      customAlert('Cancelacion super cancelada');
    }
  } catch (error) {
    console.error("Error al realizar Check-in:", error);
    customAlert(`Ocurrió un error: ${error.message}`);
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
        <div class="form-group"><label>Peso Máximo a Cargar</label><input type="number" id="a-capacidadCargaMaxima" class="form-control"></div>
        <button class="btn btn-primary mt-2" onclick="submitAvion()">Guardar</button>
    `;
  showModal('Registrar Avión', html);
};

window.submitAvion = async () => {
  const data = {
    modelo: document.getElementById('a-modelo').value.trim(),
    aerolinea: document.getElementById('a-aerolinea').value.trim(),
    capacidad_pasajeros: document.getElementById('a-capacidad').value,
    pesoCargaMaxima: document.getElementById('a-capacidadCargaMaxima').value,
  };

  if (!data.modelo || !data.aerolinea || !data.capacidad_pasajeros || !data.pesoCargaMaxima) {
    customAlert('Por favor, complete todos los campos');
    return;
  }

  if (parseInt(data.capacidad_pasajeros) <= 0) {
    customAlert('La capacidad debe ser mayor a 0');
    return;
  }

  if (parseInt(data.pesoCargaMaxima) <= 0) {
    customAlert('El peso debe ser mayor a 0');
    return;
  }

  await window.api.registrarAvion(data);
  closeModal();
  renderPage('aviones');
};

window.showMantenimiento = async () => {
  const aviones = await window.api.getAviones();
  const avionesDisponibles = aviones.filter(a => a.estado !== 'En uso');
  const options = avionesDisponibles.map(a => `<option value="${a.id_avion}">Id: ${a.id_avion} / Modelo:  ${a.modelo} / Aeroliniea:  ${a.aerolinea}</option>`).join('');

  const html = `
        <div class="form-group"><label>Vuelo</label><select id="a-avion" class="form-control">${options}</select></div>
         <div class="form-group"><select id="a-estado" style="display: none"  class="form-control">
            <option>En mantenimiento</option>
        </select></div>
        <div class="form-group"><select id="a-estado2" style="display: none"  class="form-control">
            <option>En espera</option>
        </select></div>
        <button class="btn btn-primary mt-2" onclick="mantenimiento()">Poner en mantenimiento</button>
        <button class="btn btn-primary mt-2" onclick="fueramantenimiento()">Sacar de mantenimiento</button>
    `;
  showModal('Mantenimiento de aviones', html);
};

window.mantenimiento = async () => {

  const data = {
    estado: document.getElementById('a-estado').value,
    id_avion: document.getElementById('a-avion').value
  };

  if (!data.id_avion) {
    customAlert('Elige un avion');
    return;
  }

  await window.api.mantenimientoAvion(data);
  closeModal();
  renderPage('aviones');
};
window.fueramantenimiento = async () => {

  const data = {
    estado: document.getElementById('a-estado2').value,
    id_avion: document.getElementById('a-avion').value
  };

  if (!data.id_avion) {
    customAlert('Elige un avion');
    return;
  }

  await window.api.mantenimientoAvion(data);
  closeModal();
  renderPage('aviones');
};
// ================= AEROPUERTO =================
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
    nombre: document.getElementById('ae-nombre').value.trim(),
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

// ================= EQUIPAJES =================
window.showRegistrarEquipaje = async () => {
  const pasajeros = await window.api.getPasajeros();
  const options = pasajeros.map(p => `<option value="${p.id_pasajero}">${p.id_pasajero} (${p.nombre} ${p.apellido})</option>`).join('');
  const html = `
        <div class="form-group"><label>Pasajero al que le corresponde</label><select id="eq-pasajero" class="form-control">${options}</select></div>
        <div class="form-group"><label>Peso</label><input type="number" id="eq-peso" class="form-control"></div>
        <div class="form-group"><label>Estado</label><select id="eq-estado" class="form-control" disabled>
            <option>Abordando</option>
        </select></div>
        <button class="btn btn-primary mt-2" onclick="submitEquipaje()">Registrar</button>
    `;
  showModal('Registrar Equipaje', html);
};

window.submitEquipaje = async () => {
    const data = {
        id_pasajero: document.getElementById('eq-pasajero').value,
        peso: parseFloat(document.getElementById('eq-peso').value),
        estado: document.getElementById('eq-estado').value.trim()
    };

    // validaciones del cliente
    if (!data.id_pasajero || isNaN(data.peso) || data.peso <= 0 || data.peso > 30) {
        customAlert('Asegúrese de seleccionar un pasajero e ingresar un peso válido (mayor a 0 y menor a 30).');
        return;
    }

    try {
        await window.api.registrarEquipaje(data);
        customAlert('Equipaje registrado correctamente.');
        closeModal();
        renderPage('equipaje'); 
    } catch (error) {
        console.error('Error al registrar equipaje:', error);
        const rawMessage = error.message;
        let displayMessage = 'Error desconocido al registrar el equipaje.';

        if (rawMessage && rawMessage.includes('El Pasajero ID')) {
            displayMessage = 'El pasajero debe tener un boleto activo (No Invalido/Cancelado).';
        } else if (rawMessage && rawMessage.includes('No se puede registrar equipaje: el vuelo ya está en curso')) {
            displayMessage = 'ERROR: El vuelo ya ha iniciado. No se admite más equipaje.';
        } else if (rawMessage && rawMessage.includes('No se puede registrar equipaje después del check-in')) {
            displayMessage = 'ERROR: No se admite equipaje. El pasajero ya realizó el check-in.';
        } else if (rawMessage && rawMessage.includes('ERROR DE CAPACIDAD')) {
            displayMessage = rawMessage.replace(/[\u0080-\uFFFF]/g, ''); // Error del trigger que checa la capacidad del avion
        }
        
        customAlert(displayMessage);
    }
};

window.mostrarEquipajePorPasajero = (idPasajero) => {

  const todosEquipajes = window.equipajesCache || [];
  const equipajeFiltrado = todosEquipajes.filter(eq => eq.id_pasajero === idPasajero && (eq.estado === 'Abordando' || eq.estado === 'Abordo'));

  const nuevasFilas = equipajeFiltrado.map(eq => `
        <tr>
            <td>${eq.id_equipaje}</td>
            <td>${eq.id_pasajero}</td>
            <td>${eq.peso}</td>
            <td>${eq.estado}</td>
        </tr>
    `).join('');

  const contenidoFinal = nuevasFilas.length > 0
    ? nuevasFilas
    : `<tr><td colspan="4" class="text-center">No hay equipaje registrado para el pasajero ${idPasajero}.</td></tr>`;

  const tbodyEquipaje = document.getElementById('equipaje-body');
  if (tbodyEquipaje) {
    tbodyEquipaje.innerHTML = contenidoFinal;
  }
};

window.mostrarEquipajeEntregadoExtraviado = (idPasajero) => {
  const todosEquipajes = window.equipajesCache2 || [];
  const equipajeFiltrado = todosEquipajes.filter(eq => eq.id_pasajero === idPasajero && (eq.estado === 'Para recoger'  || eq.estado === 'Extraviado'));

  const nuevasFilas = equipajeFiltrado.map(eq => `
        <tr>
            <td>${eq.id_equipaje}</td>
            <td>${eq.id_pasajero}</td>
            <td>${eq.peso}</td>
            <td>${eq.estado}</td>
            <td><button class="btn btn-sm btn-primary" onclick="confirmarEntrega(${eq.id_equipaje})">Confirmar Entrega</button>
            <button class="btn btn-sm btn-primary" onclick="confirmarExtravio(${eq.id_equipaje})">Reportar Extravio</button></td>
        </tr>
    `).join('');

  const contenidoFinal = nuevasFilas.length > 0
    ? nuevasFilas
    : `<tr><td colspan="4" class="text-center">No hay equipaje registrado para el pasajero ${idPasajero}.</td></tr>`;

  const tbodyEquipaje = document.getElementById('equipaje-body2');
  if (tbodyEquipaje) {
    tbodyEquipaje.innerHTML = contenidoFinal;
  }
};


window.eliminarEquipaje = async (id) => {
  try {
    const mensaje = '¿Está seguro de que desea eliminar este equipaje de forma permanente? Esta acción no se puede deshacer.';
    const confirmado = await customConfirmAsync(mensaje); 

    if (confirmado) {
      await window.api.eliminarEquipaje(id);
      customAlert('Equipaje eliminado correctamente');
      renderPage('equipaje');
    } else {
      customAlert('Eliminación de equipaje cancelada.');
    }
  } catch (error) {
    console.error("Error al eliminar equipaje:", error);
    customAlert(`Ocurrió un error al eliminar el equipaje: ${error.message}`);
  }
};

window.confirmarEntrega = async (id) => {
  try {
    const mensaje = '¿Este equipaje ha sido entregado al pasajero?';
    const confirmado = await customConfirmAsync(mensaje); 

    if (confirmado) {
      await window.api.confirmarEntregaEquipaje(id);
      customAlert('Equipaje entregado correctamente');
      renderPage('equipaje');
    } else {
    }
  } catch (error) {
    console.error("Error al entregar el equipaje:", error);
    customAlert(`Ocurrió un error al entregar el equipaje: ${error.message}`);
  }
};

window.confirmarExtravio = async (id) => {
  try {
    const mensaje = '¿Este equipaje ha sido extraviado?';
    const confirmado = await customConfirmAsync(mensaje);

    if (confirmado) {
      await window.api.confirmarExtravioEquipaje(id);
      customAlert('Equipaje reportado como extraviado');
      renderPage('equipaje');
    } else {
    }
  } catch (error) {
    console.error("Error al extraviar el equipaje:", error);
    customAlert(`Ocurrió un error al extraviar el equipaje: ${error.message}`);
  }
};


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

async function generarReporteAeropuerto() {
  const select = document.getElementById('reporte-aeropuerto');
  const idAeropuerto = select.value;

  if (!idAeropuerto) {
    await customAlert('Por favor seleccione un aeropuerto');
    return;
  }

  try {
    const result = await window.api.generarReporteVuelosAeropuerto(parseInt(idAeropuerto));
    if (result.success) {
      await customAlert(`Reporte generado exitosamente en: ${result.path}`);
    }
  } catch (error) {
    console.error('Error generando reporte:', error);
    await customAlert('Error al generar el reporte');
  }
}

async function generarReporteAvion() {
  const select = document.getElementById('reporte-avion');
  const idAvion = select.value;

  if (!idAvion) {
    await customAlert('Por favor seleccione un avión');
    return;
  }

  try {
    const result = await window.api.generarReporteBoletosAvion(parseInt(idAvion));
    if (result.success) {
      await customAlert(`Reporte generado exitosamente en: ${result.path}`);
    }
  } catch (error) {
    console.error('Error generando reporte:', error);
    await customAlert('Error al generar el reporte');
  }
}

window.generarReporteAeropuerto = generarReporteAeropuerto;
window.generarReporteAvion = generarReporteAvion;


// Iniciar
renderLogin();