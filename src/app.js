const handlebars = require ("express-handlebars")
const express = require("express")
const productsRouter = require("./routes/products.router.js")
const cartsRouter = require("./routes/carts.router.js")
const viewsRouter = require("./routes/viwes.router.js")
const productsModel = require ("./DAO/models/products.model.js")
const Server = require("socket.io")
const mongoose = require ("mongoose")
const messagesModel = require("./DAO/models/messages.model.js")

/* 
const ProductManager = require("./DAO/fileSystem/productManager.js")

const manager = new ProductManager */


const app = express()
const PORT = 8080
const httpServer = app.listen(PORT, () => {console.log(`Servidor corriendo en puerto: ${PORT}`)})
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
mongoose.connect("mongodb+srv://gonBar:gonBar@cluster0.3tgme8j.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")

const socketServer =  Server(httpServer)


const hbs = handlebars.create({
    defaultLayout: "main",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
});

app.engine("handlebars", hbs.engine);
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));






app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)



/* 
app.use("/", productsRouter)
app.use("/", cartsRouter)
app.use("/",viewsRouter)  */



socketServer.on("connection", (socket) => {
    console.log("Nueva conexión");

    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });

    socket.on('nuevoProducto', async (producto) => {
        console.log("Nuevo producto recibido:", producto);
        try {
            const { title, description, price, thumbnail, code, stock, status, category } = producto;
            const result = await productsModel.create({
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                status,
                category
        });

            res.send({ result: "success", payload: result })
            socketServer.emit('actualizarProductos');
        } catch (error) {
            
        }})

    socket.on('eliminarProducto', async (id_producto)=>{
        console.log("ID del producto a eliminar:", id_producto)
        try{
            await productsModel.deleteOne(id_producto)
            socketServer.emit('actualizarProductos')
        }catch{

        }
    } )

    socket.on("newMessage", async (data )=>{
        console.log(data)
        try{
            const {user , message} = data
            result = await messagesModel.create ({user , message})
    
            res.send({ result: "success", payload: result });

        }catch{

        }
    })

})