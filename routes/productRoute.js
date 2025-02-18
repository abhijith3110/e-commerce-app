import express from 'express'
import { createProduct, deleteProduct, listProducts, updateProduct } from '../controllers/productController.js'

const ProductRouter = express.Router()

ProductRouter.get('/', listProducts)
ProductRouter.post('/', createProduct)
ProductRouter.put('/:id', updateProduct)
ProductRouter.delete('/:id', deleteProduct)


export default ProductRouter