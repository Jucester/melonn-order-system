import { RequestHandler } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


export const register: RequestHandler = async (req, res) => {

    //const user = {id: (Date.now() + Math.floor(Math.random() * 101) + 1).toString(), ...req.body };
    
    const { email, password } = req.body;

    try {

        const userRepeated = await User.findOne( { email: email } );

        if (userRepeated) {
            return res.status(200).json({
                message: 'That email is already registered',
            });
        }

        let user: IUser = new User(req.body);
        const salt = await bcrypt.genSaltSync(12);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
      
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

export const login: RequestHandler = async (req, res) => {
    
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if(!user) {
        return res.status(401).json({
            message: 'User does not exists'
        });
    }

    if(!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({
            message: 'Invalid password'
        })
    } else {
        
        const payload = {
            user: {
                id: user.id,
                email: user.email,
                username: user.username
            }
        }


        const token = jwt.sign(
                payload, 
                process.env.JWT_KEY || 'default_token', 
                {
                    expiresIn: '1h'
                }
        );

        return res.status(200).json({
            message: 'User logged',
            token,
            user: payload
        })
    }

}