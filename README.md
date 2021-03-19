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
First you need to make a .env file with this variables:

MELONN_API_KEY=<Melonn api key>
JWT_KEY=<secret key for JWT, can be whatever you want for review/testing purposes>
PORT=<custom port. By default the backend is running on port 4000>

Then run npm install to install all dependencies.

After that, just run 'npm run dev' or 'npm start' in the backend folder. 
The app by default is executed in port 4000, if you have set another port in the .env file then use
http://localhost:<the port you defined>

```

### 3. Run frontend

```
make a .env file with the variable REACT_APP_BACKEND_URL, and set it to the baseURL of your backend, ej: "http://localhost:4000".
Then npm install and npm start.
```

Once both, backend and frontend are running, you just go to [http://localhost:3000](http://localhost:3000), and the API will be at [http://localhost:4000](http://localhost:4000). You can access with the default user credentials:

email: admin@test.com
password: admin123

Remember to modify the ports if you change it.
