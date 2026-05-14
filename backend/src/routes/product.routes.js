import express from 'express'
import { identifySeller } from '../middelware/auth.middelware.js'
import { createProduct , getProducts } from '../controller/products.controller.js'
import { createProductValidator } from '../validetors/product.validator.js'
const ProductRoutes = express.Router()
import multer from 'multer'

const storage = multer.memoryStorage()
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']

const upload = multer({
  storage,
  limits: {
    files: 7,
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPG, JPEG, PNG, and WEBP images are allowed'))
    }

    cb(null, true)
  }
})

ProductRoutes.post(
  '/create',
  identifySeller,
  upload.array('images', 7),
  createProductValidator,
  createProduct
)

ProductRoutes.get('/seller' , identifySeller , getProducts)



export default ProductRoutes


