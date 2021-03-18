const express = require('express');
const { v4 : uuidv4} = require('uuid');

const app = express();

app.use(express.json());

const customers = [];

app.post('/account', (request, response) => {
    const {cpf, name} = request.body;
    const id = uuidv4();

    customer = {id, cpf, name, statement: []} ;
    customers.push(customer);

    return response.status(201).send();
});

app.listen(3333);