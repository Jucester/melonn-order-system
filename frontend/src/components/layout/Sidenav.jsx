import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Sidenav = () => {

    const [auth, saveAuth] = useContext(AuthContext);

    if(!auth.auth) return null;

    return ( 
        
        <aside className="sidenav col-3">
            <h2> Menu </h2>
           
            <nav className="nav">
                <Link to={"/"} className="orders"> Order List </Link>
    
            </nav>
        </aside>
     );
}
 
export default Sidenav;