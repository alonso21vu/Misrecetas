// Mostrar secciones
function mostrar(seccion) {
  document.getElementById('inicio').classList.add('hidden');
  document.getElementById('crear').classList.add('hidden');
  document.getElementById('ver').classList.add('hidden');
  document.getElementById(seccion).classList.remove('hidden');

  if (seccion === 'inicio') {
    cargarRecetas();
  }
}

// Guardar receta en localStorage
function guardarReceta() {
  const nombre = document.getElementById('nombre').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();
  const ingredientes = document.getElementById('ingredientes').value.trim().split('\n');
  const pasos = document.getElementById('pasos').value.trim();
  const costo = parseFloat(document.getElementById('costo').value.trim());

  if (!nombre || !descripcion || ingredientes.length === 0 || !pasos || isNaN(costo)) {
    alert('Por favor, completa todos los campos correctamente.');
    return;
  }

  const receta = {
    id: Date.now(),
    nombre,
    descripcion,
    ingredientes,
    pasos,
    costo,
    precio: (costo * 1.5).toFixed(2)
  };

  const recetas = JSON.parse(localStorage.getItem('recetas') || '[]');
  recetas.push(receta);
  localStorage.setItem('recetas', JSON.stringify(recetas));

  document.getElementById('mensaje-exito').classList.remove('hidden');
  setTimeout(() => {
    document.getElementById('mensaje-exito').classList.add('hidden');
  }, 2000);

  limpiarFormulario();
  mostrar('inicio');
}

// Cargar recetas en la lista
function cargarRecetas() {
  const recetas = JSON.parse(localStorage.getItem('recetas') || '[]');
  const lista = document.getElementById('lista-recetas');
  const sinRecetas = document.getElementById('sin-recetas');

  lista.innerHTML = '';

  if (recetas.length === 0) {
    sinRecetas.classList.remove('hidden');
    return;
  }

  sinRecetas.classList.add('hidden');

  recetas.forEach(receta => {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'bg-white rounded p-4 shadow hover:shadow-md transition cursor-pointer';
    tarjeta.innerHTML = `
      <h3 class="text-lg font-bold">${receta.nombre}</h3>
      <p class="text-sm text-gray-500">${receta.descripcion}</p>
    `;
    tarjeta.onclick = () => verReceta(receta.id);
    lista.appendChild(tarjeta);
  });
}

// Ver receta completa
function verReceta(id) {
  const recetas = JSON.parse(localStorage.getItem('recetas') || '[]');
  const receta = recetas.find(r => r.id === id);

  if (!receta) return;

  document.getElementById('ver-nombre').textContent = receta.nombre;
  document.getElementById('ver-descripcion').textContent = receta.descripcion;
  document.getElementById('ver-ingredientes').innerHTML = receta.ingredientes
    .map(i => `<li>${i}</li>`)
    .join('');
  document.getElementById('ver-pasos').textContent = receta.pasos;
  document.getElementById('ver-costo').textContent = receta.costo.toFixed(2);
  document.getElementById('ver-precio').textContent = receta.precio;

  mostrar('ver');
}

// Limpiar formulario
function limpiarFormulario() {
  document.getElementById('nombre').value = '';
  document.getElementById('descripcion').value = '';
  document.getElementById('ingredientes').value = '';
  document.getElementById('pasos').value = '';
  document.getElementById('costo').value = '';
}

// Buscar recetas
document.getElementById('buscar').addEventListener('input', function () {
  const query = this.value.toLowerCase();
  const recetas = JSON.parse(localStorage.getItem('recetas') || '[]');
  const resultados = recetas.filter(r => r.nombre.toLowerCase().includes(query));
  const lista = document.getElementById('lista-recetas');
  const sinRecetas = document.getElementById('sin-recetas');

  lista.innerHTML = '';

  if (resultados.length === 0) {
    sinRecetas.classList.remove('hidden');
    return;
  }

  sinRecetas.classList.add('hidden');

  resultados.forEach(receta => {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'bg-white rounded p-4 shadow hover:shadow-md transition cursor-pointer';
    tarjeta.innerHTML = `
      <h3 class="text-lg font-bold">${receta.nombre}</h3>
      <p class="text-sm text-gray-500">${receta.descripcion}</p>
    `;
    tarjeta.onclick = () => verReceta(receta.id);
    lista.appendChild(tarjeta);
  });
});

// Mostrar la sección de inicio al cargar
document.addEventListener('DOMContentLoaded', () => {
  mostrar('inicio');
});
