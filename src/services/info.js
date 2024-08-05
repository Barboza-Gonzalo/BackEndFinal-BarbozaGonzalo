const generateProductErrorInfo = (payload)=>{
    return ` Una o mas propiedades es invalida 
    Lista de propiedades :
        title: recibio     ${payload.title}
        description : recibio      ${payload.description}
        price : recibio     ${payload.price}
        thumbnail  :recibio   ${payload.thumbnail}
        code :  recibio  ${payload.code}
        status : recibido  ${payload.status}
        stock :  recibio  ${payload.stock}
        category : recibio ${payload.category}

    `
}

const addProductCartError = ({cid, pid} ) => {
    return `Una o más propiedades son inválidas. 
    Lista de propiedades:
    - cart id: recibió ${cid}
    - product id: recibió ${pid}`;
}; 


module.exports={ generateProductErrorInfo,
                addProductCartError}