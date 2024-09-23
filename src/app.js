const express = require("express");
const methodOverride = require('method-override');
const session = require("express-session");
const handlebars = require ("express-handlebars");
const mongoose = require ("mongoose");
const mongoStore = require ("connect-mongo");
const Server = require("socket.io");
const passport = require("passport");
const config = require ("./config/config.js")
const initializePassport = require ("./config/passport.config.js")
const usersRouter = require ("./routes/users.router.js")
const sessionRouter = require("./routes/api/session.router.js");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/viwes.router.js");
const productsModel = require ("./DAO/mongo/models/products.model.js");
const messagesModel = require("./DAO/mongo/models/messages.model.js");
const {errorHandler} = require ("./middleware/indexError.js");
const { addLogger } = require("./public/js/logger.js");
const nodemailer = require("nodemailer")
const swaggerJsdoc = require("swagger-jsdoc");
const SwaggerUiExpress = require ("swagger-ui-express")
/* 
const ProductManager = require("./DAO/fileSystem/productManager.js")

const manager = new ProductManager */

const app = express()
const PORT = config.port || 8080;
const environment = config.environment
const httpServer = app.listen(PORT, () => {console.log(`Servidor corriendo en puerto: ${PORT}`)})
const swaggerOptions ={
    definition:{
        openapi:"3.0.1",
        info:{
            title:"Documentacion",
            description:"Api clase Swagger"
        },
    },
    apis:['src/docs/**/*.yaml']
};
const specs = swaggerJsdoc(swaggerOptions);
app.use(methodOverride('_method'));
app.use('/apidocs',SwaggerUiExpress.serve,SwaggerUiExpress.setup(specs))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
mongoose.connect(config.mongo)


app.use(addLogger(environment))
const socketServer =  Server(httpServer)


const hbs = handlebars.create({
    defaultLayout: "main",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
});

app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({ mongoUrl: config.mongo }),
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());


app.engine("handlebars", hbs.engine);
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));






app.use('/api/users', usersRouter) 
app.use('/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/sessions', sessionRouter)
app.use('/', viewsRouter)



app.use(errorHandler)

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



    socket.on("addToCart", async (data) => {
        console.log(data)
        try{


        }catch{

        }
    });
    

})