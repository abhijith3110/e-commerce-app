import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import { connectDB } from './configs/dbConfig.js'
import {notFound, errorHandler} from "./middlewares/errorMiddlerware.js"
import ProductRouter from './routes/productRoute.js'


const app = express()
dotenv.config()
const __dirname = path.resolve()
connectDB()

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/product/', ProductRouter)
app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 4501

app.listen(port, () => {
    console.log(`App is Running on PORT:- ${port}`);
})