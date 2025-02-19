import express from 'express'
import { createProduct, deleteProduct, getOneProduct, listProducts, updateProduct } from '../controllers/productController.js'
import {uploadImage} from "../middlewares/fileUpload.js"

const ProductRouter = express.Router()

ProductRouter.get('/', listProducts)
ProductRouter.post('/', uploadImage.single('image'), createProduct)
ProductRouter.put('/:id', uploadImage.single('image'),updateProduct)
ProductRouter.delete('/:id', deleteProduct)
ProductRouter.get('/:id', getOneProduct)


export default ProductRouter