console.log('ADMIN JS CARGADO');

document.addEventListener('DOMContentLoaded', () => {

  console.log('ADMIN JS CARGADO - INICIO');

  /*
  =================================
        PROTECCION DE RUTA
  =================================
  */
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const btnCerrar = document.getElementById('btnCerrar');

  if (!token || userRole !== 'admin') {
    window.location.replace('index.html');
  }

  if (btnCerrar) {
    btnCerrar.addEventListener('click', (e) => {
      e.preventDefault();

      console.log('CERRANDO SESIÓN');

      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user'); 

      window.location.replace('index.html');
    });
  }
  /*
  =================================
  =================================
  */

  const API_URL = 'http://localhost:3000';

  const listaProductos = document.getElementById('lista-productos');
  const formProducto = document.getElementById('form-producto');
  const nombreInput = document.getElementById('nombre');
  const precioInput = document.getElementById('precio');
  const stockInput = document.getElementById('stock');
  /* 
  ================
        MODAL
  ================
  */
  const modal = document.getElementById('modal');
  const mensajeModal = document.getElementById('mensajeModal');
  const contenidoModal = document.getElementById('contenidoModal');
  const cerrarModalBtn = document.getElementById('cerrarModal');

  function abrirModal(titulo, contenidoHTML = '') {
    mensajeModal.textContent = titulo;
    contenidoModal.innerHTML = contenidoHTML;
    modal.style.display = 'flex';
  }

  function cerrarModal() {
    modal.style.display = 'none';
    contenidoModal.innerHTML = '';
  }

  cerrarModalBtn.addEventListener('click', cerrarModal);
  window.addEventListener('click', e => {
    if (e.target === modal) cerrarModal();
  });

  /* 
  ==========================
      CARGAR PRODUCTOS
  ==========================
  */
  async function cargarProductos() {
    const res = await fetch(`${API_URL}/productos`,{
      headers: authHeaders(),
    });
    const productos = await res.json();

    listaProductos.innerHTML = '';

    productos.forEach(p => {
      const li = document.createElement('li');

      li.innerHTML = `
        <span>${p.nombre}</span>
        <span>$${p.precio}</span>
        <span>${p.stock}</span>
        <span class="acciones">
          <button class="btn-editar">Editar</button>
          <button class="btn-eliminar">Eliminar</button>
        </span>
      `;

      li.querySelector('.btn-editar')
        .addEventListener('click', () => editarProducto(p));

      li.querySelector('.btn-eliminar')
        .addEventListener('click', () => confirmarEliminar(p.id, p.nombre));

      listaProductos.appendChild(li);
    });
  }

  /* 
  =======================
     AGREGAR PRODUCTO
  =======================
  */
  formProducto.addEventListener('submit', async e => {
    e.preventDefault();

    await fetch(`${API_URL}/productos`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        nombre: nombreInput.value,
        precio: Number(precioInput.value),
        stock: Number(stockInput.value),
      }),
    });

    formProducto.reset();
    cargarProductos();
  });

  /* 
  =========================
     ELIMINAR PRODUCTO
  =========================
  */
  function confirmarEliminar(id, nombre) {
    abrirModal(
      '',
      `
        <p>¿Eliminar <strong>${nombre}</strong>?</p>
        <button id="confirmarEliminar">Eliminar</button>
        <button id="cancelarEliminar">Cancelar</button>
      `
    );

    document.getElementById('confirmarEliminar').onclick = async () => {
      await fetch(`${API_URL}/productos/${id}`, { 
        method: 'DELETE',
        headers: authHeaders(),
      });
      cerrarModal();
      cargarProductos();
    };

    document.getElementById('cancelarEliminar').onclick = cerrarModal;
  }

  /* 
  ========================
      EDITAR PRODUCTO
  ========================
  */
  function editarProducto(p) {
    abrirModal(
      'Editar producto',
      `
        <label>Nombre</label>
        <input id="editNombre" value="${p.nombre}">

        <label>Precio</label>
        <input id="editPrecio" type="number" value="${p.precio}">

        <label>Stock</label>
        <input id="editStock" type="number" value="${p.stock}">

        <br><br>
        <button id="guardar">Guardar</button>
        <button id="cancelar">Cancelar</button>
      `
    );

    document.getElementById('guardar').onclick = async () => {
      await fetch(`${API_URL}/productos/${p.id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          nombre: document.getElementById('editNombre').value,
          precio: Number(document.getElementById('editPrecio').value),
          stock: Number(document.getElementById('editStock').value),
        }),
      });

      cerrarModal();
      cargarProductos();
    };

    document.getElementById('cancelar').onclick = cerrarModal;
  }

  /* 
  ================
      REPORTES
  ================
  */

  function authHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async function cargarDashboard() {
    const headers = authHeaders();

    // VENTAS TOTALES (dia-semana-mes)
    const vDia = await fetch(`${API_URL}/reportes/ventas-dia`, { headers }).then(r => r.json());
    const vSemana = await fetch(`${API_URL}/reportes/ventas-semana`, { headers }).then(r => r.json());
    const vMes = await fetch(`${API_URL}/reportes/ventas-mes`, { headers }).then(r => r.json());

    document.getElementById('ventas-dia').textContent = `$${vDia.total}`;
    document.getElementById('ventas-semana').textContent = `$${vSemana.total}`;
    document.getElementById('ventas-mes').textContent = `$${vMes.total}`;

    // PRODUCTO MAS VENDIDO (dia-semana-mes)
    const pDia = await fetch(`${API_URL}/reportes/producto-mas-vendido-dia`, { headers }).then(r => r.json());
    const pSemana = await fetch(`${API_URL}/reportes/producto-mas-vendido-semana`, { headers }).then(r => r.json());
    const pMes = await fetch(`${API_URL}/reportes/producto-mas-vendido-mes`, { headers }).then(r => r.json());

    document.getElementById('prod-dia').textContent = pDia.nombre;
    document.getElementById('prod-semana').textContent = pSemana.nombre;
    document.getElementById('prod-mes').textContent = pMes.nombre;
  }

  cargarDashboard();

  /* 
  ===================
        INICIAR
  ===================
  */
  cargarProductos();
});
