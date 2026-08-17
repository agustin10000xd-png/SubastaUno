/* ============================================
   MAIN - punto de entrada
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  cachearDom();
  cachearUiDom();

  document.querySelectorAll('.sidebar-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.dataset.tab === 'simular') {
        if (!formacionCompleta()) {
          return;
        }
        iniciarSimulacionPorObjetivo();
      }
      mostrarTab(tab.dataset.tab);
    });
  });

  document.getElementById('btn-comprar').addEventListener('click', manejarComprar);
  document.getElementById('btn-saltear').addEventListener('click', manejarSaltear);
  document.getElementById('btn-reiniciar').addEventListener('click', () => {
    mostrarSelectorEquipo();
  });
  document.getElementById('btn-comenzar-subasta').addEventListener('click', () => {
    if (!state.equipoSeleccionado) return;
    ocultarSelectorEquipo();
    iniciarJuego();
    mostrarTab('inicio');
  });

  mostrarSelectorEquipo();
  mostrarTab('inicio');
});