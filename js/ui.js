/* ============================================
   UI - header, nav, plantel, modal final
   ============================================ */

const FORMACION_433 = [
  { key: 'Arquero', label: 'Arquero', count: 1, pitchY: 90, pitchXs: [50] },
  { key: 'LateralDerecho', label: 'Lateral Derecho', count: 1, pitchY: 68, pitchXs: [85] },
  { key: 'CentralDerecho', label: 'Central Derecho', count: 1, pitchY: 73, pitchXs: [62] },
  { key: 'CentralIzquierdo', label: 'Central Izquierdo', count: 1, pitchY: 73, pitchXs: [38] },
  { key: 'LateralIzquierdo', label: 'Lateral Izquierdo', count: 1, pitchY: 68, pitchXs: [15] },
  { key: 'MediocampistaIzquierdo', label: 'Mediocampista Izquierdo', count: 1, pitchY: 44, pitchXs: [20] },
  { key: 'MediocampistaC', label: 'MediocampistaCentro', count: 1, pitchY: 53, pitchXs: [50] },
  { key: 'MediocampistaD', label: 'MediocampistaDerecho', count: 1, pitchY: 44, pitchXs: [80] },
  { key: 'ExtremoDerecho', label: 'Extremo Derecho', count: 1, pitchY: 20, pitchXs: [80] },
  { key: 'ExtremoIzquierdo', label: 'Extremo Izquierdo', count: 1, pitchY: 20, pitchXs: [20] },
  { key: 'DelanteroC', label: 'DelanteroCentro', count: 1, pitchY: 16, pitchXs: [50] },
];

const uiDom = {
  presupuesto: null,
  saltosRestantes: null,
  saltosBadge: null,
  posicionesNav: null,
  posicionNombre: null,
  btnComprar: null,
  btnSaltear: null,
  plantelGrid: null,
  modalFinal: null,
  modalEquipo: null,
  selectorModos: null,
  selectorGrid: null,
  btnComenzarSubasta: null,
  formacionFinal: null,
  sidebarTabs: [],
  tabPanels: [],
  tabFormacion: null,
  tabSimular: null,
  panelFormacion: null,
  panelSimular: null,
};

const MODOS_PARTIDA = [
  { id: 'champions', nombre: 'Ganar la Champions', descripcion: 'Competir por la Champions League.', folder: 'Champions' },
  { id: 'mundial', nombre: 'Ganar el Mundial', descripcion: 'Levantar el trofeo mundial.', folder: 'Mundial' },
  { id: 'libertadores', nombre: 'Ganar la Libertadores', descripcion: 'Conquistar la Copa Libertadores.', folder: 'Libertadores' },
];

function obtenerEquiposDelModo(modoId = state.objetivo) {
  const mapa = {
    champions: MODO_CHAMPIONS?.equipos || [],
    mundial: MODO_MUNDIAL?.equipos || [],
    libertadores: MODO_LIBERTADORES?.equipos || [],
  };

  return mapa[modoId] || [];
}

function obtenerEscudoEquipoDelModo(modoId, nombreEquipo) {
  const carpeta = MODOS_PARTIDA.find(modo => modo.id === modoId)?.folder || 'Champions';
  if (!nombreEquipo) return '';
  return `Imagenes/Escudos/${carpeta}/${nombreEquipo}.png`;
}

function obtenerImagenModo(modoId) {
  const equipos = obtenerEquiposDelModo(modoId);
  if (!equipos.length) return '';
  return obtenerEscudoEquipoDelModo(modoId, equipos[0]);
}

function cachearUiDom() {
  uiDom.presupuesto = document.getElementById('presupuesto');
  uiDom.saltosRestantes = document.getElementById('saltos-restantes');
  uiDom.saltosBadge = document.getElementById('saltos-badge');
  uiDom.posicionNombre = document.getElementById('posicion-nombre');
  uiDom.btnComprar = document.getElementById('btn-comprar');
  uiDom.btnSaltear = document.getElementById('btn-saltear');
  uiDom.plantelGrid = document.getElementById('plantel-grid');
  uiDom.modalFinal = document.getElementById('modal-final');
  uiDom.modalEquipo = document.getElementById('modal-seleccion-equipo');
  uiDom.selectorModos = document.getElementById('selector-modos');
  uiDom.selectorGrid = document.getElementById('selector-grid');
  uiDom.btnComenzarSubasta = document.getElementById('btn-comenzar-subasta');
  uiDom.formacionFinal = document.getElementById('formacion-final');
  uiDom.sidebarTabs = [...document.querySelectorAll('.sidebar-tab')];
  uiDom.tabPanels = [...document.querySelectorAll('.tab-panel')];
  uiDom.tabFormacion = document.getElementById('tab-formacion');
  uiDom.tabSimular = document.getElementById('tab-simular');
  uiDom.panelFormacion = document.getElementById('panel-formacion');
  uiDom.panelSimular = document.getElementById('panel-simular');
}

function formatearMonto(valor) {
  return `${Math.round(valor).toLocaleString('es-AR')}M`;
}

function mostrarTab(tabId) {
  uiDom.sidebarTabs.forEach(tab => {
    const active = tab.dataset.tab === tabId;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });

  uiDom.tabPanels.forEach(panel => {
    panel.classList.toggle('active', panel.id === `panel-${tabId}`);
  });
}

function actualizarTabEstado() {
  const completa = formacionCompleta();
  uiDom.tabSimular.disabled = !completa;
  uiDom.tabSimular.classList.toggle('disabled', !completa);
  if (!completa) {
    uiDom.tabSimular.setAttribute('title', 'Completa la formación para habilitar la simulación');
  } else {
    uiDom.tabSimular.removeAttribute('title');
  }

  const panelSimulacion = uiDom.panelSimular?.querySelector('.simulacion-estado');
  if (panelSimulacion) {
    panelSimulacion.textContent = completa
      ? 'La formación está completa y ya podés simular el once.'
      : 'Faltan jugadores por completar la formación.';
  }
}

function actualizarHeader() {
  uiDom.presupuesto.textContent = formatearMonto(state.presupuesto);
  uiDom.saltosRestantes.textContent = state.saltosRestantes;
  uiDom.saltosBadge.textContent = state.saltosRestantes;
  actualizarTabEstado();
}

function actualizarNombrePosicion() {
  uiDom.posicionNombre.textContent = posicionActual().nombre;
}

// Habilita/deshabilita los botones según el estado actual
function actualizarBotones() {
  uiDom.btnComprar.disabled = !puedeComprar();
  uiDom.btnSaltear.disabled = !puedeSaltear();
}

// Slot vacío/ocupado dentro del grid de "Tu plantel"
function crearSlotPlantel(posicion) {
  const slot = document.createElement('div');
  slot.className = 'plantel-slot';
  slot.dataset.posicion = posicion.id;

  const label = document.createElement('span');
  label.className = 'slot-pos';
  label.textContent = posicion.nombre;
  slot.appendChild(label);

  const nombre = document.createElement('span');
  nombre.className = 'slot-nombre';
  nombre.textContent = '—';
  slot.appendChild(nombre);

  return slot;
}

function renderPlantelInicial() {
  if (!uiDom.plantelGrid) return;
  uiDom.plantelGrid.innerHTML = '';
  POSICIONES.forEach(pos => {
    uiDom.plantelGrid.appendChild(crearSlotPlantel(pos));
  });
}

function actualizarSlotPlantel(posicionId, jugador) {
  if (!uiDom.plantelGrid) return;
  const slot = uiDom.plantelGrid.querySelector(`[data-posicion="${posicionId}"]`);
  if (!slot) return;

  slot.classList.add('ocupado');
  slot.dataset.tipo = tipoAAtributo(jugador.tipo);
  slot.querySelector('.slot-nombre').textContent = jugador.name;
}

function renderFormacionTab() {
  if (!uiDom.panelFormacion) return;

  const contenedor = uiDom.panelFormacion.querySelector('.formacion-tab-list');
  if (!contenedor) return;

  contenedor.innerHTML = '';

  const slotMap = new Map();
  Object.values(state.plantel).forEach(entrada => {
    if (!entrada || !entrada.jugador) return;
    const key = entrada.jugador.position || entrada.jugador.name;
    slotMap.set(key, entrada);
  });

  FORMACION_433.forEach(item => {
    const matchingPos = POSICIONES.find(pos => pos.pool === item.key) || POSICIONES.find(pos => pos.nombre === item.label);
    const entrada = matchingPos ? state.plantel[matchingPos.id] : null;
    const slot = document.createElement('div');
    slot.className = `formation-slot ${entrada ? 'ocupado' : ''}`;
    if (entrada) slot.dataset.tipo = tipoAAtributo(entrada.jugador.tipo);

    const x = Array.isArray(item.pitchXs) ? item.pitchXs[0] : 50;
    slot.style.left = `${x}%`;
    slot.style.top = `${item.pitchY}%`;

    const nombre = document.createElement('span');
    nombre.className = 'formation-slot-name';
    nombre.textContent = entrada ? entrada.jugador.name : '—';
    slot.appendChild(nombre);

    const label = document.createElement('span');
    label.className = 'formation-slot-label';
    label.textContent = item.label;
    slot.appendChild(label);

    contenedor.appendChild(slot);
  });
}

function mostrarModalFinal() {
  uiDom.formacionFinal.innerHTML = '';

  POSICIONES.forEach(pos => {
    const entrada = state.plantel[pos.id];
    const item = document.createElement('div');
    item.className = 'plantel-slot ocupado';
    if (entrada) item.dataset.tipo = tipoAAtributo(entrada.jugador.tipo);

    const label = document.createElement('span');
    label.className = 'slot-pos';
    label.textContent = pos.nombre;
    item.appendChild(label);

    const nombre = document.createElement('span');
    nombre.className = 'slot-nombre';
    nombre.textContent = entrada ? entrada.jugador.name : '—';
    item.appendChild(nombre);

    uiDom.formacionFinal.appendChild(item);
  });

  renderFormacionTab();
  uiDom.modalFinal.hidden = false;
}

function ocultarModalFinal() {
  uiDom.modalFinal.hidden = true;
}

function mostrarSelectorEquipo() {
  if (!uiDom.modalEquipo) return;
  state.objetivo = null;
  state.equipoSeleccionado = null;

  const modalTitle = uiDom.modalEquipo.querySelector('h2');
  if (modalTitle) modalTitle.textContent = 'Elige tu objetivo';

  const modeSection = document.getElementById('selector-mode-section');
  const teamSection = document.getElementById('selector-team-section');
  if (modeSection) modeSection.hidden = false;
  if (teamSection) teamSection.hidden = true;

  renderSelectorModos();
  renderSelectorEquipos();
  uiDom.modalEquipo.hidden = false;
}

function ocultarSelectorEquipo() {
  if (!uiDom.modalEquipo) return;
  uiDom.modalEquipo.hidden = true;
}

function renderSelectorModos() {
  if (!uiDom.selectorModos) return;

  uiDom.selectorModos.innerHTML = MODOS_PARTIDA.map(modo => {
    const activo = state.objetivo === modo.id ? 'active' : '';
    const image = obtenerImagenModo(modo.id);
    return `
      <button type="button" class="modo-option ${activo}" data-modo="${modo.id}">
        <span class="modo-image" style="background-image: url('${image}');"></span>
        <span class="modo-copy">
          <strong>${modo.nombre}</strong>
          <small>${modo.descripcion}</small>
        </span>
      </button>
    `;
  }).join('');

  uiDom.selectorModos.querySelectorAll('.modo-option').forEach(button => {
    button.addEventListener('click', () => {
      state.objetivo = button.dataset.modo;
      renderSelectorModos();

      const modalTitle = uiDom.modalEquipo?.querySelector('h2');
      if (modalTitle) modalTitle.textContent = 'Elige tu equipo';

      const modeSection = document.getElementById('selector-mode-section');
      const teamSection = document.getElementById('selector-team-section');
      if (modeSection) modeSection.hidden = true;
      if (teamSection) {
        teamSection.hidden = false;
        teamSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      renderSelectorEquipos();
    });
  });
}

function obtenerConfigObjetivo() {
  const clave = state.objetivo || 'champions';
  const config = {
    champions: {
      titulo: 'Champions League',
      tagline: 'Ganar la Champions',
      ganador: 'es campeón de la Champions League.'
    },
    mundial: {
      titulo: 'Mundial',
      tagline: 'Ganar el Mundial',
      ganador: 'es campeón del Mundial.'
    },
    libertadores: {
      titulo: 'Copa Libertadores',
      tagline: 'Ganar la Libertadores',
      ganador: 'es campeón de la Libertadores.'
    }
  };

  return config[clave] || config.champions;
}

function renderSelectorEquipos() {
  if (!uiDom.selectorGrid) return;

  const equiposModo = obtenerEquiposDelModo(state.objetivo);
  const opciones = equiposModo.map(nombreEquipo => {
    const activo = state.equipoSeleccionado === nombreEquipo ? 'active' : '';
    const escudo = obtenerEscudoEquipoDelModo(state.objetivo, nombreEquipo);
    return `
      <button type="button" class="equipo-option ${activo}" data-equipo="${nombreEquipo}">
        <img src="${escudo}" alt="${nombreEquipo}" class="equipo-option-escudo">
        <span>${nombreEquipo}</span>
      </button>
    `;
  }).join('');

  uiDom.selectorGrid.innerHTML = opciones;

  uiDom.selectorGrid.querySelectorAll('.equipo-option').forEach(button => {
    button.addEventListener('click', () => {
      state.equipoSeleccionado = button.dataset.equipo;
      renderSelectorEquipos();
      if (uiDom.btnComenzarSubasta) {
        uiDom.btnComenzarSubasta.disabled = false;
        uiDom.btnComenzarSubasta.classList.remove('disabled');
      }
    });
  });

  if (uiDom.btnComenzarSubasta) {
    const habilitado = Boolean(state.objetivo) && Boolean(state.equipoSeleccionado);
    uiDom.btnComenzarSubasta.disabled = !habilitado;
    uiDom.btnComenzarSubasta.classList.toggle('disabled', !habilitado);
  }
}

const EQUIPOS_DISPONIBLES = [
  { nombre: 'AC Milan', escudo: 'Imagenes/Escudos/AC Milan.png' },
  { nombre: 'AC Reggiana', escudo: 'Imagenes/Escudos/AC Reggiana.png' },
  { nombre: 'AEL Limassol', escudo: 'Imagenes/Escudos/AEL Limassol.png' },
  { nombre: 'Al-Ahli', escudo: 'Imagenes/Escudos/Al-Ahli.png' },
  { nombre: 'Al-Duhail', escudo: 'Imagenes/Escudos/Al-Duhail.png' },
  { nombre: 'Al-Hilal', escudo: 'Imagenes/Escudos/Al-Hilal.png' },
  { nombre: 'Al-Nassr', escudo: 'Imagenes/Escudos/Al-Nassr.png' },
  { nombre: 'Al-Qadisiyah', escudo: 'Imagenes/Escudos/Al-Qadisiyah.png' },
  { nombre: 'Al-Shabab', escudo: 'Imagenes/Escudos/Al-Shabab.png' },
  { nombre: 'Al-Wasl', escudo: 'Imagenes/Escudos/Al-Wasl.png' },
  { nombre: 'Alavés', escudo: 'Imagenes/Escudos/Alavés.png' },
  { nombre: 'Alianza Lima', escudo: 'Imagenes/Escudos/Alianza Lima.png' },
  { nombre: 'Argentinos Juniors', escudo: 'Imagenes/Escudos/Argentinos Juniors.png' },
  { nombre: 'Arsenal', escudo: 'Imagenes/Escudos/Arsenal.png' },
  { nombre: 'Aston Villa', escudo: 'Imagenes/Escudos/Aston Villa.png' },
  { nombre: 'Atalanta', escudo: 'Imagenes/Escudos/Atalanta.png' },
  { nombre: 'Atenas FC', escudo: 'Imagenes/Escudos/Atenas FC.png' },
  { nombre: 'Athletic Club', escudo: 'Imagenes/Escudos/Athletic Club.png' },
  { nombre: 'Atlanta United', escudo: 'Imagenes/Escudos/Atlanta United.png' },
  { nombre: 'Atlas', escudo: 'Imagenes/Escudos/Atlas.png' },
  { nombre: 'Atlético de Madrid', escudo: 'Imagenes/Escudos/Atlético de Madrid.png' },
  { nombre: 'Atlético Mineiro', escudo: 'Imagenes/Escudos/Atlético Mineiro.png' },
  { nombre: 'Atlético Nacional', escudo: 'Imagenes/Escudos/Atlético Nacional.png' },
  { nombre: 'Barcelona', escudo: 'Imagenes/Escudos/Barcelona.png' },
  { nombre: 'Bayer Leverkusen', escudo: 'Imagenes/Escudos/Bayer Leverkusen.png' },
  { nombre: 'Bayern Múnich', escudo: 'Imagenes/Escudos/Bayern Múnich.png' },
  { nombre: 'Belgrano', escudo: 'Imagenes/Escudos/Belgrano.png' },
  { nombre: 'Benfica', escudo: 'Imagenes/Escudos/Benfica.png' },
  { nombre: 'Beşiktaş', escudo: 'Imagenes/Escudos/Beşiktaş.png' },
  { nombre: 'Boca Juniors', escudo: 'Imagenes/Escudos/Boca Juniors.png' },
  { nombre: 'Bolívar', escudo: 'Imagenes/Escudos/Bolívar.png' },
  { nombre: 'Borussia Dortmund', escudo: 'Imagenes/Escudos/Borussia Dortmund.png' },
  { nombre: 'Botafogo', escudo: 'Imagenes/Escudos/Botafogo.png' },
  { nombre: 'Bournemouth', escudo: 'Imagenes/Escudos/Bournemouth.png' },
  { nombre: 'Brentford', escudo: 'Imagenes/Escudos/Brentford.png' },
  { nombre: 'Brighton', escudo: 'Imagenes/Escudos/Brighton.png' },
  { nombre: 'Burgos', escudo: 'Imagenes/Escudos/Burgos.png' },
  { nombre: 'Burnley', escudo: 'Imagenes/Escudos/Burnley.png' },
  { nombre: 'Cagliari', escudo: 'Imagenes/Escudos/Cagliari.png' },
  { nombre: 'Calcio Padova', escudo: 'Imagenes/Escudos/Calcio Padova.png' },
  { nombre: 'Celta de Vigo', escudo: 'Imagenes/Escudos/Celta de Vigo.png' },
  { nombre: 'Chelsea', escudo: 'Imagenes/Escudos/Chelsea.png' },
  { nombre: 'Colo Colo', escudo: 'Imagenes/Escudos/Colo Colo.png' },
  { nombre: 'Como 1907', escudo: 'Imagenes/Escudos/Como 1907.png' },
  { nombre: 'Corinthians', escudo: 'Imagenes/Escudos/Corinthians.png' },
  { nombre: 'Cruzeiro', escudo: 'Imagenes/Escudos/Cruzeiro.png' },
  { nombre: 'Crystal Palace', escudo: 'Imagenes/Escudos/Crystal Palace.png' },
  { nombre: 'Deportivo de La Coruña', escudo: 'Imagenes/Escudos/Deportivo de La Coruña.png' },
  { nombre: 'Deportivo Guadalajara', escudo: 'Imagenes/Escudos/Deportivo Guadalajara.png' },
  { nombre: 'Deportivo Riestra', escudo: 'Imagenes/Escudos/Deportivo Riestra.png' },
  { nombre: 'Deportivo Toluca', escudo: 'Imagenes/Escudos/Deportivo Toluca.png' },
  { nombre: 'Dinamo de Kiev', escudo: 'Imagenes/Escudos/Dinamo de Kiev.png' },
  { nombre: 'Dinamo Moscú', escudo: 'Imagenes/Escudos/Dinamo Moscú.png' },
  { nombre: 'Dinamo Zagreb', escudo: 'Imagenes/Escudos/Dinamo Zagreb.png' },
  { nombre: 'Earthquakes', escudo: 'Imagenes/Escudos/Earthquakes.png' },
  { nombre: 'Elche', escudo: 'Imagenes/Escudos/Elche.png' },
  { nombre: 'Estrasburgo', escudo: 'Imagenes/Escudos/Estrasburgo.png' },
  { nombre: 'Estudiantes de La Plata', escudo: 'Imagenes/Escudos/Estudiantes de La Plata.png' },
  { nombre: 'Everton', escudo: 'Imagenes/Escudos/Everton.png' },
  { nombre: 'Fenerbahçe', escudo: 'Imagenes/Escudos/Fenerbahçe.png' },
  { nombre: 'Feyenoord', escudo: 'Imagenes/Escudos/Feyenoord.png' },
  { nombre: 'Fiorentina', escudo: 'Imagenes/Escudos/Fiorentina.png' },
  { nombre: 'Flamengo', escudo: 'Imagenes/Escudos/Flamengo.png' },
  { nombre: 'Fluminense', escudo: 'Imagenes/Escudos/Fluminense.png' },
  { nombre: 'Frankfurt', escudo: 'Imagenes/Escudos/Frankfurt.png' },
  { nombre: 'Fulham', escudo: 'Imagenes/Escudos/Fulham.png' },
  { nombre: 'Galatasaray', escudo: 'Imagenes/Escudos/Galatasaray.png' },
  { nombre: 'Getafe', escudo: 'Imagenes/Escudos/Getafe.png' },
  { nombre: 'Girona', escudo: 'Imagenes/Escudos/Girona.png' },
  { nombre: 'Granada', escudo: 'Imagenes/Escudos/Granada.png' },
  { nombre: 'Grêmio', escudo: 'Imagenes/Escudos/Grêmio.png' },
  { nombre: 'Huracán', escudo: 'Imagenes/Escudos/Huracán.png' },
  { nombre: 'Independiente', escudo: 'Imagenes/Escudos/Independiente.png' },
  { nombre: 'Inter de Milán', escudo: 'Imagenes/Escudos/Inter de Milán.png' },
  { nombre: 'Inter Miami', escudo: 'Imagenes/Escudos/Inter Miami.png' },
  { nombre: 'Internacional', escudo: 'Imagenes/Escudos/Internacional.png' },
  { nombre: 'Juventus', escudo: 'Imagenes/Escudos/Juventus.png' },
  { nombre: 'Lanús', escudo: 'Imagenes/Escudos/Lanús.png' },
  { nombre: 'Leeds', escudo: 'Imagenes/Escudos/Leeds.png' },
  { nombre: 'Leicester City', escudo: 'Imagenes/Escudos/Leicester City.png' },
  { nombre: 'Lens', escudo: 'Imagenes/Escudos/Lens.png' },
  { nombre: 'Lille', escudo: 'Imagenes/Escudos/Lille.png' },
  { nombre: 'Liverpool', escudo: 'Imagenes/Escudos/Liverpool.png' },
  { nombre: 'Los Angeles FC', escudo: 'Imagenes/Escudos/Los Angeles FC.png' },
  { nombre: 'Manchester City', escudo: 'Imagenes/Escudos/Manchester City.png' },
  { nombre: 'Manchester United', escudo: 'Imagenes/Escudos/Manchester United.png' },
  { nombre: 'Minnesota United', escudo: 'Imagenes/Escudos/Minnesota United.png' },
  { nombre: 'Monaco', escudo: 'Imagenes/Escudos/Monaco.png' },
  { nombre: 'Monterrey', escudo: 'Imagenes/Escudos/Monterrey.png' },
  { nombre: 'Napoli', escudo: 'Imagenes/Escudos/Napoli.png' },
  { nombre: 'Neom SC', escudo: 'Imagenes/Escudos/Neom SC.png' },
  { nombre: 'Newcastle', escudo: 'Imagenes/Escudos/Newcastle.png' },
  { nombre: 'Nottingham Forest', escudo: 'Imagenes/Escudos/Nottingham Forest.png' },
  { nombre: 'Olimpia', escudo: 'Imagenes/Escudos/Olimpia.png' },
  { nombre: 'Olympique de Lyon', escudo: 'Imagenes/Escudos/Olympique de Lyon.png' },
  { nombre: 'Olympique de Marsella', escudo: 'Imagenes/Escudos/Olympique de Marsella.png' },
  { nombre: 'Palmeiras', escudo: 'Imagenes/Escudos/Palmeiras.png' },
  { nombre: 'Paris FC', escudo: 'Imagenes/Escudos/Paris FC.png' },
  { nombre: 'Parma', escudo: 'Imagenes/Escudos/Parma.png' },
  { nombre: 'Pisa', escudo: 'Imagenes/Escudos/Pisa.png' },
  { nombre: 'Portland Timbers', escudo: 'Imagenes/Escudos/Portland Timbers.png' },
  { nombre: 'Porto', escudo: 'Imagenes/Escudos/Porto.png' },
  { nombre: 'PSG', escudo: 'Imagenes/Escudos/PSG.png' },
  { nombre: 'PSV', escudo: 'Imagenes/Escudos/PSV.png' },
  { nombre: 'Racing Club', escudo: 'Imagenes/Escudos/Racing Club.png' },
  { nombre: 'Rayo Vallecano', escudo: 'Imagenes/Escudos/Rayo Vallecano.png' },
  { nombre: 'RB Leipzig', escudo: 'Imagenes/Escudos/RB Leipzig.png' },
  { nombre: 'Real Betis', escudo: 'Imagenes/Escudos/Real Betis.png' },
  { nombre: 'Real Madrid', escudo: 'Imagenes/Escudos/Real Madrid.png' },
  { nombre: 'Real Oviedo', escudo: 'Imagenes/Escudos/Real Oviedo.png' },
  { nombre: 'Real Sociedad', escudo: 'Imagenes/Escudos/Real Sociedad.png' },
  { nombre: 'River Plate', escudo: 'Imagenes/Escudos/River Plate.png' },
  { nombre: 'Roma', escudo: 'Imagenes/Escudos/Roma.png' },
  { nombre: 'Rosario Central', escudo: 'Imagenes/Escudos/Rosario Central.png' },
  { nombre: 'Royal Union', escudo: 'Imagenes/Escudos/Royale Union.png' },
  { nombre: 'San Diego', escudo: 'Imagenes/Escudos/San Diego.png' },
  { nombre: 'San Lorenzo', escudo: 'Imagenes/Escudos/San Lorenzo.png' },
  { nombre: 'Santos', escudo: 'Imagenes/Escudos/Santos.png' },
  { nombre: 'São Paulo', escudo: 'Imagenes/Escudos/São Paulo.png' },
  { nombre: 'Schalke 04', escudo: 'Imagenes/Escudos/Schalke 04.png' },
  { nombre: 'Sevilla', escudo: 'Imagenes/Escudos/Sevilla.png' },
  { nombre: 'Spartak de Moscú', escudo: 'Imagenes/Escudos/Spartak de Moscú.png' },
  { nombre: 'Sporting Lisboa', escudo: 'Imagenes/Escudos/Sporting Lisboa.png' },
  { nombre: 'Stade Rennes', escudo: 'Imagenes/Escudos/Stade Rennes.png' },
  { nombre: 'Sunderland', escudo: 'Imagenes/Escudos/Sunderland.png' },
  { nombre: 'Tigre', escudo: 'Imagenes/Escudos/Tigre.png' },
  { nombre: 'Torino', escudo: 'Imagenes/Escudos/Torino.png' },
  { nombre: 'Tottenham', escudo: 'Imagenes/Escudos/Tottenham.png' },
  { nombre: 'Trabzonspor', escudo: 'Imagenes/Escudos/Trabzonspor.png' },
  { nombre: 'Valencia', escudo: 'Imagenes/Escudos/Valencia.png' },
  { nombre: 'Vélez Sarsfield', escudo: 'Imagenes/Escudos/Vélez Sarsfield.png' },
  { nombre: 'Villarreal', escudo: 'Imagenes/Escudos/Villarreal.png' },
  { nombre: 'West Ham', escudo: 'Imagenes/Escudos/West Ham.png' },
  { nombre: 'Wydad Casablanca', escudo: 'Imagenes/Escudos/Wydad Casablanca.png' },
  { nombre: 'Zenit', escudo: 'Imagenes/Escudos/Zenit.png' },
  { nombre: 'Ajax', escudo: 'Imagenes/Escudos/Ajax.png' },
  { nombre: 'Sin Equipo', escudo: 'Imagenes/Escudos/Sin Equipo.png' },
];

function normalizarTexto(valor = '') {
  return String(valor)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function obtenerEscudoClub(clubName) {
  const club = EQUIPOS_DISPONIBLES.find(item => normalizarTexto(item.nombre) === normalizarTexto(clubName));
  if (club) return club.escudo;

  const alias = {
    'newcastle': 'Imagenes/Escudos/Newcastle.png',
    'new castle': 'Imagenes/Escudos/Newcastle.png',
    'acmilan': 'Imagenes/Escudos/AC Milan.png',
    'realmadrid': 'Imagenes/Escudos/Real Madrid.png',
    'barcelona': 'Imagenes/Escudos/Barcelona.png',
    'bayernmunich': 'Imagenes/Escudos/Bayern Múnich.png',
    'parma': 'Imagenes/Escudos/Parma.png',
  };

  const clave = normalizarTexto(clubName);
  return alias[clave] || 'Imagenes/Escudos/Sin Equipo.png';
}

function obtenerClubPrincipalDelPlantel() {
  if (state.equipoSeleccionado) {
    return state.equipoSeleccionado;
  }

  const clubes = Object.values(state.plantel)
    .map(entrada => entrada?.jugador?.club)
    .filter(Boolean);

  if (!clubes.length) return 'Real Madrid';

  const conteo = {};
  clubes.forEach(club => {
    conteo[club] = (conteo[club] || 0) + 1;
  });

  const clubMasFrecuente = Object.entries(conteo).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];
  return clubMasFrecuente ? clubMasFrecuente[0] : clubes[0];
}

function mezclarLista(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function crearEquipoSimulacion(nombre) {
  return {
    nombre,
    escudo: obtenerEscudoClub(nombre),
    puntos: 0,
    pj: 0,
    pg: 0,
    pe: 0,
    pp: 0,
    gf: 0,
    ga: 0,
  };
}

function prepararFaseGrupos() {
  const clubPrincipal = obtenerClubPrincipalDelPlantel();
  const equiposModo = obtenerEquiposDelModo(state.objetivo || 'champions');
  const clubesDisponibles = equiposModo.length
    ? equiposModo.map(nombre => ({ nombre, escudo: obtenerEscudoEquipoDelModo(state.objetivo || 'champions', nombre) }))
    : EQUIPOS_DISPONIBLES;

  const clubBase = clubesDisponibles.find(item => normalizarTexto(item.nombre) === normalizarTexto(clubPrincipal))
    || { nombre: clubPrincipal, escudo: obtenerEscudoClub(clubPrincipal) };

  const pool = mezclarLista(
    clubesDisponibles.filter(item => normalizarTexto(item.nombre) !== normalizarTexto(clubBase.nombre))
  ).slice(0, 31).map(item => crearEquipoSimulacion(item.nombre));

  const equipos = [crearEquipoSimulacion(clubBase.nombre), ...pool];
  const grupos = [];
  for (let i = 0; i < 8; i++) {
    grupos.push({
      nombre: `Grupo ${String.fromCharCode(65 + i)}`,
      equipos: equipos.slice(i * 4, (i * 4) + 4),
    });
  }

  return { clubPrincipal: clubBase.nombre, grupos };
}

function ordenarGrupo(grupo) {
  return [...grupo].sort((a, b) => {
    if (b.puntos !== a.puntos) return b.puntos - a.puntos;
    if (b.gf - b.ga !== a.gf - a.ga) return (b.gf - b.ga) - (a.gf - a.ga);
    if (b.gf !== a.gf) return b.gf - a.gf;
    return a.nombre.localeCompare(b.nombre);
  });
}

function generarResultado() {
  const localGoles = Math.floor(Math.random() * 4);
  const visitanteGoles = Math.floor(Math.random() * 4);
  return { localGoles, visitanteGoles };
}

function ejecutarPartido(local, visitante) {
  const { localGoles, visitanteGoles } = generarResultado();

  local.pj += 1;
  visitante.pj += 1;
  local.gf += localGoles;
  local.ga += visitanteGoles;
  visitante.gf += visitanteGoles;
  visitante.ga += localGoles;

  if (localGoles > visitanteGoles) {
    local.puntos += 3;
    local.pg += 1;
    visitante.pp += 1;
  } else if (visitanteGoles > localGoles) {
    visitante.puntos += 3;
    visitante.pg += 1;
    local.pp += 1;
  } else {
    local.puntos += 1;
    visitante.puntos += 1;
    local.pe += 1;
    visitante.pe += 1;
  }

  return { local, visitante, localGoles, visitanteGoles };
}

function renderizarGrupos(contenedor, grupos, label) {
  if (!contenedor) return;

  const gruposHtml = grupos.map(grupo => {
    const equiposOrdenados = ordenarGrupo(grupo.equipos);
    const filas = equiposOrdenados.map(equipo => {
      const usuarioClass = equipo.nombre === obtenerClubPrincipalDelPlantel() ? ' usuario' : '';
      return `
        <div class="simulacion-equipo-row${usuarioClass}">
          <div class="simulacion-equipo-meta">
            <img src="${equipo.escudo}" alt="${equipo.nombre}" class="simulacion-escudo" />
            <span class="simulacion-equipo-nombre">${equipo.nombre}</span>
          </div>
          <span class="simulacion-stats">${equipo.pj}P ${equipo.gf}:${equipo.ga}</span>
          <span class="simulacion-puntos">${equipo.puntos}</span>
        </div>
      `;
    }).join('');

    return `
      <div class="simulacion-grupo">
        <div class="simulacion-grupo-header">
          <span>${grupo.nombre}</span>
          <span>${label}</span>
        </div>
        <div class="simulacion-grupo-body">${filas}</div>
      </div>
    `;
  }).join('');

  contenedor.innerHTML = `
    <div class="simulacion-fase">
      <div class="simulacion-fase-header">
        <h3>Fase de grupos</h3>
        <span>4 equipos por grupo · ida y vuelta</span>
      </div>
      <div class="simulacion-grupos">${gruposHtml}</div>
    </div>
  `;
}

function renderizarPartidos(contenedor, titulo, partidos, subtitulo = '') {
  const html = partidos.map(partido => `
    <div class="simulacion-partido">
      <div class="simulacion-partido-club local">
        <img src="${partido.local.escudo}" alt="${partido.local.nombre}" class="simulacion-escudo" />
        <span>${partido.local.nombre}</span>
      </div>
      <div class="simulacion-partido-score">${partido.golesLocal} - ${partido.golesVisitante}</div>
      <div class="simulacion-partido-club visitante">
        <span>${partido.visitante.nombre}</span>
        <img src="${partido.visitante.escudo}" alt="${partido.visitante.nombre}" class="simulacion-escudo" />
      </div>
    </div>
  `).join('');

  contenedor.innerHTML = `
    <div class="simulacion-fase">
      <div class="simulacion-fase-header">
        <h3>${titulo}</h3>
        <span>${subtitulo}</span>
      </div>
      <div class="simulacion-resultados">${html}</div>
    </div>
  `;
}

function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function jugarFaseGrupos(contenedor, grupos, equipoUsuario) {
  for (const grupo of grupos) {
    const combinaciones = [];
    for (let i = 0; i < grupo.equipos.length; i++) {
      for (let j = i + 1; j < grupo.equipos.length; j++) {
        combinaciones.push([grupo.equipos[i], grupo.equipos[j]]);
        combinaciones.push([grupo.equipos[j], grupo.equipos[i]]);
      }
    }

    for (const [local, visitante] of combinaciones) {
      const partido = ejecutarPartido(local, visitante);
      renderizarGrupos(contenedor, grupos, 'Fase de grupos');
      const resultadoHtml = `
        <div class="simulacion-fase">
          <div class="simulacion-fase-header">
            <h3>Fase de grupos</h3>
            <span>partido en curso</span>
          </div>
          <div class="simulacion-resultados">
            <div class="simulacion-partido">
              <div class="simulacion-partido-club local">
                <img src="${local.escudo}" alt="${local.nombre}" class="simulacion-escudo" />
                <span>${local.nombre}</span>
              </div>
              <div class="simulacion-partido-score">${partido.localGoles} - ${partido.visitanteGoles}</div>
              <div class="simulacion-partido-club visitante">
                <span>${visitante.nombre}</span>
                <img src="${visitante.escudo}" alt="${visitante.nombre}" class="simulacion-escudo" />
              </div>
            </div>
          </div>
        </div>
      `;
      contenedor.innerHTML = resultadoHtml;
      await esperar(900);

      if (local.nombre === equipoUsuario || visitante.nombre === equipoUsuario) {
        const equipoLocalEsUsuario = local.nombre === equipoUsuario;
        const ganaUsuario = (equipoLocalEsUsuario && partido.localGoles > partido.visitanteGoles)
          || (!equipoLocalEsUsuario && partido.visitanteGoles > partido.localGoles);
        if (!ganaUsuario && equipoLocalEsUsuario !== undefined) {
          // no-op intentionally left to allow continuation after group stage
        }
      }
    }
  }
}

function avanzarClasificados(grupos) {
  const clasificados = [];
  grupos.forEach(grupo => {
    const orden = ordenarGrupo(grupo.equipos);
    clasificados.push(orden[0], orden[1]);
  });
  return clasificados;
}

function generarLlave(location, visitante) {
  return { local: location, visitante };
}

function jugarEliminatoria(contenedor, titulo, equipos, equipoUsuario) {
  const partidos = [];
  for (let i = 0; i < equipos.length; i += 2) {
    const local = equipos[i];
    const visitante = equipos[i + 1];
    const ida = ejecutarPartido({ ...local }, { ...visitante });
    const vuelta = ejecutarPartido({ ...visitante }, { ...local });

    const golesLocal = ida.localGoles + vuelta.visitanteGoles;
    const golesVisitante = ida.visitanteGoles + vuelta.localGoles;
    const ganador = golesLocal === golesVisitante
      ? (Math.random() > 0.5 ? local : visitante)
      : (golesLocal > golesVisitante ? local : visitante);

    partidos.push({
      local,
      visitante,
      golesLocal: ida.localGoles,
      golesVisitante: ida.visitanteGoles,
      revanchaLocal: vuelta.localGoles,
      revanchaVisitante: vuelta.visitanteGoles,
      ganador,
      totalLocal: golesLocal,
      totalVisitante: golesVisitante,
    });

    renderizarPartidos(contenedor, titulo, [{
      local,
      visitante,
      golesLocal: ida.localGoles,
      golesVisitante: ida.visitanteGoles,
    }, {
      local: visitante,
      visitante: local,
      golesLocal: vuelta.localGoles,
      golesVisitante: vuelta.visitanteGoles,
    }], 'ida y vuelta');

    if (local.nombre === equipoUsuario || visitante.nombre === equipoUsuario) {
      if (ganador.nombre !== equipoUsuario) {
        return { eliminado: true, ganador: ganador.nombre };
      }
    }
  }

  return { eliminado: false, equipos: partidos.map(partido => partido.ganador) };
}

function iniciarSimulacionPorObjetivo() {
  const objetivo = state.objetivo || 'champions';
  if (objetivo === 'mundial') {
    return iniciarSimulacionChampions();
  }
  if (objetivo === 'libertadores') {
    return iniciarSimulacionChampions();
  }
  return iniciarSimulacionChampions();
}

async function iniciarSimulacionChampions() {
  const panel = uiDom.panelSimular;
  if (!panel) return;

  const configObjetivo = obtenerConfigObjetivo();
  const contenedor = document.createElement('div');
  contenedor.className = 'simulacion-champions';
  panel.innerHTML = `
    <section class="panel-section">
      <h2 class="panel-title">Simulación · ${configObjetivo.titulo}</h2>
      <div id="simulacion-champions-root"></div>
    </section>
  `;

  const root = document.getElementById('simulacion-champions-root');
  if (!root) return;

  const equipoUsuario = obtenerClubPrincipalDelPlantel();
  const { grupos } = prepararFaseGrupos();

  renderizarGrupos(root, grupos, 'Fase de grupos');
  await jugarFaseGrupos(root, grupos, equipoUsuario);

  const clasificados = avanzarClasificados(grupos);
  const octavos = [];
  for (let i = 0; i < clasificados.length; i += 2) {
    octavos.push(generarLlave(clasificados[i], clasificados[i + 1]));
  }

  const resultadoOctavos = jugarEliminatoria(root, 'Octavos de final', octavos.flatMap(llave => [llave.local, llave.visitante]), equipoUsuario);
  if (resultadoOctavos.eliminado) {
    root.innerHTML = `
      <div class="simulacion-fase">
        <div class="simulacion-fase-header">
          <h3>Eliminado</h3>
          <span>tu equipo no sigue adelante</span>
        </div>
        <div class="simulacion-estado-ganador">Tu equipo queda fuera de ${configObjetivo.titulo}.</div>
        <button class="simulacion-replay" id="reiniciar-simulacion">Jugar de nuevo</button>
      </div>
    `;
    document.getElementById('reiniciar-simulacion')?.addEventListener('click', () => {
      iniciarJuego();
      mostrarTab('inicio');
    });
    return;
  }

  const cuartos = resultadoOctavos.equipos;
  const resultadoCuartos = jugarEliminatoria(root, 'Cuartos de final', cuartos, equipoUsuario);
  if (resultadoCuartos.eliminado) {
    root.innerHTML = `
      <div class="simulacion-fase">
        <div class="simulacion-fase-header">
          <h3>Eliminado</h3>
          <span>tu equipo no sigue adelante</span>
        </div>
        <div class="simulacion-estado-ganador">Tu equipo queda eliminado en cuartos de final.</div>
        <button class="simulacion-replay" id="reiniciar-simulacion">Jugar de nuevo</button>
      </div>
    `;
    document.getElementById('reiniciar-simulacion')?.addEventListener('click', () => {
      iniciarJuego();
      mostrarTab('inicio');
    });
    return;
  }

  const semifinales = resultadoCuartos.equipos;
  const resultadoSemis = jugarEliminatoria(root, 'Semifinales', semifinales, equipoUsuario);
  if (resultadoSemis.eliminado) {
    root.innerHTML = `
      <div class="simulacion-fase">
        <div class="simulacion-fase-header">
          <h3>Eliminado</h3>
          <span>tu equipo no sigue adelante</span>
        </div>
        <div class="simulacion-estado-ganador">Tu equipo queda eliminado en semifinales.</div>
        <button class="simulacion-replay" id="reiniciar-simulacion">Jugar de nuevo</button>
      </div>
    `;
    document.getElementById('reiniciar-simulacion')?.addEventListener('click', () => {
      iniciarJuego();
      mostrarTab('inicio');
    });
    return;
  }

  const finalistas = resultadoSemis.equipos;
  const final = {
    local: finalistas[0],
    visitante: finalistas[1],
  };
  const resultadoFinal = ejecutarPartido(final.local, final.visitante);
  const ganador = resultadoFinal.localGoles === resultadoFinal.visitanteGoles
    ? (Math.random() > 0.5 ? final.local : final.visitante)
    : (resultadoFinal.localGoles > resultadoFinal.visitanteGoles ? final.local : final.visitante);

  renderizarPartidos(root, 'Final', [{
    local: final.local,
    visitante: final.visitante,
    golesLocal: resultadoFinal.localGoles,
    golesVisitante: resultadoFinal.visitanteGoles,
  }], 'partido único');

  root.insertAdjacentHTML('beforeend', `
    <div class="simulacion-estado-ganador">
      ${ganador.nombre} ${configObjetivo.ganador}
    </div>
    <button class="simulacion-replay" id="reiniciar-simulacion">Jugar de nuevo</button>
  `);

  document.getElementById('reiniciar-simulacion')?.addEventListener('click', () => {
    mostrarSelectorEquipo();
    mostrarTab('inicio');
  });
}
