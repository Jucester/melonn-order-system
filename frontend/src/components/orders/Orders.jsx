import React, { useState, useEffect, useContext, Fragment } from "react";
import clientAxios from "../../config/axios";
import Order from "./Order";
import { Link, withRouter } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';

const Orders = (props) => {
  const [orders, saveOrders] = useState([]);

  const [auth, saveAuth] = useContext(AuthContext);

  const getOrders = async () => {
    if (auth.token !== '') {
      try {
        const response = await clientAxios.get(`/orders/${auth.authenticatedUser.id} `, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });   
        saveOrders(response.data.orders);
      } catch (error) {
        if(error.response.status === 500) {
          props.history.push('/login');
        }
      }
    } else {
      props.history.push('/login');
    }
   
  };
  useEffect(() => {
    getOrders();
     // eslint-disable-next-line
  }, []);


  if(!auth.auth) {
    props.history.push('/login');
  }

  return (
    <Fragment>
      <h1> Orders from { auth.authenticatedUser.name } </h1>

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

export default withRouter(Orders);
