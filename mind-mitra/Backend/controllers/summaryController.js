import { set } from "mongoose"
import { Journal } from "../models/Journal.js"
import { Mood } from "../models/Mood.js"

export const getSummary=async(req,res)=>{
    try {
        const userId=req.userId
console.log('Requested summary for user:', userId);

        const moodEntries=await Mood.find({userId})
        const journalEntries=await Journal.find({userId})

        const moodSummary=getWeeklySummary(moodEntries)
        const journalSummary=getWeeklySummary(journalEntries)

        res.json({mood:moodSummary,journal:journalSummary})

    } catch (error) {
        res.status(500).json({error:'Server error'})
    }
}

function getWeeklySummary(entries){
    const summary={}
    entries.forEach(element => {
        const week=getWeekLabel(element.date)
        const date=element.date.toISOString().split('T')[0]
        if(!summary[week]) summary[week]=new Set()
                summary[week].add(date)
        
    });
    for(let week in summary){
        summary[week]=summary[week].size
    }

    return summary;
}

function getWeekLabel(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const week = getWeekNumber(d);
  return `${year}-W${week}`;
}
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); 
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}