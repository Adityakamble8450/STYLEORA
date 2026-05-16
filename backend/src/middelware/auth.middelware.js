import jwt, { decode } from "jsonwebtoken";
import { config } from "../config/config.js";
import UserAuth from "../models/user.auth.model.js";

export const identifySeller = async (req, res, next) => {
    const token = req.cookies?.token

    if (!token) {
        return res.status(400).json({
            message: 'Unautorize'
        })
    }
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET)
        const user = await UserAuth.findById(decoded.user)

        if (!user) {
            return res.status(401).json({
                message: 'Unauthorize'
            })
        }

        if (user.role !== 'seller') {
            return res.status(403).json({
                message: 'Forbidden'
            })
        }

        req.user = user

        next()
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Unauthorize User' })
    }

}

export const indentifyUser = async (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(402).json({
            message: 'Unuthorize'
        })
    }
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET)
        const user = await UserAuth.findById(decoded.id)
        req.user = user
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'error in idientifying user',
            succese: false
        })
    }
}
