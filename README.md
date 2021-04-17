# Melonn Order Management System

App to Manage Orders made by Sellers

### Details: 

This is a Order Management System were clients (sellers) can place their orders so Logistics team can handle it depending
on the shipping method selected.


# Stack

* Node.js 
* Express 
* MongoDB
* ReactJS

# How to run it?


## Installing


### 1. Clone the repo

```
git clone https://github.com/Jucester/melonn-order-system.git

```

### 2. Run backend

```
First you need to make a .env file with this variables:

MONGO_URI=<the url of your mongo database>
JWT_KEY=<secret key for JWT, can be whatever you want for review/testing purposes>
PORT=<custom port. By default the backend is running on port 4000>

Then run npm install to install all dependencies.

After that, just run 'npm run dev' or 'npm start' in the backend folder. 
The app by default is executed in port 4000, if you have set another port in the .env file then use
http://localhost:<the port you defined>

```

### 3. Run frontend

```
npm install and then npm start. The connection with the backend is in the .env files. You can change the URL if you
defined another port in the backend.

```

Once both, backend and frontend are running, you just go to [http://localhost:3000](http://localhost:3000), and the API will be at [http://localhost:4000](http://localhost:4000). You can access with the default user credentials:

email: admin@test.com
password: admin123

Remember to modify the ports if you change it.
