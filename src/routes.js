const express = require('express');

const routes = express.Router();

routes.post('/account', (request, response) => {
    const {cpf, name} = request.body;
   
    const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf)

    if(customerAlreadyExists){
        return response.status(400).json({error: "Customer already Exists!"})
    }

    customer = {id: uuidv4(), cpf, name, statement: []} ;
    customers.push(customer);

    return response.status(201).send();
});

module.exports= routes ;