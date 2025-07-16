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

        return res.json({mood:moodSummary,journal:journalSummary})

    } catch (error) {
        res.status(500).json({error:'Server error'})
    }
}

function getWeeklySummary(entries) {
  const summary = {};

  entries.forEach((element, index) => {
    try {
      const dateObj = new Date(element.date);
      const week = getWeekLabel(dateObj);
      const date = dateObj.toISOString().split("T")[0];

      if (!summary[week]) summary[week] = new Set();
      summary[week].add(date);
    } catch (e) {
      console.error("Error in getWeeklySummary:", e.message, element);
    }
  });

  for (let week in summary) {
    summary[week] = summary[week].size;
  }

  return summary;
}



function getWeekLabel(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const week = getWeekNumber(d);
  return `${year}-W${week}`;
}


function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}


export const getWeekMood = async (req, res) => {
  try {
    const userId = req.userId;

    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

    // Get Monday of current week
    const monday = new Date(today);
    const diffToMonday = (currentDay + 6) % 7; // if today is Monday, 0; if Sunday, 6
    monday.setDate(today.getDate() - diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const allMoods = await Mood.find({ userId });

const moods = allMoods.filter(entry => {
  const entryDate = new Date(entry.date);
  return entryDate >= monday && entryDate <= sunday;
});


    // Prepare map: day name -> mood emoji
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const moodMap = {};

    // Default all to 'N/A'
    daysOfWeek.forEach((day) => {
      moodMap[day] = 'N/A';
    });

    moods.forEach((entry) => {
      const date = new Date(entry.date);
      const dayIndex = (date.getDay() + 6) % 7; // Adjust so Monday = 0, Sunday = 6
      const dayName = daysOfWeek[dayIndex];
      moodMap[dayName] = entry.mood?.emoji || '❌';
    });

    res.json({ weekMood: moodMap });
  } catch (error) {
    console.error("Error in getWeekMood:", error);
    res.status(500).json({ error: 'Server error' });
  }
};