console.log('APP JS CARGADO');

document.addEventListener('DOMContentLoaded', () => {

  const API_URL = 'http://localhost:3000';

  const listaProductos = document.getElementById('lista-productos');
  const listaOrden = document.getElementById('lista-orden');
  const totalSpan = document.getElementById('total');
  const pagoInput = document.getElementById('pago');
  const cambioSpan = document.getElementById('cambio');
  const btnConfirmar = document.getElementById('confirmar');

  /* 
  ===================
         MODAL
  ===================
   */
  const modal = document.getElementById('modal');
  const mensajeModal = document.getElementById('mensajeModal');
  const contenidoModal = document.getElementById('contenidoModal');
  const cerrarModal = document.getElementById('cerrarModal');

  function abrirModal(mensaje, contenidoHTML = '') {
    mensajeModal.textContent = mensaje;
    contenidoModal.innerHTML = contenidoHTML;
    modal.style.display = 'flex';
  }

  function cerrarModalFn() {
    modal.style.display = 'none';
  }

  cerrarModal.addEventListener('click', cerrarModalFn);

  window.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModalFn();
  });

  if (!btnConfirmar) {
    console.error('No se encontró el botón confirmar');
    return;
  }

  let productos = [];
  let carrito = [];

  /* =============================
     CARGAR PRODUCTOS
  ============================= */
  async function cargarProductos() {
    const res = await fetch(`${API_URL}/productos/disponibles`);
    productos = await res.json();
    renderProductos();
  }

  function renderProductos() {
    listaProductos.innerHTML = '';

    productos.forEach(p => {
      const li = document.createElement('li');

      li.innerHTML = `
        <span><strong>${p.nombre}</strong></span>
        <span>$${p.precio}</span>
        <span>${p.stock}</span>
        <span>
          <button ${p.stock === 0 ? 'disabled' : ''}>Agregar</button>
        </span>
      `;

      li.querySelector('button')
        .addEventListener('click', () => agregarProducto(p.id));

      listaProductos.appendChild(li);
    });
  }

  /* 
  ====================
        CARRITO
  ==================== 
  */
  function agregarProducto(id) {
    const producto = productos.find(p => p.id === id);
    const item = carrito.find(i => i.id === id);

    if (item) {
      if (item.cantidad < producto.stock) item.cantidad++;
    } else {
      carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
      });
    }

    procesoOrden();
  }

  function quitarProducto(id) {
    const item = carrito.find(i => i.id === id);
    if (!item) return;

    item.cantidad--;

    if (item.cantidad === 0) {
      carrito = carrito.filter(i => i.id !== id);
    }

    procesoOrden();
  }

  /* 
  =================
        ORDEN
  ================= 
  */
  function procesoOrden() {
    listaOrden.innerHTML = '';
    let total = 0;

    carrito.forEach(item => {
      total += item.precio * item.cantidad;

      const li = document.createElement('li');
      li.innerHTML = `
        ${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}
        <button>-</button>
      `;

      li.querySelector('button')
        .addEventListener('click', () => quitarProducto(item.id));

      listaOrden.appendChild(li);
    });

    totalSpan.textContent = total;
    calcularCambio();
  }

  /* 
  ================
        PAGO
  ================ 
  */
  function calcularCambio() {
    const total = Number(totalSpan.textContent);
    const pago = Number(pagoInput.value);

    cambioSpan.textContent = pago >= total ? pago - total : 0;

    if (pagoInput.value === '') {
      pagoInput.style.color = ''; 
    } else if (pago < total) {
      pagoInput.style.color = 'red';
    } else {
      pagoInput.style.color = 'green';
    }
  }

  pagoInput.addEventListener('input', calcularCambio);

  /* 
  =========================
      CONFIRMAR VENTA
  =========================
  */
  btnConfirmar.addEventListener('click', async () => {
    const total = Number(totalSpan.textContent);
    const pago = Number(pagoInput.value);

    if (carrito.length === 0) {
      abrirModal('❌ No hay productos en la orden');
      return;
    }

    if (pago < total) {
      abrirModal('❌ Pago insuficiente');
      return;
    }

    await fetch(`${API_URL}/ventas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cliente: 'Mostrador',
        productos: carrito.map(i => ({
          productoId: i.id,
          cantidad: i.cantidad,
        })),
      }),
    });

    carrito = [];
    pagoInput.value = '';
    pagoInput.style.color = '';
    cambioSpan.textContent = 0;

    await cargarProductos();
    procesoOrden();

    abrirModal('✅ Venta registrada correctamente');
  });

  /* 
  ==============
     INICIAR
  ==============
   */
  cargarProductos();
});
