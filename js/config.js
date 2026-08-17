/* ============================================
   CONFIG - Subasta Futbolera
   ============================================ */

const CONFIG = {
  PRESUPUESTO_INICIAL: 1000,
  SALTOS_MAXIMOS: 4,
  CANDIDATOS_POR_POSICION: 5,

  // Rango base de precio random en millones
  PRECIO_MIN: 5,
  PRECIO_MAX: 150,

  // Multiplica el precio según el tier del jugador (leyenda cuesta más, en promedio)
  MULTIPLICADOR_TIER: {
    Actual: 1,
    Retirado: 1.25,
    Leyenda: 2,
  },

  // Redondea el precio final a múltiplos de 5M
  REDONDEO_PRECIO: 5,
};

/*
  Mapeo de cada slot de la formación a la posición de tu base de datos.

  "pool" tiene que matchear EXACTAMENTE una clave del objeto DEMO_PLAYERS
  (definido en js/data/index.js): Arquero, LateralDerecho, CentralDerecho,
  CentralIzquierdo, LateralIzquierdo, MediocampistaIzquierdo, MediocampistaC,
  MediocampistaD, ExtremoDerecho, ExtremoIzquierdo, DelanteroC.
*/
const POSICIONES = [
  { id: 'arquero',                  nombre: 'Arquero',                pool: 'Arquero' },
  { id: 'lateral-izquierdo',        nombre: 'Lateral Izq',             pool: 'LateralIzquierdo' },
  { id: 'central-izquierdo',        nombre: 'Central Izq',             pool: 'CentralIzquierdo' },
  { id: 'central-derecho',          nombre: 'Central Der',             pool: 'CentralDerecho' },
  { id: 'lateral-derecho',          nombre: 'Lateral Der',             pool: 'LateralDerecho' },
  { id: 'mediocampista-izquierdo',  nombre: 'Mediocampista Izq',       pool: 'MediocampistaIzquierdo' },
  { id: 'mediocampista-centro',     nombre: 'Mediocampista Centro',    pool: 'MediocampistaC' },
  { id: 'mediocampista-derecho',    nombre: 'Mediocampista Der',       pool: 'MediocampistaD' },
  { id: 'extremo-izquierdo',        nombre: 'Extremo Izq',             pool: 'ExtremoIzquierdo' },
  { id: 'extremo-derecho',          nombre: 'Extremo Der',             pool: 'ExtremoDerecho' },
  { id: 'delantero-centro',         nombre: 'Delantero Centro',        pool: 'DelanteroC' },
];