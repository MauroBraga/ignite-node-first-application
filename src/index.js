const { request, response } = require('express');
const express = require('express');
const { v4 : uuidv4} = require('uuid');

const app = express();

app.use(express.json());

const customers = [];

function verifyIfExistsAccountCPF(request, response, next){
    const {cpf} = request.headers;

    const customer = customers.find(customer => customer.cpf = cpf);

    if(!customer){
        return response.status(400).json({error: "Customer not found"})
    }

    request.customer = customer;

    return next();
}

function getBalance(statement) {
    const balance = statement.reduce((acc, operation) =>{
        if(operation.type === 'credit'){
            return acc + operation.amount;
        }else{
            return acc - operation.amount;
        }
    },0);
    return balance;
}

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

app.get("/statement/", verifyIfExistsAccountCPF,(request, response) => {
   const  {customer } = request;
    response.json(customer.statement);
});

app.post("/deposit/", verifyIfExistsAccountCPF,(request, response) => {
    const {description, amount} = request.body;
    const  {customer } = request;
    
    const statementOperation = {
        description, 
        amount,
        created_at: new Date(),
        type:'credit'
    };
    customer.statement.push(statementOperation);
    response.status(201).json();
 });

 app.get("/withdraw/", verifyIfExistsAccountCPF,(request, response) => {
    const {amount} = request.body; 
    const  {customer } = request;

    const balance = getBalance(customer.statement);

    if(balance < amount){
        return response.status(400).json({error: "Insuficient founds!"});
    }

    const statementOperation = {
        amount,
        created_at: new Date(),
        type:'debit'
    };
    customer.statement.push(statementOperation);
    response.status(201).json();
 });

 app.get("/statement/date", verifyIfExistsAccountCPF,(request, response) => {
    const  {customer } = request;
    const {date} = request.query;

    const dateFormat = new Date(date +"00:00");

    const statement = customer.statement.filter(
        (statement) => 
            statement.created_at.toDateString() === new Date(dateFormat).toDateString()
    );

     response.json(statement);
 });

 app.put("/account",verifyIfExistsAccountCPF, (req, resp) => {
    const {name} = req.body;
    const { customer } = req;

    customer.name = name;

    return resp.status(201).send();
 });

 app.get("/account",verifyIfExistsAccountCPF, (req, resp) => {
    const { customer } = req;

    return resp.json(customer);
 });

app.listen(3333);