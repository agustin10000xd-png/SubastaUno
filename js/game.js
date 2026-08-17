/* ============================================
   GAME - orquesta el flujo de la subasta
   ============================================ */

let procesando = false; // evita doble click mientras se anima una revelación

function iniciarJuego() {
  reiniciarState();
  procesando = false;
  renderPlantelInicial();
  renderFormacionTab();
  cargarPosicionEnPantalla(0);
  actualizarHeader();
  ocultarModalFinal();
  mostrarTab('inicio');
}

function cargarPosicionEnPantalla(index) {
  cargarPosicion(index);
  actualizarNombrePosicion();

  if (state.candidatos.length === 0) {
    // No hay candidatos para esta posición (pool vacío): la saltamos directo
    console.warn(`Sin candidatos para "${posicionActual().nombre}", pasando a la siguiente.`);
    avanzarAPosicionSiguiente();
    return;
  }

  renderCartaSilueta();
  animarEntradaCarta();
  actualizarBotones();
}

// ---- Comprar: revela al jugador, lo deja fijo en el plantel y avanza ----
function manejarComprar() {
  if (procesando || !puedeComprar() || state.juegoTerminado) return;
  procesando = true;
  uiDom.btnComprar.disabled = true;
  uiDom.btnSaltear.disabled = true;

  const jugador = jugadorActual();
  comprarJugadorActual();

  revelarJugador(jugador);
  actualizarSlotPlantel(posicionActual().id, jugador);
  renderFormacionTab();
  actualizarHeader();

  // Esperamos que se vea la revelación antes de pasar a la siguiente posición
  setTimeout(() => {
    procesando = false;
    avanzarAPosicionSiguiente();
  }, 1600);
}

// ---- Saltear: revela quién era (sin comprarlo) y recién ahí pasa al
//      siguiente candidato con una silueta nueva ----
function manejarSaltear() {
  if (procesando || !puedeSaltear() || state.juegoTerminado) return;
  procesando = true;
  uiDom.btnComprar.disabled = true;
  uiDom.btnSaltear.disabled = true;

  const jugador = jugadorActual();
  const indexAnterior = state.candidatoIndex;

  revelarJugador(jugador);
  marcarDotRecienUsado(indexAnterior);

  // Deja un momento la revelación en pantalla antes de pasar al siguiente
  setTimeout(() => {
    animarSalteo(() => {
      saltearCandidatoActual();
      renderCartaSilueta();
      actualizarHeader();
      actualizarBotones();
      procesando = false;
    });
  }, 900);
}

function avanzarAPosicionSiguiente() {
  if (hayPosicionSiguiente()) {
    cargarPosicionEnPantalla(state.posicionIndex + 1);
  } else {
    terminarJuego();
  }
}

function terminarJuego() {
  state.juegoTerminado = true;
  ocultarModalFinal();
  mostrarTab('simular');
  iniciarSimulacionChampions();
}