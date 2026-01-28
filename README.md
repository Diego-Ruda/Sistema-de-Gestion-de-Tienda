# Sistema de Gestión de Tienda

Sistema completo de **gestión de ventas e inventario**, adaptable a cualquier tipo de negocio
(minimarket, tienda de electrónica, indumentaria, ferretería, kiosco, etc).

Incluye **Backend API** y **Frontend Web**, con control de **usuarios, roles, ventas, stock y reportes**.

El sistema implementa **autenticación con JWT, roles (ADMIN / EMPLEADO)** y control de acceso tanto en backend como en frontend.



## Tecnologías utilizadas

### Backend
- **Node.js**
- **NestJS**
- **TypeScript**
- **TypeORM**
- **PostgreSQL**
- **Swagger (OpenAPI)**
- **JWT (Autenticacion)**
- **class-validator / class-transformer**

### Frontend
- **HTML**
- **CSS**
- **JavaScript**
---
## Autentificación y Seguridad

- Login mediante JWT
- Persistencia de sesion con `localStorage`
- Roles de usuario (Admin/Empleado)
- Validacion de permiso por rol
- Bloqueo de acceso directo a `admin.html`
- Boton de Cerrar sesion

---

## Funcionalidades principales

  ### Productos
  - Crear productos (solo Admin)
  - Obtener todos los productos
  - Obtener productos disponibles (stock > 0)
  - Obtener producto por ID
  - Actualizar productos (solo Admin)
  - Eliminar productos (solo Admin  )

  ---

  ### Ventas
  - Registrar una venta
  - Cálculo automático del total
  - Validación de stock disponible
  - Descuento de stock al realizar una venta
  - Obtener ventas
  - Control de acceso por autenticacion

  ---

  ###  Reportes (solo Admin)
  - Total de ventas (día/semana/mes)
  - Producto más vendido (día/semana/mes)

## Frontend
- Interfaz de caja
- Modal de inicio de sesion
- Visualizacion de productos
- Carritos de compras
- Interfaz de Administrador
- Control de UI dependiendo el rol

---
##  Endpoints principales

  ### Auth
  - POST /auth/login

  ### Productos
  - GET /productos
  - GET /productos/disponibles
  - GET /productos/:id
  - POST /productos
  - PUT /productos/:id
  - DELETE /productos/:id

  ### Ventas
  - GET /ventas
  - GET /ventas/:id
  - POST /ventas
  - PUT /ventas/:id
  - DELETE /ventas/:id

  ### Reportes
  - GET /reportes/ventas-dia
  - GET /reportes/ventas-semana
  - GET /reportes/ventas-mes
  - GET /reportes/producto-mas-vendido-dia
  - GET /reportes/producto-mas-vendido-semana
  - GET /reportes/producto-mas-vendido-mes


## Validaciones

  - Validación automática de datos con `ValidationPipe`
  - Uso de DTOs (`CreateDto`, `UpdateDto`)
  - Control de errores con excepciones HTTP
  - Proteccion de rutas con Guards

---

## Documentación con Swagger

  Una vez iniciado el proyecto, se puede acceder a la documentación en:
  http://localhost:3000/api

## Cómo ejecutar el proyecto

  1. Instalar dependencias:
    npm install

  2. Configurar la base de datos en el archivo .env

  3. Ejecutar el proyecto:
    npm run start:dev

## Autor

  Desarrollado por Diego Ruda  
