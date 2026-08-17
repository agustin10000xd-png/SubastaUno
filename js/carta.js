/* ============================================
   CARTA - render y animaciones de la carta
   ============================================ */

const dom = {
  cartaWrapper: null,
  carta: null,
  siluetaImg: null,
  jugadorFoto: null,
  jugadorBandera: null,
  jugadorNombre: null,
  jugadorClub: null,
  jugadorTipoBadge: null,
  precioValor: null,
  candidatosIndicador: null,
};

function cachearDom() {
  dom.cartaWrapper = document.querySelector('.carta-wrapper');
  dom.carta = document.getElementById('carta');
  dom.siluetaImg = document.getElementById('silueta-img');
  dom.jugadorFoto = document.getElementById('jugador-foto');
  dom.jugadorBandera = document.getElementById('jugador-bandera');
  dom.jugadorNombre = document.getElementById('jugador-nombre');
  dom.jugadorClub = document.getElementById('jugador-club');
  dom.jugadorTipoBadge = document.getElementById('jugador-tipo-badge');
  dom.precioValor = document.getElementById('precio-actual');
  dom.candidatosIndicador = document.getElementById('candidatos-indicador');
}

// Convierte "Actual" | "Retirado" | "Leyenda" -> "actual" | "retirado" | "leyenda"
function tipoAAtributo(tipo) {
  return (tipo || 'actual').toLowerCase();
}

// Devuelve la URL de la bandera de un país. Ajustá la carpeta si tenés
// las banderas guardadas en otro lado.
function urlBandera(nat) {
  return `Imagenes/Banderas/${nat}.png`;
}

function formatearPrecio(valor) {
  return `${Math.round(valor).toLocaleString('es-AR')}M`;
}

// Pinta la carta con el candidato actual, en estado SILUETA (sin revelar).
function renderCartaSilueta() {
  const jugador = jugadorActual();
  if (!jugador) return;

  dom.carta.dataset.tipo = tipoAAtributo(jugador.tipo);
  dom.carta.dataset.revelado = 'false';
  dom.carta.classList.remove('revelando');

  dom.siluetaImg.src = jugador.photo;
  dom.siluetaImg.alt = '';

  actualizarPrecio(state.precioActual);
  renderCandidatosDots();
}

// Anima la entrada de una carta nueva (al cambiar de posición o de candidato)
function animarEntradaCarta() {
  dom.cartaWrapper.classList.remove('entrando');
  void dom.cartaWrapper.offsetWidth; // forzamos reflow para re-disparar la animación
  dom.cartaWrapper.classList.add('entrando');
}

// Anima la salida de la carta (usado al pasar al siguiente candidato tras
// saltear), y al terminar ejecuta el callback.
function animarSalteo(callback) {
  dom.cartaWrapper.classList.add('saltando');
  setTimeout(() => {
    dom.cartaWrapper.classList.remove('saltando');
    callback();
    animarEntradaCarta();
  }, 300);
}

// Revela al jugador actual: llena nombre/club/bandera/foto y dispara el flash.
// Se usa tanto al COMPRAR como al SALTEAR (en ambos casos se ve quién era).
function revelarJugador(jugador) {
  dom.jugadorFoto.src = jugador.photo;
  dom.jugadorFoto.alt = jugador.name;
  dom.jugadorBandera.src = urlBandera(jugador.nat);
  dom.jugadorBandera.alt = jugador.nat;
  dom.jugadorNombre.textContent = jugador.name;
  dom.jugadorClub.textContent = jugador.club;
  dom.jugadorTipoBadge.textContent = jugador.tipo;

  dom.carta.classList.add('revelando');
  dom.carta.dataset.revelado = 'true';

  setTimeout(() => dom.carta.classList.remove('revelando'), 700);
}

// Actualiza el número de precio con un pequeño efecto de "tick"
function actualizarPrecio(valor) {
  dom.precioValor.textContent = formatearPrecio(valor);
  dom.precioValor.classList.remove('tick');
  void dom.precioValor.offsetWidth;
  dom.precioValor.classList.add('tick');
}

// Dibuja los puntitos de candidatos (5), marcando activo/usado
function renderCandidatosDots() {
  const dots = dom.candidatosIndicador.querySelectorAll('.candidato-dot');
  dots.forEach((dot, i) => {
    dot.classList.remove('activo', 'usado', 'recien-usado');
    if (i < state.candidatoIndex) {
      dot.classList.add('usado');
    } else if (i === state.candidatoIndex) {
      dot.classList.add('activo');
    }
  });
}

function marcarDotRecienUsado(index) {
  const dots = dom.candidatosIndicador.querySelectorAll('.candidato-dot');
  const dot = dots[index];
  if (!dot) return;
  dot.classList.add('recien-usado');
  setTimeout(() => dot.classList.remove('recien-usado'), 400);
}