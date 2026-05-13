import jwt from "jsonwebtoken";
import { config } from "../src/config/config";
import UserAuth from "../src/models/user.auth.model";
export const identifySeller = async (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(400).json({
            message: 'Unautorize'
        })
    }
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET)
        const user = await UserAuth.findById(decoded.id)

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