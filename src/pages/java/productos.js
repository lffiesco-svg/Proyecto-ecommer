//  función de cargar productos
const grid = document.getElementById("productos-grid");

async function cargarProductos() {
    try {
        const respuesta = await fetch("https://backend-msql-bptv.onrender.com/api/productos");
        const productos = await respuesta.json();


        grid.innerHTML = productos.map((producto) => 
            `<div class="product-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl trasnsition duration-300 transform hover:translate-y-1" data-category="laptops" data-price="${producto.precio}" data-product-id="${producto.productId}">
                <div class"bg-linear-to-r from-gray-100 to-gray-200 h-60 flex items-center justify-center overflow-hidden">
                    <img class="h-60 w-full object-cover hover:scale-105 transition-transform duration-300" src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
                    <div class="hidden absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">Popular</div>
                </div>
            

                <div class="p-6">
                    <h3 class="text-lg font-bold mb-2 text-gray-800">${producto.nombre}</h3>

                    <p class="text-sm text-gray-600 mb-4">${producto.descripcion}</p>

                    <div class="flex items-center justify-between mb-4">

                        <div>
                            <span class="text-2xl font-bold text-blue-600">${(producto.precio || 0).toLocaleString('es-CO')}</span>
                        </div>

                        <div class="flex text-gray-400">
                            <span class="text-amber-300">★</span>★★★★★
                        </div>

                    </div>

                    <div class="flex space-x-2">

                        <button class="ver-detalles-btn bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition duration-300 flex-1 text-sn" data-product-id="${producto.productId}">Ver Detalles!</button>
                        <button class="add-to-cart-btn bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex-1 text-sm" data-product="${producto.nombre}" data-price="${producto.precio}" data-id="${producto.productId}">Comprar</button>

                    </div>
                </div>
            </div>`
        ).join('');
        console.log("productos cargados con éxtio");
        
    } catch (error) {
        console.error("error al cargar los productos", error);
    }
}

cargarProductos();


setInterval(() => {
    cargarProductos();
}, 10000);












// const buscador = document.getElementById('buscador');

// const filterCards = () => {

//     const cardItem = document.querySelectorAll('.product-card');
//     const searchTermn = buscador.value.toLowerCase().trim();


//     cardItem.forEach(card => {
//         const title = card.querySelector('h3').textContent.toLowerCase();

//         card.style.display = (title.includes(searchTermn)) ? 'block' : 'none';
//     });
// };

// input.addEventListener('input', filterCards);





// boton de añadir al carrito
let cantidad = 0;
const contador = document.getElementById('cart-counter');
const btnsComprar = document.querySelectorAll(".add-to-cart-btn");

grid.addEventListener('click', (e) => {
    if(e.target && e.target.classList.contains("add-to-cart-btn")) {
        cantidad++;
        contador.textContent = cantidad;
    };
});



// filtro de buscar producto por su texto


const contenedor = document.getElementById('main');
const buscador = document.getElementById('buscador');

contenedor.addEventListener('input', () => {
    
    const cardItem = document.querySelectorAll('.product-card');

    cardItem.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const searchTermn = buscador.value.toLowerCase().trim();

        

        card.style.display = (title.includes(searchTermn)) ? 'block' : 'none';
    });
});


// divFiltros.addEventListener('input', (e) => {

//     if(e.target && e.target.id === 'buscador') {
//         const card = document.querySelectorAll('.product-card');
//         const searchTermn = document.getElementById('buscador').value.toLowerCase().trim();
//         const title = card.querySelector('h3').textContent.toLowerCase();
//         cardItem.forEach(card => {
//         card.style.display = (title.includes(searchTermn)) ? 'block' : 'none';
//     });
//     };
// });




// btnsComprar.forEach((boton) => {
//     boton.addEventListener('click', () => {
//         cantidad++;
//         contador.textContent = cantidad;
//     });
// });