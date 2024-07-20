const dotenv = require ("dotenv")

const environment = "PRODUCTION"
dotenv.config({
    path: environment === "DEVELOPMENT" ? ".env.development":".env.production"
})


module.exports = {port: process.env.PORT , mongo: process.env.MONGO_URL}