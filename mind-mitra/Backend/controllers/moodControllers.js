import {Mood} from '../models/Mood.js'

export const getMood=async(req,res)=>{
    try{
        const moods=await Mood.find({userId:req.params.userId})
        res.json(moods)
    }
    catch(err){
        res.status(501).json({error:'Failed to fetch your moods'})
    }
}

export const postMood=async(req,res)=>{
    const {userId,date,mood}=req.body;
const existing = await Mood.findOne({ userId, date });

    if (existing) {
      existing.mood = mood;
      await existing.save();
      return res.json({ message: "Mood updated." });
    }
    try{
        
        const newMood=new Mood({userId,date,mood});
        await newMood.save()
        res.status(201).json({message:'Mood saved'})
    }
    catch (err){
        res.status(500).json({error:'Failed to save mood'})
    }
}