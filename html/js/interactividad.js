// --- AUTENTICACIÓN ---
function iniciarSesion(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email && password) {
        localStorage.setItem('miron_sesion', 'activa');
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('errorMsg').innerText = 'Completa todos los campos.';
    }
}

function cerrarSesion() {
    localStorage.removeItem('miron_sesion');
    window.location.href = 'index.html';
}

// --- DATOS DE INVENTARIO ---
let inventario = [
    { id: 1, nombre: 'Blazer Ejecutivo', categoria: 'Chaquetas', talla: 'M', cantidad: 8, precio: 55.00 },
    { id: 2, nombre: 'Camisa Oxford', categoria: 'Camisas', talla: 'L', cantidad: 3, precio: 30.00 },
    { id: 3, nombre: 'Pantalón Chino', categoria: 'Pantalones', talla: 'S', cantidad: 12, precio: 40.00 }
];

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('dashboard.html')) {
        if (!localStorage.getItem('miron_sesion')) {
            window.location.href = 'index.html';
            return;
        }
        renderizarTabla();
        actualizarEstadisticas();
    }
});

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
    renderizarTabla();
    actualizarEstadisticas();
}