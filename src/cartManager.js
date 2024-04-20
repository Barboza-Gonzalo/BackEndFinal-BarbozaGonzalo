const fs = require('fs').promises




class CartManager {

    constructor(){
        this.carts = []
        this.nextID = 1 
        this.cartsFile = "Carts.json"
        this.initializeNextID();
               

    }

    async readCarts() {
        try {
            const data = await fs.readFile(this.cartsFile, 'utf8');
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
        const carts = await this.readCarts();
        if (carts.length > 0) {
            this.nextID = Math.max(...carts.map(cart => cart.id)) + 1;
        }}

    


    async addCart(cart) {
        try { 
            let carts = await this.readCarts();      
            cart.id = this.nextID++; 
            carts.push(cart);                
            await fs.writeFile(this.cartsFile, JSON.stringify(carts, null, 2));
        } catch (error) {
            throw error;
        }
    }


    async getCartById(cart_id) {
        try {
            let carts = await this.readCarts();
            let busId = carts.find((cart) => cart.id === cart_id);
            if (!busId) {
                throw new Error("Carrito no encontrado");
            }
            return busId;
        } catch (error) {
            throw error;
        }
    }
    
    async updateCart(cart_id, updatedFields) {
        try {
            let carts = await this.readCarts();
            const cartId = carts.findIndex((cart) => cart.id === cart_id);
            if (cartId !== -1) {
            
                carts[cartId] = { ...carts[cartId], ...updatedFields };
                await fs.writeFile(this.cartsFile, JSON.stringify(carts, null, 2));
            } else {
                throw new Error("Carrito no encontrado");
            }
        } catch (error) {
            throw error;
        }
    }




}






module.exports = CartManager