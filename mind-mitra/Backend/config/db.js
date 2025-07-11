import mongoose from 'mongoose'
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.DB_URL)
        console.log("database connected")
    }
    catch(err){
        console.error("Connection error:",err.message)
        process.exit(1)
    }
}
export default connectDB