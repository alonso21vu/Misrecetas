// Almacena recetas en localStorage
let recetas = JSON.parse(localStorage.getItem('recetas')) || [];

function mostrar(seccion) {
  document.querySelectorAll('section').forEach(sec => sec.classList.add('hidden'));
  document.getElementById(seccion).classList.remove('hidden');
  if (seccion === 'inicio') renderizarRecetas();
  if (seccion === 'crear') document.getElementById('mensaje-exito').classList.add('hidden');
}

function guardarReceta(index = null) {
  const nombre = document.getElementById('nombre').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();
  const ingredientes = document.getElementById('ingredientes').value.trim().split('\n');
  const pasos = document.getElementById('pasos').value.trim();
  const costo = parseFloat(document.getElementById('costo').value);
  const tipo = 'postre'; // Valor fijo ya que se eliminó el campo

  if (!nombre || !descripcion || !ingredientes.length || !pasos || isNaN(costo)) {
    alert('Por favor, completa todos los campos correctamente.');
    return;
  }

  const nuevaReceta = { nombre, descripcion, ingredientes, pasos, costo, tipo };

  if (index !== null) {
    recetas[index] = nuevaReceta;
  } else {
    recetas.push(nuevaReceta);
  }

  localStorage.setItem('recetas', JSON.stringify(recetas));

  document.getElementById('mensaje-exito').classList.remove('hidden');
  document.getElementById('nombre').value = '';
  document.getElementById('descripcion').value = '';
  document.getElementById('ingredientes').value = '';
  document.getElementById('pasos').value = '';
  document.getElementById('costo').value = '';

  // Restaurar botón Guardar
  const btnGuardar = document.querySelector('button[onclick^="guardarReceta"]');
  btnGuardar.setAttribute('onclick', 'guardarReceta()');
}

function renderizarRecetas(texto = '') {
  const contenedor = document.getElementById('lista-recetas');
  contenedor.innerHTML = '';

  const recetasFiltradas = recetas.filter(r =>
    r.nombre.toLowerCase().includes(texto.toLowerCase())
  );

  document.getElementById('sin-recetas').classList.toggle('hidden', recetasFiltradas.length > 0);

  recetasFiltradas.forEach((receta, index) => {
    const card = document.createElement('div');
    card.className = 'bg-white p-4 rounded shadow hover:shadow-md';
    card.innerHTML = `
      <h3 class="text-lg font-bold mb-2 cursor-pointer" onclick="verReceta(${index})">${receta.nombre}</h3>
      <p class="text-sm">${receta.descripcion}</p>
      <div class="mt-2 flex gap-2">
        <button onclick="editarReceta(${index})" class="text-blue-500 text-sm">Editar</button>
        <button onclick="eliminarReceta(${index})" class="text-red-500 text-sm">Eliminar</button>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

function verReceta(index) {
  const r = recetas[index];
  document.getElementById('ver-nombre').textContent = r.nombre;
  document.getElementById('ver-descripcion').textContent = r.descripcion;
  document.getElementById('ver-ingredientes').innerHTML = r.ingredientes.map(i => `<li>${i}</li>`).join('');
  document.getElementById('ver-pasos').textContent = r.pasos;
  document.getElementById('ver-costo').textContent = r.costo.toFixed(2);
  document.getElementById('ver-precio').textContent = (r.costo * 1.5).toFixed(2);
  mostrar('ver');
}

function editarReceta(index) {
  const r = recetas[index];
  document.getElementById('nombre').value = r.nombre;
  document.getElementById('descripcion').value = r.descripcion;
  document.getElementById('ingredientes').value = r.ingredientes.join('\n');
  document.getElementById('pasos').value = r.pasos;
  document.getElementById('costo').value = r.costo;

  mostrar('crear');

  const btnGuardar = document.querySelector('button[onclick^="guardarReceta"]');
  btnGuardar.setAttribute('onclick', `guardarReceta(${index})`);
}

function eliminarReceta(index) {
  if (confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
    recetas.splice(index, 1);
    localStorage.setItem('recetas', JSON.stringify(recetas));
    renderizarRecetas();
  }
}

document.getElementById('buscar').addEventListener('input', (e) => {
  const texto = e.target.value;
  renderizarRecetas(texto);
});

renderizarRecetas();
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(() => {
      console.log('Service Worker registrado correctamente');
    }).catch(err => {
      console.error('Error al registrar Service Worker:', err);
    });
  });
}
