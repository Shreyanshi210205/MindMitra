import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors"
import {authRoutes} from './routes/authRoutes.js'
import { userRoutes } from "./routes/userRoutes.js";
import { rssRoutes } from "./routes/rssRoutes.js";
import {moodRoutes} from "./routes/moodRoutes.js"
import { journalRoutes } from "./routes/journalRoutes.js";

dotenv.config()
connectDB()

const app=express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));
app.use(express.json());

app.use('/api',authRoutes)
app.use('/api',userRoutes)
app.use('/api/articles',rssRoutes)
app.use('/api',moodRoutes)
app.use('/api',journalRoutes)

app.get('/',(req,res)=>{
    res.send("Backend is running")
})

const PORT=process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`Server running at port :${PORT}`)
})