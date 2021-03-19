import React from 'react';
import { Link } from 'react-router-dom';

const Order = ({order}) => {

    const { id, seller_store, shipping_method, buyer_full_name, creation_date } = order;

    return ( 
        <li className="order">
                    <div className="info-order">
                        <p className="number"> Order Number: { id } </p>
                        <p className="store"> Seller Store: { seller_store }  </p>
                        <p> Creation Date: { creation_date } </p>
                        <p> Shipping method: { shipping_method } </p>
                    </div>
                    <div className="actions">
                        <Link to={`/order/details/${id}`} className="btn btn-azul">
                            <i className="fas fa-pen-alt"></i>
                            Details
                        </Link>
                     
                    </div>
                </li>
     );
}
 
export default Order;