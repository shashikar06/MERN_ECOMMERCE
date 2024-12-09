import path, { dirname } from 'path'
import express from "express";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
dotenv.config();
import connectDB from "./config/db.js";
import multer from "multer";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js'
import uploadroutes from './routes/uploadRoutes.js';
import { fileURLToPath } from 'url';
connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended : false}));
app.use(cookieParser());

const port = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use('/api/products',productRoutes);
app.use('/api/users',userRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/upload', uploadroutes);
app.get('/api/config/paypal', (req,res) => res.send({clientId: process.env.PAYPAL_CLIENT_ID}))

app.use(express.static(path.join(__dirname, '/frontend/dist')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );

app.use(notFound);
app.use(errorHandler);
  


























app.listen(port,() => {
    console.log(`SERVER LISTENING ON ${port}`)
})