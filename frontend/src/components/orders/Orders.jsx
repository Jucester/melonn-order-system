import React, { useState, useEffect, Fragment } from "react";
import clientAxios from "../../config/axios";

import Order from "./Order";
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, saveOrders] = useState([]);

  const getOrders = async () => {
    const response = await clientAxios.get("/orders");
    console.log(response.data.orders);
    saveOrders(response.data.orders);
  };
  useEffect(() => {
    getOrders();
  }, []);

  return (
    <Fragment>
      <h1> Orders </h1>

      <Link to="/order/create" className="btn btn-verde nvo-cliente"> <i className="fas fa-plus-circle"></i>
                Create Order
      </Link>


      <ul className="listado-orders">
        {orders.map((order, i) => (
            
           <Order key={i} order={order} />
           
        ) )}
      </ul>
    </Fragment>
  );
};

export default Orders;
