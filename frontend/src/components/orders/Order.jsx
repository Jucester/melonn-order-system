import React from 'react';

const Order = ({order}) => {

    const { id, seller_store, shipping_method, buyer_full_name } = order;

    return ( 
        <li className="cliente">
                    <div className="info-cliente">
                        <p className="nombre"> { id } </p>
                        <p className="empresa"> { seller_store }  </p>
                        <p> { shipping_method } </p>
                        <p> { buyer_full_name } </p>
                    </div>
                    <div className="acciones">
                        <a href="/" className="btn btn-azul">
                            <i className="fas fa-pen-alt"></i>
                            Editar Cliente
                        </a>
                        <button type="button" className="btn btn-rojo btn-eliminar">
                            <i className="fas fa-times"></i>
                            Eliminar Cliente
                        </button>
                    </div>
                </li>
     );
}
 
export default Order;