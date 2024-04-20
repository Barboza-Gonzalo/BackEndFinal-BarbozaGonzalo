const fs = require('fs').promises




class ProductManager {

    constructor(){
        this.products = []
        this.nextID = 1 
        this.productsFile = "Products.json"
        this.initializeNextID();
               

    }


    async readProducts() {
        try {
            const data = await fs.readFile(this.productsFile, 'utf8');
            if (data.trim() === '') {
                return [];
            } else {
                return JSON.parse(data);
            }
        } catch (error) {
            if (error.code === 'ENOENT') {
               return[];
            } else {
                throw error;
            }
        }
    }
    async initializeNextID() {
        const products = await this.readProducts();
        if (products.length > 0) {
            this.nextID = Math.max(...products.map(product => product.id)) + 1;
        }}

    

        async addProduct(product) {
            try { 
                let products = await this.readProducts();
        
                if (!this.isProductValid(product)) {
                    throw new Error("El producto no es válido");
                }
                
                if (await this.isCodeDuplicate(product.code)) {
                    throw new Error("El código del producto ya está en uso");
                }
                
                product.id = this.nextID++; 
                products.push(product);
                
                await fs.writeFile(this.productsFile, JSON.stringify(products, null, 2));
            } catch (error) {
                throw error;
            }
        }

    async getProducts() {
        try{
            let products = await this.readProducts();
        return products
    }catch (error){
        return []
    }}

    async getProductById(product_id) {
        try {
            let products = await this.readProducts();
            let busId = products.find((product) => product.id === product_id);
            if (!busId) {
                throw new Error("Producto no encontrado");
            }
            return busId;
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(product_id) {
        try {
            let products = await this.readProducts();
            let busId = products.findIndex((product) => product.id === product_id);
            if (busId !== -1) {
                products.splice(busId, 1);
                await fs.writeFile(this.productsFile, JSON.stringify(products, null, 2));
            } else {
                throw new Error("Producto no encontrado");
            }
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(product_id, updatedFields) {
        try {
            let products = await this.readProducts();
            const busId = products.findIndex((product) => product.id === product_id);
            if (busId !== -1) {
                products[busId] = { ...products[busId], ...updatedFields };
                await fs.writeFile(this.productsFile, JSON.stringify(products, null, 2));
            } else {
                throw new Error("Producto no encontrado");
            }
        } catch (error) {
            throw error;
        }
    }

    isProductValid(product) {
        return (
            product.title &&
            product.description &&
            product.price &&
            product.thumbnail &&
            product.code &&
            product.stock &&
            product.category &&
            product.status !== undefined
        )
    }

   async isCodeDuplicate(code) {
        let products = await this.readProducts();
        return products.some((p) => p.code === code);
    }
}




module.exports = ProductManager

/* 
const manager = new ProductManager()


manager.deleteProduct(7) 



manager.addProduct({title: "Picadillo", description: "Swift", price: 500, thumbnail: 'https://www.swiftdirectoacasa.com.ar/media/catalog/product/p/i/picadillofrente_1.png?optimize=high&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700&format=jpeg&dpr=1%201x', code: '007', stock: 19})  



 manager.updateProduct( 1 , {price:500000 , stock:1500})  */




