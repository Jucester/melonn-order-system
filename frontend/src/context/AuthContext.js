import React, { useState } from 'react';

const AuthContext = React.createContext([ {}, () => {} ]);


const AuthProvider = props => {

    const [auth, saveAuth ] = useState({
        token: '',
        auth: false,
        authenticatedUser: {
            id: '',
            email: '',
            name: ''
        }
    });

    return (
        <AuthContext.Provider value={[ auth, saveAuth ]}>
            { props.children }
        </AuthContext.Provider>
    )

}

export { AuthContext, AuthProvider }