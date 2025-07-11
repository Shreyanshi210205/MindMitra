import mongoose from "mongoose"

const moodSchema=new mongoose.Schema({
    userId:{
        type:String,
        ref:'User',
        required:true
    },
    date:{
        type:String,
        required:true
    },
    mood:{
        emoji:String,
        label:String
    },
    
})

export const Mood= mongoose.model("Mood",moodSchema)