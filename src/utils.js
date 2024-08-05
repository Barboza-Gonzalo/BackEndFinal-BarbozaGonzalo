
const bcrypt = require("bcrypt");
const { Faker , es_MX , en } = require('@faker-js/faker');
const { trusted } = require("mongoose");

const faker = new Faker({locale:[es_MX , en ]});

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

const generateProductFaker =()=>{
    
    return  {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription() ,
    price: faker.commerce.price() ,
    thumbnail:faker.image.urlPicsumPhotos() ,
    code: faker.string.uuid() ,
    stock:faker.number.int(),
    status:faker.datatype.boolean(),
    category: faker.commerce.productAdjective(),
    }

}


module.exports = {  generateProductFaker,  createHash,  isValidPassword};