# Mirón — Sistema de Gestión de Inventario y Ventas de Ropa

Aplicación web frontend para la gestión de inventario de prendas de vestir y registro de ventas con carrito, desarrollada con **HTML5**, **CSS3** y **JavaScript** (utilizando `localStorage` para la persistencia de datos en el navegador).

## Características principales

* **Inicio y cierre de sesión:**
  * Validación de credenciales en el login (`index.html`).
  * Extracción y formateo automático del nombre de usuario a partir del correo electrónico (`miron_usuario`) para mostrarlo en el panel lateral (`dashboard.html`).
  * Cierre de sesión que limpia el estado activo (`miron_sesion` y `miron_usuario`).
* **Gestión de inventario:**
  * Listado inicial de prendas (Blazer Ejecutivo, Camisa Oxford, Pantalón Chino) sincronizado con `localStorage` (`miron_inventario`).
  * Registro de nuevas prendas mediante modal (`abrirModal()` / `guardarPrenda()`), filtradas por categorías como *Chaquetas*, *Camisas* y *Pantalones*.
  * Eliminación de prendas con actualización inmediata de la tabla, estadísticas y almacenamiento local.
  * Búsqueda y filtrado dinámico en la tabla de inventario (`filtrarTabla()`).
* **Módulo de ventas con carrito (nuevo):**
  * Modal **Nueva Venta (Carrito)** accesible desde el menú lateral con contador en tiempo real de artículos (`contadorCarritoMenu`).
  * Selección de prendas disponibles según stock (`cantidad > 0`), cálculo automático de subtotal por cantidad (`actualizarPrecioVenta()`) y validación de disponibilidad antes de agregar al carrito.
  * Gestión de artículos en el carrito (agregar, acumular cantidades y quitar ítems).
  * Confirmación de venta (`procesarVenta()`) que descuenta automáticamente las unidades del inventario, guarda el registro en el historial (`miron_ventas`), actualiza `localStorage` y refresca las métricas del panel.

## Estructura del proyecto

```text
Gestion-de-inventario/
├── css/
│   └── estilos.css          # Estilos del panel, encabezados y componentes visuales
├── img/
│   └── logo.png             # Logotipo de Mirón y recursos gráficos
├── js/
│   └── interactividad.js    # Lógica de sesión, inventario, carrito y ventas
├── dashboard.html           # Panel principal de control, inventario y modal de ventas
├── index.html               # Pantalla de inicio de sesión
└── README.md                # Documentación del proyecto
