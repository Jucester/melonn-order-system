const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    // Authorization
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        const error = new Error('No authenticated');
        error.statusCode = 401;
        throw error;
    }

    // get the token
    const token = authHeader.split(' ')[1];
    let checkToken;

    try {
        checkToken = jwt.verify(token, process.env.JWT_KEY);
        
        if(!checkToken) {
            const error = new Error('No authenticated');
            error.statusCode = 401;
            throw error;
        }

        req.user = checkToken.id;

        next();
    } catch (error) {
        console.log(error);
        error.statusCode = 500;
        throw error;
    }
    
}