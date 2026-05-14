import { uploadFiles } from '../services/store.service.js'
import ProductModel from '../models/products.model.js'

export const createProduct = async (req, res) => {
    try {
        const { title, description, price } = req.body
        const seller = req.user
        const files = req.files || []

        if (!files.length) {
            return res.status(400).json({
                success: false,
                message: 'At least one product image is required'
            })
        }

        const images = await Promise.all(files.map(async (file) => {
            return uploadFiles({
                buffer: file.buffer,
                filename: file.originalname
            })
        }))

        const product = await ProductModel.create({
            title,
            description,
            price: {
                amount: Number(price),
                currency: 'INR'
            },
            images,
            seller: seller._id
        })

        res.status(201).json({
            message: 'Product created successfully',
            success: true,
            product
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create product'
        })
    }
}

export const getProducts = async (req, res) => {
    const seller = req.user

    if (!seller) {
        return res.status(402).json({
            message: 'only seller can accese this product',
            success: false
        })
    }
    try {
        const products = await ProductModel.findById(seller.id)

        res.status(201).json({
            message: 'Product featch succesfully',
            success: true,
            products
        })

    } catch (error) {
        console.log(error)
        res.status(402).json({
            message: 'error in featching products',
            success: false
        }
        )

    }
}

