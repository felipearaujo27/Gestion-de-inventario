// --- AUTENTICACIÓN ---
function iniciarSesion(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email && password) {
        // Extrae lo que está antes del '@' y limpia puntos o guiones
        const nombreBase = email.split('@')[0].replace(/[._-]/g, ' ');
        // Pone en mayúscula la primera letra de cada palabra
        const nombreFormateado = nombreBase.replace(/\b\w/g, letra => letra.toUpperCase());

        localStorage.setItem('miron_sesion', 'activa');
        localStorage.setItem('miron_usuario', nombreFormateado);
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('errorMsg').innerText = 'Completa todos los campos.';
    }
}

function cerrarSesion() {
    localStorage.removeItem('miron_sesion');
    localStorage.removeItem('miron_usuario');
    window.location.href = 'index.html';
}

// --- DATOS DE INVENTARIO ---
let inventario = JSON.parse(localStorage.getItem('miron_inventario')) || [
    { id: 1, nombre: 'Blazer Ejecutivo', categoria: 'Chaquetas', talla: 'M', cantidad: 8, precio: 55.00 },
    { id: 2, nombre: 'Camisa Oxford', categoria: 'Camisas', talla: 'L', cantidad: 3, precio: 30.00 },
    { id: 3, nombre: 'Pantalón Chino', categoria: 'Pantalones', talla: 'S', cantidad: 12, precio: 40.00 }
];
let historialVentas = JSON.parse(localStorage.getItem('miron_ventas')) || [];

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('dashboard.html')) {
        if (!localStorage.getItem('miron_sesion')) {
            window.location.href = 'index.html';
            return;
        }

        //--- se muestra el nombre del usuario logueado---
        const usuarioGuardado = localStorage.getItem('miron_usuario');
        const elUsuario = document.getElementById('nombreUsuarioMostrar');
        if (usuarioGuardado && elUsuario) {
            elUsuario.innerText = usuarioGuardado;
        }

        renderizarTabla();
        actualizarEstadisticas();
    }
}); // llave de cierre  ----

function renderizarTabla(datos = inventario) {
    const tbody = document.getElementById('inventoryTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    datos.forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td>#00${item.id}</td>
                <td><strong>${item.nombre}</strong></td>
                <td>${item.categoria}</td>
                <td>${item.talla}</td>
                <td><span style="color: ${item.cantidad < 5 ? '#ff4757' : 'inherit'}; font-weight: ${item.cantidad < 5 ? 'bold' : 'normal'}">${item.cantidad}</span></td>
                <td>$${item.precio.toFixed(2)}</td>
                <td>
                    <button class="btn-delete" onclick="eliminarPrenda(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

function actualizarEstadisticas() {
    document.getElementById('totalPrendas').innerText = inventario.reduce((acc, item) => acc + Number(item.cantidad), 0);
    document.getElementById('stockBajo').innerText = inventario.filter(item => item.cantidad < 5).length;
}

function abrirModal() {
    document.getElementById('clothingModal').style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('clothingModal').style.display = 'none';
}

function guardarPrenda(event) {
    event.preventDefault();
    const nuevaPrenda = {
        id: inventario.length + 1,
        nombre: document.getElementById('itemName').value,
        categoria: document.getElementById('itemCategory').value,
        talla: document.getElementById('itemSize').value,
        cantidad: parseInt(document.getElementById('itemQuantity').value),
        precio: parseFloat(document.getElementById('itemPrice').value)
    };

    inventario.push(nuevaPrenda);
    localStorage.setItem('miron_inventario',JSON.stringify(inventario));
    renderizarTabla();
    actualizarEstadisticas();
    cerrarModal();
    document.getElementById('clothingForm').reset();
}

function filtrarTabla() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtrados = inventario.filter(item => 
        item.nombre.toLowerCase().includes(query) || 
        item.categoria.toLowerCase().includes(query)
    );
    renderizarTabla(filtrados);
}

function eliminarPrenda(index) {
    inventario.splice(index, 1);
    localStorage.setItem('miron_inventario',JSON.stringify(inventario));
    renderizarTabla();
    actualizarEstadisticas();
}

// ==========================================
// --- MÓDULO DE VENTAS CON CARRITO -----
// ==========================================

let carrito = [];

function abrirModalVenta() {
    cargarOpcionesDeVenta();
    renderizarCarrito();
    actualizarPrecioVenta();
    document.getElementById('ventaModal').style.display = 'flex';
}

function cerrarModalVenta() {
    document.getElementById('ventaModal').style.display = 'none';
    document.getElementById('ventaForm').reset();
}

function cargarOpcionesDeVenta() {
    const select = document.getElementById('ventaPrendaSelect');
    if (!select) return;
    select.innerHTML = '<option value="">-- Elige una prenda --</option>';
    
    inventario.forEach(item => {
        if (item.cantidad > 0) {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = `${item.nombre} (${item.talla}) - Disp: ${item.cantidad}`;
            select.appendChild(option);
        }
    });
}

function actualizarPrecioVenta() {
    const idSeleccionado = Number(document.getElementById('ventaPrendaSelect').value);
    const cantidad = Number(document.getElementById('ventaCantidad').value) || 0;
    const prenda = inventario.find(p => p.id === idSeleccionado);

    const inputSubtotal = document.getElementById('ventaPrecioUnitario');
    if (prenda && inputSubtotal) {
        inputSubtotal.value = `$${(prenda.precio * cantidad).toFixed(2)}`;
    } else if (inputSubtotal) {
        inputSubtotal.value = "$0.00";
    }
}

function agregarAlCarrito() {
    const idPrenda = Number(document.getElementById('ventaPrendaSelect').value);
    const cantidad = Number(document.getElementById('ventaCantidad').value);
    const prenda = inventario.find(item => item.id === idPrenda);

    if (!prenda || cantidad <= 0) {
        alert("Selecciona una prenda y una cantidad válida.");
        return;
    }

    const itemEnCarrito = carrito.find(item => item.id === idPrenda);
    const cantidadTotalSolicitada = itemEnCarrito ? itemEnCarrito.cantidad + cantidad : cantidad;

    if (cantidadTotalSolicitada > prenda.cantidad) {
        alert(`Stock insuficiente. Solo hay ${prenda.cantidad} unidades disponibles.`);
        return;
    }

    if (itemEnCarrito) {
        itemEnCarrito.cantidad += cantidad;
        itemEnCarrito.subtotal = itemEnCarrito.cantidad * prenda.precio;
    } else {
        carrito.push({
            id: prenda.id,
            nombre: `${prenda.nombre} (${prenda.talla})`,
            precio: prenda.precio,
            cantidad: cantidad,
            subtotal: prenda.precio * cantidad
        });
    }

    document.getElementById('ventaPrendaSelect').value = '';
    document.getElementById('ventaCantidad').value = 1;
    actualizarPrecioVenta();
    renderizarCarrito();
}

function quitarDelCarrito(index) {
    carrito.splice(index, 1);
    renderizarCarrito();
}

function renderizarCarrito() {
    const tbody = document.getElementById('carritoTableBody');
    const totalInput = document.getElementById('ventaTotal');
    const badgeMenu = document.getElementById('contadorCarritoMenu');
    
    if (!tbody || !totalInput) return;

    tbody.innerHTML = '';
    let totalGeneral = 0;

    if (carrito.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 10px; color: #888;">El carrito está vacío</td></tr>';
        totalInput.value = "$0.00";
        if (badgeMenu) badgeMenu.innerText = '0';
        return;
    }

    carrito.forEach((item, index) => {
        totalGeneral += item.subtotal;
        tbody.innerHTML += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px;">${item.nombre}</td>
                <td style="padding: 8px;">${item.cantidad}</td>
                <td style="padding: 8px;">$${item.subtotal.toFixed(2)}</td>
                <td style="padding: 8px; text-align: right;">
                    <button type="button" onclick="quitarDelCarrito(${index})" style="background: #ff4757; color: white; border: none; border-radius: 3px; cursor: pointer; padding: 2px 6px;">X</button>
                </td>
            </tr>
        `;
    });

    totalInput.value = `$${totalGeneral.toFixed(2)}`;

    if (badgeMenu) {
        const totalArticulos = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        badgeMenu.innerText = totalArticulos;
    }
}

function procesarVenta(event) {
    event.preventDefault();

    if (carrito.length === 0) {
        alert("Agrega al menos una prenda al carrito antes de confirmar.");
        return;
    }

    let totalFactura = 0;
    carrito.forEach(itemCarrito => {
        const prendaInventario = inventario.find(p => p.id === itemCarrito.id);
        if (prendaInventario) {
            prendaInventario.cantidad -= itemCarrito.cantidad;
        }
        totalFactura += itemCarrito.subtotal;
    });

    historialVentas.push({
        id: Date.now(),
        fecha: new Date().toLocaleDateString(),
        items: [...carrito],
        total: totalFactura
    });

    localStorage.setItem('miron_inventario', JSON.stringify(inventario));
    localStorage.setItem('miron_ventas', JSON.stringify(historialVentas));

    carrito = [];
    renderizarCarrito();
    renderizarTabla();
    actualizarEstadisticas();
    cerrarModalVenta();
    alert(`¡Venta registrada por $${totalFactura.toFixed(2)}! Stock actualizado.`);
}
