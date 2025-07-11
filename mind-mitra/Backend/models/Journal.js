import mongoose from 'mongoose'

const journalSchema=new mongoose.Schema({
    userId:{
        type:String,
        ref:'User',
        required:true
    },
    date:{
        type:String,
        required:true
    },
    journal:{
        type:String,
        required:true
    }
})

export const Journal=mongoose.model("Journal",journalSchema)