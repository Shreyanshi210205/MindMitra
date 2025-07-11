import {Journal} from '../models/Journal.js'

export const postJournal=async(req,res)=>{
    const {userId,date,journal}=req.body;
    try {
        const existing=await Journal.findOne({userId,date});
        if(existing){
            existing.journal=journal;
            await existing.save()
            return res.status(201).json({message:'Journal saved'})
        }
        const newJournal=new Journal({userId,date,journal})
        await newJournal.save()
        res.status(201).json({message:'Journal saved'})
    } catch (error) {
        res.status(500).json({error:'Failed to save journal'})
    }
}

export const getJournal=async(req,res)=>{
    try{
        const journals=await Journal.find({userId:req.params.userId})
        res.status(201).json(journals)
    }
    catch(err){
        res.status(501).json({message:'Failed to get journal'})
    }
}