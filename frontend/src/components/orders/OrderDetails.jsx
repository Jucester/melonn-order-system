import React, { Fragment, useState, useEffect } from 'react';
import clientAxios from "../../config/axios";

// .get('/api/1.0/orders/999')
const OrderDetails = (props) => {

    const { id } = props.match.params;

    // Order state that saves the data we will send to the server
    const [order, saveOrder] = useState({
            id: "",
            seller_store: "",
            shipping_method: "",
            external_order_number: "",
            buyer_full_name: "",
            buyer_phone_number: "",
            buyer_email: "",
            shipping_address: "",
            shipping_city: "",
            shipping_region: "",
            shipping_country: "",
            line_items: [],
            creation_date: "",
            packPromiseMin: null,
            packPromiseMax: null,
            shipPromiseMin: null,
            shipPromiseMax: null,
            deliveryPromiseMin: null,
            deliveryPromiseMax: null,
            readyPickupPromiseMin: null,
            readyPickupPromiseMax: null
    });
    
    const getOrderDetails = async () => {
        const response = await clientAxios.get(`/orders/order/${id}`);
        console.log(response.data.order);
        saveOrder(response.data.order)

    }

    useEffect(() => {
        getOrderDetails();
        // eslint-disable-next-line
    }, [])


    return (  
        <Fragment>
            <h3> Order Information </h3>
            <p> External Order Number: { order.external_order_number } </p> 
            <p> Buyer Full Name: { order.buyer_full_name } </p>
            <p> Buyer Phone: { order.buyer_phone_number } </p>
            <p> Buyer Email:  { order.buyer_email } </p>

            <h3> Shipping Information </h3>
            <p> Shipping Address: { order.shipping_address } </p>
            <p> Shipping City: { order.shipping_city } </p>
            <p> Shipping Region: { order.shipping_region } </p>
            <p> Shipping Country: { order.shipping_country } </p>

            <h3> Promises Dates </h3>
            <p> Pack min: { order.packPromiseMin } </p>
            <p> Pack max: { order.packPromiseMax } </p>
            <p> Shipping min: { order.shipPromiseMin } </p>
            <p> Shipping max: { order.shipPromiseMax } </p>
            <p> Delivery min: { order.deliveryPromiseMin } </p>
            <p> Delivery max: { order.deliveryPromiseMax } </p>
            <p> Ready to Pickup Min: { order.readyPickupPromiseMin } </p>
            <p> Ready to Pickup Max: { order.readyPickupPromiseMax } </p>

            <h3> Line items </h3>
            { order.line_items.map( (item, i) => ( 
                <div>
                    <h5> Product { i + 1 } </h5>
                    <p> Product name: { item.product_name } </p>
                    <p> Product qty: { item.product_qty } </p>
                    <p> Product weight:  { item.product_weight } kg </p>
                </div>
             ) 
            )}

        </Fragment>
    );
}
 
export default OrderDetails;
