import React from 'react';
import { Link } from 'react-router-dom';

const Sidenav = () => {
    return ( 
        <aside className="sidenav col-3">
            <h2> Menu </h2>

            <nav className="nav">
                <Link to={"/"} className="orders"> Order List </Link>
             {  /* <Link to={"/products"} className="productos"> Products </Link>
                <Link to={"/configs"} className="pedidos"> Configs </Link> */}
            </nav>
        </aside>
     );
}
 
export default Sidenav;