
const socket = io()


document.getElementById('btn-send').addEventListener('click', () => {
    
    const newProduct = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: parseInt(document.getElementById('price').value),
        thumbnail: document.getElementById('thumbnail').value,
        code: document.getElementById('code').value,
        stock: parseInt(document.getElementById('stock').value),
        status: true ,
        category: document.getElementById('category').value
    };

    socket.emit('nuevoProducto', newProduct);
   ;})
    

    
    
    

document.getElementById('btn-del').addEventListener('click', () => {

    const productId = parseInt(document.getElementById('id').value);    

    socket.emit('eliminarProducto', productId);
    ;})



socket.on('actualizarProductos', () => {
    /* console.log("Evento 'actualizarProductos' recibido");
 */
    fetch('/realtimeproducts?format=json')
        .then(response => response.json())
        .then(data => {
            const productListContainer = document.getElementById('product-list');
            productListContainer.innerHTML = '';
            if (data) {
                data.forEach(product => {
                    const productDiv = document.createElement('div');
                    productDiv.innerHTML = `
                        <h2>${product.title} - ${product.description}</h2>
                        <img src="${product.thumbnail}" width="100" height="100" alt="">
                        <p>$${product.price}- - - ID:${product.id}</p>
                    `;
                    productListContainer.appendChild(productDiv);
                });
            }
        })
    });























/* socket.on('productoAgregado', (producto) => {
    console.log('Nuevo producto agregado:', producto);
    // Agregar lógica para actualizar la lista de productos en la página
    actualizarListaProductos();
});

socket.on('productoEliminado', (id) => {
    console.log('Producto eliminado:', id);
    // Agregar lógica para actualizar la lista de productos en la página
    actualizarListaProductos();
});

function actualizarListaProductos() {
    // Aquí puedes realizar una solicitud AJAX para obtener la lista actualizada de productos
    // Luego, actualiza el contenido de #product-list en la página
}
 */