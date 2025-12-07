// ========== GESTIÓN DEL CARRITO ==========

// Obtener carrito del localStorage
function obtenerCarrito() {
    const carrito = localStorage.getItem('carrito');
    return carrito ? JSON.parse(carrito) : [];
}

// Guardar carrito en localStorage
function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

// Actualizar contador del carrito
function actualizarContadorCarrito() {
    const carrito = obtenerCarrito();
    const contador = document.getElementById('cart-counter');
    if (contador) {
        const totalProductos = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        contador.textContent = totalProductos;
    }
}

// Agregar producto al carrito
function agregarAlCarrito(productId, nombre, precio, imagen) {
    let carrito = obtenerCarrito();
    
    // Verificar si el producto ya está en el carrito
    const productoExistente = carrito.find(item => item.productId === productId);
    
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            productId,
            nombre,
            precio,
            imagen,
            cantidad: 1
        });
    }
    
    guardarCarrito(carrito);
    mostrarToast('Producto agregado al carrito', 'success');
}

// Eliminar producto del carrito
function eliminarDelCarrito(productId) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(item => item.productId !== productId);
    guardarCarrito(carrito);
    cargarCarrito();
}

// Actualizar cantidad de un producto
function actualizarCantidad(productId, nuevaCantidad) {
    let carrito = obtenerCarrito();
    const producto = carrito.find(item => item.productId === productId);
    
    if (producto) {
        if (nuevaCantidad <= 0) {
            eliminarDelCarrito(productId);
        } else {
            producto.cantidad = nuevaCantidad;
            guardarCarrito(carrito);
            cargarCarrito();
        }
    }
}

// Vaciar carrito completo
function vaciarCarrito() {
    localStorage.removeItem('carrito');
    actualizarContadorCarrito();
    cargarCarrito();
}

// ========== CARGAR CARRITO EN LA PÁGINA ==========
function cargarCarrito() {
    const carrito = obtenerCarrito();
    const contenedorProductos = document.querySelector('main');
    const resumenPedido = document.getElementById('resumen-pedido');
    
    if (!contenedorProductos) return;
    
    // Limpiar productos anteriores
    const productosExistentes = contenedorProductos.querySelectorAll('.col-span-2');
    productosExistentes.forEach(p => p.remove());
    
    if (carrito.length === 0) {
        // Carrito vacío
        const carritoVacio = document.createElement('section');
        carritoVacio.className = 'col-span-2 bg-white rounded-2xl shadow-xl p-12 text-center';
        carritoVacio.innerHTML = `
            <div class="text-6xl mb-6">🛒</div>
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h2>
            <p class="text-gray-600 mb-6">¡Descubre productos increíbles y comienza tu compra!</p>
            <a href="productos.html" class="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition">
                Explorar Productos
            </a>
        `;
        contenedorProductos.insertBefore(carritoVacio, resumenPedido);
        
        // Actualizar resumen
        document.getElementById('valor-subtotal').textContent = '0';
        return;
    }
    
    // Crear sección de productos
    const seccionProductos = document.createElement('section');
    seccionProductos.className = 'col-span-2 space-y-4';
    
    carrito.forEach(producto => {
        const productoHTML = `
            <div class="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-6 hover:shadow-xl transition">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="w-24 h-24 object-cover rounded-xl">
                <div class="flex-1">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${producto.nombre}</h3>
                    <p class="text-2xl font-bold text-blue-600">$${producto.precio.toLocaleString('es-CO')}</p>
                </div>
                <div class="flex items-center gap-3">
                    <button onclick="actualizarCantidad('${producto.productId}', ${producto.cantidad - 1})" class="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition flex items-center justify-center font-bold text-xl">
                        −
                    </button>
                    <span class="text-xl font-bold w-12 text-center">${producto.cantidad}</span>
                    <button onclick="actualizarCantidad('${producto.productId}', ${producto.cantidad + 1})" class="w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center font-bold text-xl">
                        +
                    </button>
                </div>
                <button onclick="confirmarEliminar('${producto.productId}')" class="text-red-500 hover:text-red-700 transition p-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        `;
        seccionProductos.innerHTML += productoHTML;
    });
    
    // Botón vaciar carrito
    seccionProductos.innerHTML += `
        <button onclick="confirmarVaciarCarrito()" class="w-full py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition">
            🗑️ Vaciar Carrito
        </button>
    `;
    
    contenedorProductos.insertBefore(seccionProductos, resumenPedido);
    
    // Actualizar resumen
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    document.getElementById('valor-subtotal').textContent = subtotal.toLocaleString('es-CO');
    document.querySelector('.bg-linear-to-r.from-blue-100 p:last-child').innerHTML = `<span>$</span>${subtotal.toLocaleString('es-CO')}`;
}

// ========== FINALIZAR COMPRA ==========
async function finalizarCompra(event) {
    event.preventDefault();
    
    const carrito = obtenerCarrito();
    
    if (carrito.length === 0) {
        mostrarToast('El carrito está vacío', 'error');
        return;
    }
    
    // Obtener datos del usuario de localStorage
    const usuarioData = JSON.parse(localStorage.getItem('usuario'));
    
    if (!usuarioData) {
        mostrarToast('Debes iniciar sesión para realizar una compra', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    // Obtener datos del formulario
    const direccion = document.getElementById('direccion').value;
    const ciudad = document.getElementById('ciudad').value;
    const codigoPostal = document.getElementById('codigo-postal').value;
    const metodoPago = document.getElementById('metodo-pago').value || 'Efectivo contra entrega';
    
    if (!direccion || !ciudad || !codigoPostal) {
        mostrarToast('Por favor completa todos los campos', 'error');
        return;
    }
    
    // Deshabilitar botón
    const btnFinalizar = document.querySelector('button[type="submit"]');
    btnFinalizar.disabled = true;
    btnFinalizar.textContent = 'Procesando...';
    
    try {
        // Crear pedidos para cada producto
        const promesas = carrito.map(producto => {
            return fetch('https://backend-msql-bptv.onrender.com/api/pedidos/crear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId: producto.productId,
                    nombreproducto: producto.nombre,
                    descripcion: `Cantidad: ${producto.cantidad}`,
                    precio: producto.precio * producto.cantidad,
                    imagen: producto.imagen,
                    nombrecliente: `${usuarioData.name} ${usuarioData.lastName}`,
                    telefono: usuarioData.tel,
                    edad: 25, // Puedes agregar este campo al registro si quieres
                    email: usuarioData.email,
                    sexo: 'No especificado', // Puedes agregar este campo
                    ciudad: ciudad,
                    codigopostal: codigoPostal,
                    direccion: direccion,
                    fechaentrega: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 días
                    metodoPago: metodoPago,
                    estado: 'Pendiente'
                })
            });
        });
        
        const respuestas = await Promise.all(promesas);
        
        // Verificar que todos los pedidos se crearon correctamente
        const todosExitosos = respuestas.every(r => r.ok);
        
        if (todosExitosos) {
            mostrarToast('¡Pedido realizado exitosamente!', 'success');
            vaciarCarrito();
            
            setTimeout(() => {
                window.location.href = 'pedidos.html';
            }, 2000);
        } else {
            throw new Error('Algunos pedidos no se pudieron crear');
        }
        
    } catch (error) {
        console.error('Error al crear pedido:', error);
        mostrarToast('Error al procesar el pedido', 'error');
        btnFinalizar.disabled = false;
        btnFinalizar.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            Finalizar compra
        `;
    }
}

// ========== CONFIRMACIONES ==========
function confirmarEliminar(productId) {
    if (confirm('¿Seguro que deseas eliminar este producto del carrito?')) {
        eliminarDelCarrito(productId);
        mostrarToast('Producto eliminado', 'success');
    }
}

function confirmarVaciarCarrito() {
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?\n\nEsta acción eliminará todos los productos de tu carrito. ¿Estás seguro?')) {
        vaciarCarrito();
        mostrarToast('Carrito vaciado', 'success');
    }
}

// ========== FUNCIÓN TOAST ==========
function mostrarToast(mensaje, tipo = 'info') {
    let toast = document.getElementById('toast-carrito');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-carrito';
        toast.className = 'fixed top-5 right-5 px-6 py-4 rounded-xl shadow-2xl text-white font-semibold z-[9999] transition-opacity duration-300 opacity-0';
        document.body.appendChild(toast);
    }
    
    const colores = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };
    
    toast.className = `fixed top-5 right-5 px-6 py-4 rounded-xl shadow-2xl text-white font-semibold z-[9999] transition-opacity duration-300 ${colores[tipo]}`;
    toast.textContent = mensaje;
    
    setTimeout(() => toast.classList.add('opacity-100'), 20);
    
    setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0');
    }, 3000);
}

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', () => {
    // Actualizar contador al cargar cualquier página
    actualizarContadorCarrito();
    
    // Si estamos en la página del carrito, cargar productos
    if (window.location.href.includes('carrito.html')) {
        cargarCarrito();
        
        // Configurar formulario
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', finalizarCompra);
        }
    }
    
    // Manejar botones "Comprar" en todas las páginas
    document.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart-btn')) {
            const btn = e.target.closest('.add-to-cart-btn');
            const productId = btn.dataset.id;
            const nombre = btn.dataset.product;
            const precio = parseInt(btn.dataset.price);
            const imagen = btn.dataset.image || 'https://via.placeholder.com/150';
            
            agregarAlCarrito(productId, nombre, precio, imagen);
        }
    });
});