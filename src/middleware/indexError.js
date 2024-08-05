const {EErrors} = require("../services/errorEnum.js");

function errorHandler(error, req, res, next) {
    
    switch (error.code) {
        case EErrors.INVALID_TYPES_ERROR :
            res.send({ status: "error", error: error.name, cause: error.cause });
            break;
        
        case EErrors.DATABASE_ERROR :
            res.send({ status: "error", error: error.name , cause: error.cause});
            break;

        default:
            res.send({ status: "error", error: "error no manejado" });
    }
}

module.exports = { errorHandler };