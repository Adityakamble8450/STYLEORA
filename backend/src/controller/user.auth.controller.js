import UserAuth from "../models/user.auth.model.js";
import jwt from 'jsonwebtoken'
import { config } from "../config/config.js";

const tokenSend = async (user, res, message) => {
    const token = jwt.sign(
        { user: user._id },
        config.JWT_SECRET,
        { expiresIn: '7d' }
    )

    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
        message,
        success: true,
        token,
        user: {
            id: user._id,
            email: user.email,
            fullname: user.fullname,
            contact: user.contact
        }
    })
}


export const userRegister = async (req, res) => {
    const { email, contact, fullname, password , role } = req.body
    try {
        const existingUser = await UserAuth.findOne({
            $or: [
                { email },
                { contact }
            ]
        })
        if (existingUser) {
            return res.status(400).json({
                message: 'User Alredy exist'
            })
        }
        const user = await UserAuth.create({
            email,
            contact,
            fullname,
            password ,
            role
        })

        await tokenSend(user, res, 'User Regiater succesfully')

    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }



}

export const userLogin = async (req , res) =>{
    const {email , password} = req.body

    try{
        const userFound = await UserAuth.findOne({ email })

        if(!userFound){
            return res.status(400).json({
                message : 'User not found please Register first'
            })
        }

        const isPasswordCorrect = await userFound.comparePassword(password)

        if(!isPasswordCorrect){
            return res.status(400).json({
                message : 'Invalid password'
            })
        }

        await tokenSend(userFound, res, 'User logged in successfully')

    }catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}
