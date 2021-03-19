import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from "./components/layout/Header";
import Sidenav from "./components/layout/Sidenav";

import Orders from "./components/orders/Orders";
import OrderCreate from "./components/orders/OrderCreate";
import Products from "./components/products/Products";
import Configs from "./components/configs/Configs";
import OrderDetails from "./components/orders/OrderDetails";

function App() {
  return (
    <Router>
      <Fragment>
        <Header />
        <div className="grid contenedor contenido-principal">
          <Sidenav />

          <main className="caja-contenido col-9">
            <Switch>
              <Route exact path="/" component={Orders} />
              <Route exact path="/order/create" component={OrderCreate} />
              <Route exact path="/order/details/:id" component={OrderDetails} />
              <Route exact path="/products" component={Products} />
              <Route exact path="/configs" component={Configs} />
            </Switch>
          </main>
        </div>
      </Fragment>
    </Router>
  );
}

export default App;
