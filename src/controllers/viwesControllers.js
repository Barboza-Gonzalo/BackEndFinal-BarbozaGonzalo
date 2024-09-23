const {addLogger} = require("../public/js/logger")






async function loggerTest (req,res,){

    req.logger.info("Prueba de Logs Info"),
    req.logger.debug("Prueba de Logs Debug")
    req.logger.warning("Prueba de Logs Warn"),
    req.logger.error("Prueba de Logs Error"),
    req.logger.fatal("Prueba logs de Fatal Err")

    res.send('Logs probados, verifica la consola y el archivo de logs.');
}

async function getHome(req,res) {
        if (req.session.user) {
            res.redirect('/products');
        } else {
            res.redirect('/login');
        }
}


module.exports={
    loggerTest,
    getHome
}