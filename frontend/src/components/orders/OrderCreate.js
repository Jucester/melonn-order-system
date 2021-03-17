import React, { Fragment, useState, useEffect } from "react";
import clientAxios from "../../config/axios";

const OrderCreation = () => {

  const [order, saveOrder] = useState({
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
    line_items: []
  });

  const [shippingMethods, saveShippingMethods] = useState([]);

  const getShippingMethods = async () => {
    const methods = await clientAxios.get('/orders/shipping', order);
    saveShippingMethods(methods.data.content);
  }

  useEffect(() => {
    getShippingMethods();
  }, [])



  const handleChange = e => {
      // Saving the user inputs in the state
      saveOrder({
          ...order,
          [e.target.name] : e.target.value
      })
  }

  // Validate that all inputs are fill
  const validateClient = () => {
      // Destructuring
      const { 
      seller_store,
      shipping_method,
      external_order_number,
      buyer_full_name,
      buyer_phone_number,
      buyer_email,
      shipping_address,
      shipping_city,
      shipping_region,
      shipping_country,
      line_items } = order;

      let valid = !seller_store.length || !shipping_method.length || !external_order_number.length ||!buyer_full_name.length
                || !buyer_phone_number.length || !buyer_email.length || !shipping_address.length || !shipping_city.length
                || !shipping_region.length || !shipping_country.length || !line_items.length ;

      return valid;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    clientAxios.post('/orders', order).then( res => console.log(res) );

  }



  return (
    <Fragment>
      <h2> Create New Order </h2>
      <form
        onSubmit={handleSubmit}
      >
        <legend>
          
          <h3> General Info </h3>
        </legend>

        <div className="campo">
          <label>Seller Store:</label>
          <input
            type="text"
            placeholder="Seller Store Name..."
            name="seller_store"
            onChange={handleChange}
          />
        </div>

        <div className="campo">
          <label>Shipping Method:</label>
          <select name="shipping_method" onChange={handleChange}>
            <option defaultValue disabled> Select a shipping method </option>
            {
                shippingMethods.map( shipping => (
                    <option key={ shipping.id } value={ shipping.id } > { shipping.name } </option>
                ))
            }
          </select>
        </div>

        <div className="campo">
          <label>External Order Number:</label>
          <input
            type="number"
            placeholder="External Order Number..."
            name="external_order_number"
            onChange={handleChange}
          />
        </div>

        <legend>
          <h4> Buyer Info </h4>
        </legend>

        <div className="campo">
          <label> Full Name:</label>
          <input
            type="text"
            placeholder="Buyer Full Name..."
            name="buyer_full_name"
            onChange={handleChange}
          />
        </div>

        <div className="campo">
          <label> Phone Number:</label>
          <input
            type="tel"
            placeholder="Buyer Phone Number..."
            name="buyer_phone_number"
            onChange={handleChange}
          />
        </div>

        <div className="campo">
          <label> Email:</label>
          <input
            type="email"
            placeholder="Buyer Email..."
            name="buyer_email"
            onChange={handleChange}
          />
        </div>

        <legend>
          <h3> Shipping Info </h3>
        </legend>

        <div className="campo">
          <label> Address:</label>
          <input
            type="text"
            placeholder="Shipping Address..."
            name="shipping_address"
            onChange={handleChange}
          />
        </div>

        <div className="campo">
          <label> City:</label>
          <input
            type="text"
            placeholder="Shipping City..."
            name="shipping_city"
            onChange={handleChange}
          />
        </div>

        <div className="campo">
          <label> Region:</label>
          <input
            type="text"
            placeholder="Shipping Region..."
            name="shipping_region"
            onChange={handleChange}
          />
        </div>

        <div className="campo">
          <label> Country:</label>
          <input
            type="text"
            placeholder="Shipping Country..."
            name="shipping_country"
            onChange={handleChange}
          />
        </div>

        <legend>
          <h3> Line Items </h3>
        </legend>

        <div className="campo">
          <label> Item:</label>
          <input type="text" placeholder="Item..." name="line_items" onChange={handleChange} />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Create Order"
            disabled={ validateClient() }
          />
        </div>
      </form>
    </Fragment>
  );
};

export default OrderCreation;
