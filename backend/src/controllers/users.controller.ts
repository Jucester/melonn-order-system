const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const controller = {};

// Json file to simulate database
// Path to the Json file to simulate database
let dbPath = process.env.NODE_ENV == 'development' ? 'src/database/users.json' : 'src/database/usersTest.json';
const json_users = fs.readFileSync(dbPath, 'utf-8');
let users = JSON.parse(json_users);

const User = {
    name: "",
    email: "",
    password: ""
}

controller.register = async (req, res) => {

    const user = {id: (Date.now() + Math.floor(Math.random() * 101) + 1).toString(), ...req.body };
    user.password = await bcrypt.hash(req.body.password, 12);

    try {

        const userRepeated = users.filter( user => user.email == req.body.email );

        if (userRepeated.length > 0) {
            return res.status(200).json({
                message: 'That email is already registered',
            });
        }

        users.push(user);
        const json_users = JSON.stringify(users);
        fs.writeFileSync(dbPath, json_users, 'utf-8');
        
        return res.status(201).json({
            message: 'User created',
            user,
        });

    } catch (err) {
        console.log(err);
        res.json({
            message: 'Something went wrong'
        })
    }

}

controller.login = (req, res) => {
    
    const { email, password } = req.body;

    let user = users.filter( user => user.email == email );

    if( user.length == 0) {
        return res.status(401).json({
            message: 'User does not exist'
        })
    }

    user = user[0]
 
    if(!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({
            message: 'Invalid password'
        })
    } else {
        
        let validUser = { id: user.id, email: user.email, name: user.name }

        const token = jwt.sign({ ...validUser}, 
        process.env.JWT_KEY, 
        {
            expiresIn: '1h'
        });

        return res.status(200).json({
            message: 'User logged',
            token,
            user: validUser
        })
    }

}



module.exports = controller;