import { uploadFiles } from '../services/store.service.js'
import ProductModel from '../models/products.model.js'

const parseVariantAttributes = (body) => {
    if (body.attribute) {
        try {
            const parsed = JSON.parse(body.attribute)
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                return parsed
            }
        } catch (error) {
            throw new Error('Invalid attribute payload')
        }
    }

    if (body.attributes) {
        try {
            const parsed = JSON.parse(body.attributes)
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                return parsed
            }
        } catch (error) {
            throw new Error('Invalid attributes payload')
        }
    }

    if (body.attributeKey && body.attributeValue) {
        return {
            [String(body.attributeKey).trim()]: String(body.attributeValue).trim()
        }
    }

    return {}
}

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
        const products = await ProductModel.find({ seller: seller.id }).sort({ createdAt: -1 })

        res.status(200).json({
            message: 'Products fetched successfully',
            success: true,
            products
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Error in fetching products',
            success: false
        }
        )

    }
}

export const getAllProducts = async (req , res) =>{
    try{
        const allProduct = await ProductModel.find().sort({ createdAt: -1 })
        res.status(200).json({
            message : 'All Product featch succesfully' ,
            success : true ,
            products: allProduct,
            allProduct
        })
    }catch(error) {
        res.status(401).json({
            message : error.message ,
            success : false
        })

    }

}

export const getProductDetails = async (req, res) => {
    const {  productId } = req.params

    try {
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product id is required'
            })
        }

        const product = await ProductModel.findById(productId)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Product details fetched successfully',
            product
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch product details'
        })
    }
}

export const addVeriants = async (req , res) =>{
    try {
        const productId = req.params.productId

        const product = await ProductModel.findOne({
            _id : productId , 
            seller : req.user._id
        })

        if(!product){
            return res.status(404).json({
                message : 'Product Not Found' ,
                success : false
            })
        }

        const files = req.files || []
        const images = files.length
            ? await Promise.all(files.map(async (file) => {
                return uploadFiles({
                    buffer: file.buffer,
                    filename: file.originalname
                })
            }))
            : []

        const priceAmount = Number(req.body.priceAmount)
        const stock = Number(req.body.stock)
        const attributes = parseVariantAttributes(req.body)

        product.variants.push({
            sku: req.body.sku || undefined,
            images,
            price: {
                amount: Number.isFinite(priceAmount) && priceAmount > 0 ? priceAmount : product.price.amount,
                currency: req.body.priceCurrency || product.price.currency || 'INR'
            },
            stock: Number.isFinite(stock) && stock >= 0 ? stock : 0,
            attributes
        })

        await product.save()

        res.status(200).json({
            message : 'succsfully add veriant' ,
            success : true ,
            product
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to add variant'
        })
    }

}
