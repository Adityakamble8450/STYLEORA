import { body, validationResult } from "express-validator";

const validateReq = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    next()

}


export const registerUserValidator = [
    body("email").isEmail().withMessage('invalid Email format'),
    body("contact").notEmpty().withMessage('contact must not empty').matches(/^\d{10}$/).withMessage('Contact Must be 10-Digit Number'),
    body("password").isLength({ min: 6 }).withMessage('password must be longer than 6 degit'),
    body('fullname').notEmpty().withMessage("fullaname must not be empty").isLength({ min: 3 }).withMessage('Fullname must be at least 3 charectar long'),

    validateReq

]
