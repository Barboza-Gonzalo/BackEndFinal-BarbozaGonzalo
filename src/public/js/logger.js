const winston = require ("winston");

const customLevels ={
    levels:{
        debug:0,
        http:1,
        info:2,
        warning:3,
        error:4,
        fatal:5    
        
    },
    colors: {
        debug: 'white',
        http: 'green',
        info: 'blue',
        warning: 'yellow',
        error: 'magenta',
        fatal: 'red'
    }
}

winston.addColors(customLevels.colors);

const productionLogger = winston.createLogger({
    levels:customLevels.levels , 
    transports: [
        new winston.transports.Console({ levels: 'info' }),
        new winston.transports.File({filename:'./errors.log', level:"error" , format: winston.format.json()})
        
    ]
})

const developmentLogger  = winston.createLogger({
    levels : customLevels.levels ,
    format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
    ),
    transports:[
        new winston.transports.Console({levels:'debug'}),
        new winston.transports.File({filename:'./errors.log', level:"error" , format: winston.format.json()}) 
        ]
})

const addLogger = (environment)=>{
    const logger = environment === 'DEVELOPMENT' ? developmentLogger : productionLogger;
    return(req,res,next)=>{
    req.logger = logger
    req.logger.http(`${req.method}en${req.url}-${new Date().toLocaleString()}`)
    next()
    }}

module.exports={addLogger }