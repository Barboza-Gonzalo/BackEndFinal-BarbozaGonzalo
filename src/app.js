const handlebars = require ("express-handlebars")
const express = require("express")
const productsRouter = require("./routes/products.router.js")
const cartsRouter = require("./routes/carts.router.js")
const viewsRouter = require("./routes/viwes.router.js")
const Server = require("socket.io")

const ProductManager = require("./productManager.js")

const manager = new ProductManager


const app = express()
const PORT = 8080
const httpServer = app.listen(PORT, () => {console.log(`Servidor corriendo en puerto: ${PORT}`)})


const socketServer =  Server(httpServer)



app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));







app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use("/", productsRouter)
app.use("/", cartsRouter)
app.use("/",viewsRouter) 



socketServer.on("connection", (socket) => {
    console.log("Nueva conexión");

    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });

    socket.on('nuevoProducto', async (producto) => {
        console.log("Nuevo producto recibido:", producto);
        try {
            await manager.addProduct(producto);
            socketServer.emit('actualizarProductos');
        } catch (error) {
            
        }})

    socket.on('eliminarProducto', async (id_producto)=>{
        console.log("ID del producto a eliminar:", id_producto)
        try{
            await manager.deleteProduct(id_producto)
            socketServer.emit('actualizarProductos')
        }catch{

        }
    } )

})