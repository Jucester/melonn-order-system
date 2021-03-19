# Melonn Order Management System

App to Manage Orders made by Sellers

### Details: 

This is a order management system that comunicates with the Melonn API to get details about
the shipping methods. Sellers can place orders so their sells are handle by the logistic team.

The app use json files as database (based on requirements). It works but can make tests fail. 


# Stack

* Node.js 
* Express 
* ReactJS

# How to run it?


## Installing


### 1. Clone the repo

```
git clone https://github.com/Jucester/melonn-order-system.git

```

### 2. Run backend

```
npm run dev or npm start. The app runs by default in port 4000, you can change it in .env or in app.js

```

### 3. Run frontend

```
npm start. The connection with the backend is in the .env files. You can change the URL if is needed

```

Once both, backend and frontend are running, you just go to [http://localhost:3000](http://localhost:3000), and the API will be at [http://localhost:4000](http://localhost:4000).

Remember to modify the ports if you change it.