/* ============================================
   STATE - Subasta Futbolera
   (No toca el DOM. Solo maneja los datos del juego)
   ============================================ */

const state = {
  presupuesto: CONFIG.PRESUPUESTO_INICIAL,
  saltosRestantes: CONFIG.SALTOS_MAXIMOS,
  equipoSeleccionado: null,
  objetivo: null,

  posicionIndex: 0,        // índice actual dentro de POSICIONES
  candidatos: [],          // los 5 jugadores random de la posición actual
  candidatoIndex: 0,       // cuál de esos 5 se está mostrando ahora

  precioActual: 0,

  usadosGlobal: new Set(), // ids de jugadores ya usados en TODA la partida (no se repiten)
  plantel: {},             // { posicionId: { jugador, precio } }

  juegoTerminado: false,
};

function reiniciarState() {
  state.presupuesto = CONFIG.PRESUPUESTO_INICIAL;
  state.saltosRestantes = CONFIG.SALTOS_MAXIMOS;
  state.posicionIndex = 0;
  state.candidatos = [];
  state.candidatoIndex = 0;
  state.precioActual = 0;
  state.usadosGlobal = new Set();
  state.plantel = {};
  state.juegoTerminado = false;
}

function reiniciarSaltosPosicion() {
  state.saltosRestantes = CONFIG.SALTOS_MAXIMOS;
}

function posicionActual() {
  return POSICIONES[state.posicionIndex];
}

function jugadorActual() {
  return state.candidatos[state.candidatoIndex] || null;
}

function hayPosicionSiguiente() {
  return state.posicionIndex < POSICIONES.length - 1;
}

function quedanCandidatos() {
  return state.candidatoIndex < state.candidatos.length - 1;
}

function formacionCompleta() {
  return Object.keys(state.plantel).length >= POSICIONES.length;
}

/* ---------- Generación de candidatos ---------- */

function mezclar(array) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Arma el pool de 5 candidatos para la posición dada, sin repetir jugadores
// ya usados en la partida.
function generarCandidatos(posicion) {
  const poolCompleto = (typeof DEMO_PLAYERS !== 'undefined' && DEMO_PLAYERS[posicion.pool]) || [];
  const disponibles = poolCompleto.filter(j => !state.usadosGlobal.has(j.id));

  if (disponibles.length === 0) {
    console.warn(`No hay jugadores disponibles para "${posicion.nombre}" (pool: ${posicion.pool}).`);
    return [];
  }

  const mezclados = mezclar(disponibles);
  return mezclados.slice(0, Math.min(CONFIG.CANDIDATOS_POR_POSICION, mezclados.length));
}

/* ---------- Precio random ---------- */

function generarPrecio(jugador) {
  const rango = (CONFIG.PRECIO_MAX - CONFIG.PRECIO_MIN) / CONFIG.REDONDEO_PRECIO;
  const baseAleatorio = Math.floor(Math.random() * (rango + 1)) * CONFIG.REDONDEO_PRECIO;
  const base = CONFIG.PRECIO_MIN + baseAleatorio;
  const mult = CONFIG.MULTIPLICADOR_TIER[jugador.tipo] || 1;
  const factorRating = jugador.rat ? 1 + (jugador.rat / 100) * 0.4 : 1;

  let precio = base * mult * factorRating;
  precio = Math.round(precio / CONFIG.REDONDEO_PRECIO) * CONFIG.REDONDEO_PRECIO;

  if (precio < CONFIG.PRECIO_MIN) precio = CONFIG.PRECIO_MIN;
  if (precio > CONFIG.PRECIO_MAX) precio = CONFIG.PRECIO_MAX;

  return precio;
}

/* ---------- Acciones sobre el estado ---------- */

function cargarPosicion(index) {
  state.posicionIndex = index;
  state.candidatoIndex = 0;
  state.saltosRestantes = CONFIG.SALTOS_MAXIMOS;
  state.candidatos = generarCandidatos(POSICIONES[index]);

  const jugador = jugadorActual();
  state.precioActual = jugador ? generarPrecio(jugador) : 0;
}

function puedeComprar() {
  const jugador = jugadorActual();
  return jugador && state.presupuesto >= state.precioActual;
}

function comprarJugadorActual() {
  const jugador = jugadorActual();
  if (!jugador) return false;

  state.presupuesto -= state.precioActual;
  state.usadosGlobal.add(jugador.id);
  state.plantel[posicionActual().id] = {
    jugador,
    precio: state.precioActual,
  };
  return true;
}

function puedeSaltear() {
  return state.saltosRestantes > 0 && quedanCandidatos();
}

function saltearCandidatoActual() {
  if (!puedeSaltear()) return false;

  state.saltosRestantes -= 1;
  state.candidatoIndex += 1;

  const jugador = jugadorActual();
  state.precioActual = jugador ? generarPrecio(jugador) : 0;
  return true;
}