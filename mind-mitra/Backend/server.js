import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors"
import {authRoutes} from './routes/authRoutes.js'
import { userRoutes } from "./routes/userRoutes.js";
import { rssRoutes } from "./routes/rssRoutes.js";
import {moodRoutes} from "./routes/moodRoutes.js"
import { journalRoutes } from "./routes/journalRoutes.js";
import { emailRoutes } from "./routes/emailRoutes.js";
import { summaryRoutes } from "./routes/summaryRoutes.js";

dotenv.config()
connectDB()

const app=express();

app.use(cors({
  origin:[ 'http://localhost:5173','https://mind-mitra-one.vercel.app/'], 
  credentials: true
}));
app.use(express.json());

app.use('/api',authRoutes)
app.use('/api',userRoutes)
app.use('/api/articles',rssRoutes)
app.use('/api',moodRoutes)
app.use('/api',journalRoutes)
app.use('/api',emailRoutes)
app.use('/api',summaryRoutes)

app.get('/',(req,res)=>{
    res.send("Backend is running")
})

const PORT=process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`Server running at port :${PORT}`)
})