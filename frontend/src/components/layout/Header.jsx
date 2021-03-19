import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';

const Header = (props) => {

    const [auth, saveAuth] = useContext(AuthContext);

    const logout = () => {
        saveAuth({
            token: '',
            auth: false,
            authenticatedUser: {
                id: '',
                email: '',
                name: ''
            }
        })

        localStorage.setItem('token', '');

        props.history.push('/');
    }  

    return (
        <header className="barra">
            <div className="contenedor">
                <div className="contenido-barra">
                    <h1> Melonn - Order Management System </h1>

                    { auth.auth ? (   
                        <button
                            type="button"
                            className="btn btn-rojo"
                            onClick={ logout }
                        >
                            <i className="far fa-times-circle"></i>
                            Logout
                        </button>
                    ) 
                        : null 
                    }
                 
                </div>
              
            </div>
        </header>
    )
}


export default withRouter(Header);