console.log('ADMIN JS CARGADO');

document.addEventListener('DOMContentLoaded', () => {

  const API_URL = 'http://localhost:3000';

  const listaProductos = document.getElementById('lista-productos');
  const formProducto = document.getElementById('form-producto');
  const nombreInput = document.getElementById('nombre');
  const precioInput = document.getElementById('precio');
  const stockInput = document.getElementById('stock');

  const btnVentasTotales = document.getElementById('btn-ventas-totales');
  const btnProductoMasVendido = document.getElementById('btn-producto-mas-vendido');

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
    const res = await fetch(`${API_URL}/productos`);
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
      headers: { 'Content-Type': 'application/json' },
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
      await fetch(`${API_URL}/productos/${id}`, { method: 'DELETE' });
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
        headers: { 'Content-Type': 'application/json' },
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
  btnVentasTotales.addEventListener('click', async () => {
    const res = await fetch(`${API_URL}/reportes/ventas-totales`);
    const data = await res.json();

    abrirModal(
      'Ventas totales',
      `<p><strong>Total vendido:</strong> $${data.total}</p>`
    );
  });

  btnProductoMasVendido.addEventListener('click', async () => {
    const res = await fetch(`${API_URL}/reportes/producto-mas-vendido`);
    const data = await res.json();

    abrirModal(
      'Producto más vendido',
      `
        <p><strong>${data.nombre}</strong></p>
        <p>Cantidad vendida: <strong>${data.cantidad}</strong></p>
      `
    );
  });

  /* 
  ===================
        INICIAR
  ===================
  */
  cargarProductos();
});
