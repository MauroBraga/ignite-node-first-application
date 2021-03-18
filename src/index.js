const { request, response } = require('express');
const express = require('express');
const { v4 : uuidv4} = require('uuid');

const app = express();

app.use(express.json());

const customers = [];

app.post('/account', (request, response) => {
    const {cpf, name} = request.body;
   
    const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf)

    if(customerAlreadyExists){
        return response.status(400).json({error: "Customer already Exists!"})
    }

    customer = {id: uuidv4(), cpf, name, statement: []} ;
    customers.push(customer);

    return response.status(201).send();
});

app.get("/statement/:cpf", (request, response) => {
    const cpf  = request.params;

    const customer = customers.find(customer => customer.cpf = cpf);

    response.json(customer.statement);
});

app.listen(3333);