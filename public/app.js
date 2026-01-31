console.log('APP JS CARGADO');

document.addEventListener('DOMContentLoaded', () => {
  
  /*
  =================================
        VERIFICACION DE ROLES
  =================================
  */
  console.log('APP JS CARGADO');

  const API_URL = 'http://localhost:3000';
  let modalEsLogin = false; 
  const modal = document.getElementById('modal');
  const token = localStorage.getItem('token');
   modal.style.backgroundColor = "black";

  if (token) {
    console.log('SESION EXISTENTE');
    modalEsLogin = false;
    modal.style.display = 'none';
    iniciarApp();
  } else {
    console.log('SESION NO INICIADA')
    controlarUI();
    mostrarLogin();
  }
  /*
  =================================
  =================================
  */

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

  const mensajeModal = document.getElementById('mensajeModal');
  const contenidoModal = document.getElementById('contenidoModal');
  const cerrarModal = document.getElementById('cerrarModal');

  function abrirModal(mensaje, contenidoHTML = '') {
    mensajeModal.textContent = mensaje;
    contenidoModal.innerHTML = contenidoHTML;
    modal.style.display = 'flex';
    modal.style.backgroundColor = "rgba(0,0,0,0.5)";
  }

  function cerrarModalFn() {
    modal.style.display = 'none';
  }

  cerrarModal.addEventListener('click', cerrarModalFn);

  window.addEventListener('click', (e) => {
    if (e.target === modal && !modalEsLogin) cerrarModalFn();
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
    console.log(productos); 
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
      abrirModal(' No hay productos en la orden');
      return;
    }

    if (pago < total) {
      abrirModal(' Pago insuficiente');
      return;
    }

    await fetch(`${API_URL}/ventas`, {
      method: 'POST',
      headers: authHeaders(),
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

    abrirModal(' Venta registrada correctamente');
  });

  /* 
  ===================
        MOSTRAR LOGIN
  ===================
  */
  function mostrarLogin() {

    console.log('MOSTRANDO LOGIN');

    const modal = document.getElementById('modal');
    const contenido = document.getElementById('contenidoModal');
    const mensaje = document.getElementById('mensajeModal');
    const cerrar = document.getElementById('cerrarModal');

    modalEsLogin = true;

    mensaje.textContent = 'Ingreso al sistema';
    cerrar.style.display = 'none';

    contenido.innerHTML = `
      <input id="numeroEmpleado" type="number" placeholder="N° de Empleado" />
      <input id="password" type="password" placeholder="Contraseña" />
      <button id="btnLogin">Ingresar</button>
    `;

    modal.style.display = 'flex';

    document.getElementById('btnLogin')
      .addEventListener('click', login);
  }

  /* 
  ==============
      LOGIN
  ==============
  */

  async function login() {
    const numeroEmpleado = document.getElementById('numeroEmpleado').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ numeroEmpleado, password }),
      });

      if (!res.ok) throw new Error('Credenciales incorrectas');

      const data = await res.json();

      localStorage.setItem('token', data.access_token);

      const payloadBase64 = data.access_token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));
      localStorage.setItem('role', payload.rol);

      console.log('LOGIN OK:', payload);

      modalEsLogin = false;
      cerrarModalLogin();
      iniciarApp();

    } catch (error) {
      console.error(error);
      alert('Credenciales incorrectas');
    }
  }

  /*
  =========================
        ESTILOS
  =========================
  */

  function controlarUI() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const adminBtn = document.querySelector('.admin-btn');
    const cerrarBtn = document.getElementById('btnCerrar');

    //no se muestra nada
    if (!token) {
      if (adminBtn) adminBtn.style.display = 'none';
      if (cerrarBtn) cerrarBtn.style.display = 'none';
      return;
    }
    if (cerrarBtn) cerrarBtn.style.display = 'inline-block';

    //el admin ve
    if (adminBtn) {
      if (role && role.toUpperCase() === 'ADMIN') {
        adminBtn.style.display = 'inline-block';
      } else {
        adminBtn.style.display = 'none';
      }
    }
  }

  /*
  =========================
        CERRAR LOGIN
  =========================
  */
  const cerrarbtn = document.getElementById('btnCerrar');

  if (cerrarbtn) {
    cerrarbtn.addEventListener('click', (e) => {
      e.preventDefault();

      localStorage.clear();
      controlarUI();
      window.location.replace('index.html');
    });
  }

  function authHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  function cerrarModalLogin() {
    modal.style.display = 'none';
  }

  /* 
  ==============
     INICIAR
  ==============
   */

  function iniciarApp() {
    console.log('INICIANDO APP');
    cargarProductos();
    controlarUI();
  }
});

