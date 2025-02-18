import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(

    {

        name: {
            type: String,
            reqired: true
        },

        price: {
            type: Number,
            reqired: true
        },

        image: {
            type: String,
            reqired: true
        },

        stock: {
            type: Number,
            reqired: true,
        },

    },

    {
        timestamps: true
    }

)

const Product = mongoose.model('product', productSchema)

export default Product