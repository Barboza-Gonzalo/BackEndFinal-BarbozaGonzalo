const dotenv = require ("dotenv")

const environment = "DEVELOPMENT"
dotenv.config({
    path: environment === "DEVELOPMENT" ? ".env.development":".env.production"
})


module.exports = {port: process.env.PORT , mongo: process.env.MONGO_URL , persistence: process.env.PERSISTENCE}