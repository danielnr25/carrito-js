var swiper = new Swiper(".carousel", {
   navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
   },
   pagination: {
      el: ".swiper-pagination",
   },
});

const carrito = document.querySelector("#carrito");
const listaCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const listaProductos = document.querySelector("#lista-productos");
let productosCarrito = [];


// Función que se ejecuta al presionar "Pagar"
function pagarCompra() {
   if (productosCarrito.length === 0) {
      alert('No hay productos en el carrito');
   } else {
      alert('Compra realizada con éxito');
      limpiarHTML();
      const totalPagarElement = document.getElementById('total-pagar');
      totalPagarElement.textContent = `$0`;
   }
}

cargarEventListener();

function cargarEventListener() {
   // Cuando agregas un producto presionando "Agregar al carrito"
   listaProductos.addEventListener("click", agregarProducto);

   // Elimina productos del carrito
   carrito.addEventListener('click', eliminarProducto);
   // Vaciar el carrito
   vaciarCarritoBtn.addEventListener('click', () => {
      productosCarrito = []; // Reseteamos el arreglo
      limpiarHTML(); // Eliminamos todo el HTML
      // vaciar carrito
      const totalPagarElement = document.getElementById('total-pagar');
      totalPagarElement.textContent = `$0`;

      const cantidadCarritoElement = document.getElementById('cantidad-carrito');
      cantidadCarritoElement.textContent = productosCarrito.length;

   })
}


function agregarProducto(e) {
   e.preventDefault();
   if (e.target.classList.contains('agregar-carrito')) {
      const productoSeleccionado = e.target.parentElement.parentElement;
      leerDatosProducto(productoSeleccionado)
   }
}

function leerDatosProducto(producto) {
   const infoProducto = {
      imagen: producto.querySelector('img').src,
      titulo: producto.querySelector('h3').textContent,
      precio: Number(producto.querySelector('span').textContent),
      id: producto.querySelector('a').getAttribute('data-id'),
      cantidad: 1,
   }

   const existe = productosCarrito.some(producto => producto.id === infoProducto.id)
   if (existe) {
      const productos = productosCarrito.map((producto) => {
         if (producto.id === infoProducto.id) {
            producto.cantidad++;
            return producto;
         } else {
            return producto;
         }
      });
      productosCarrito = [...productos];
   } else {
      productosCarrito = [...productosCarrito, infoProducto];
   }
   insertarProducto();
}

function insertarProducto() {

   limpiarHTML();
   let totalPagar = 0;
   productosCarrito.forEach(producto => {
      const { imagen, titulo, precio, cantidad, id } = producto;
      const precioTotal = precio * cantidad;
      totalPagar += precioTotal;
      const row = document.createElement('tr');
      row.innerHTML = `
         <td>
            <img src="${imagen}" width="100">
         </td>
         <td>${titulo}</td>
         <td>$${precioTotal}</td>
         <td>${cantidad}</td>
         <td>
            <a href="#" class="borrar-producto" data-id="${id}">X</a>
         </td>
      `;
      listaCarrito.appendChild(row);
   })
   const totalPagarElement = document.getElementById('total-pagar');
   totalPagarElement.textContent = `$${totalPagar}`;
   const cantidadCarrito = document.getElementById('cantidad-carrito');
   cantidadCarrito.textContent = productosCarrito.reduce((total, producto) => total + producto.cantidad, 0);

}


function limpiarHTML() {
   while (listaCarrito.firstChild) {
      listaCarrito.removeChild(listaCarrito.firstChild);
   }
}

function eliminarProducto(e) {

   if (e.target.classList.contains('borrar-producto')) {
      const productoId = e.target.getAttribute('data-id');
      productosCarrito = productosCarrito.filter(producto => producto.id !== productoId);
      insertarProducto();
   }
}
