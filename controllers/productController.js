import Product from "../models/product.js";
import httpError from "../utils/httpError.js";

//Create Product

export const createProduct = async (req, res, next) => {

    try {

        if (!req.file || !req.file.path) {

            return next(new httpError("Product Image is required", 400))
        }

        const { name, price, stock } = req.body

        if (!name || !price || !stock) {

            return next(new httpError("All fields are Mandatary", 400))
        }

        const image = req.file.path.slice(8);

        const newProduct = new Product({ name , price, stock, image })
        await newProduct.save()

        res.status(201).json({message:"Product Added Successfully"})
        
    } catch (error) {

        return next(new httpError("Failed to Create Product. Please try Again", 500))
    }

}

//list all Products

export const listProducts = async (req, res, next) => {

    try {
        
        const products = await Product.find()
        res.status(200).json({ message:"", data: products })

    } catch (error) {

        return next(new httpError("Failed to List Product. Please try Again", 500))
    }
}


// Update Product

export const updateProduct = async (req, res, next) => {
    
    try {

        const { id } = req.params

        if (! id) {

            return next(new httpError("Product ID Required", 404))
        }

        const {name, price, stock} = req.body

        let image

        if (req.file && req.file.path) {

            image = req.file.path.slice(8);
        }

        const productData = {name, price, stock}

        if (image) {

            productData.image = image;
        }

        const product = await Product.findOneAndUpdate(
            { _id: id },
            { $set: productData },
            { new: true, runValidators: true }
        )

        if (! product) {

            return next(new httpError("Product not found", 404));
        }

        res.status(200).json({ message:"Product Updated Successfully" })
        
    } catch (error) {

        return next(new httpError("Failed to Update Product. Please try Again", 500))
    }

}


//Delete Product

export const deleteProduct = async (req, res, next) => {

    try {

        const { id } = req.params

        if (! id) {

            return next(new httpError("Product ID Required", 404))
        }

        const product = await Product.findOneAndDelete({ _id: id })

        if (! product) {

            return next(new httpError("Product not found", 404));
        }

        res.status(200).json({message:"Product Delete Successfully"})
        
    } catch (error) {

        return next(new httpError("Failed to Delete Product. Please try Again", 500))
    }

}