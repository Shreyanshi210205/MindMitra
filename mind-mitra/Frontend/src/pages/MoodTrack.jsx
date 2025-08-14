import React, { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FirebaseContext } from "../context/firebase";
import toast from "react-hot-toast";

const moods = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😠", label: "Angry" },
  { emoji: "😰", label: "Anxious" },
  { emoji: "😴", label: "Tired" },
  { emoji: "😇", label: "Grateful" },
];

const MoodTrack = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [savedMood,setSavedMood]=useState({});

  

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); 
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
  const navigate=useNavigate()
  const {user,loggedIn,googleLoggedIn}=useContext(AuthContext)
  const {userGoogle}=useContext(FirebaseContext)
  const [userId,setUserId]=useState(null)

useEffect(() => {
  if(!loggedIn && !googleLoggedIn){
    
    navigate('/login')
    toast.error('PLEASE LOGIN FIRST!!')
    
  }
  const currentUserId = user?.uid || userGoogle?.uid;
  if (!currentUserId) {
    navigate('/login')
    return;}
  const getMoods = async () => {
    try {
      const res = await fetch(`https://mindmitra-jhfv.onrender.com/api/get-mood/${currentUserId}`);
      const data = await res.json();
      const moodMap = {};
      data.forEach((element) => {
        moodMap[element.date] = element.mood;
      });
      setSavedMood(moodMap);
    } catch (err) {
      console.error("Failed to fetch moods:", err);
    }
  };

  setUserId(currentUserId); 
  getMoods();
}, [user, userGoogle]);




  const handleSave=async()=>{
    const key=formatDate(selectedDate)
    if(key!=formatDate(new Date) ){
        alert("You can only save today's mood!!")
        return;
    }
    if(!selectedMood) {
      alert("Select your mood")
      return
    }
    if(selectedMood &&  key==formatDate(new Date))
    {
      setSavedMood((prev)=>({
        ...prev,
        [key]:selectedMood
      }))
      try{
        await fetch('https://mindmitra-jhfv.onrender.com/api/post-mood',{
          method:'POST',
          headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({userId,date:key,mood:selectedMood})
        })
        alert('Yoour mood saved')
      }
    
    catch(err){
      console.error(err)
    }
  }}

  const trackMood=()=>{
    if(!selectedMood || !savedMood[formatDate(selectedDate)]){
      alert("Select or save your mood first")
      return
    }
    navigate('/mood-insight',{state:{mood:selectedMood}})
  }

  return (
    <div className="pt-25 max-w-4xl mx-auto p-6 shadow-2xl rounded-3xl bg-white">
      <h1 className="text-2xl font-bold text-center mb-6 text-pink-600">What's your mood today?</h1>
    <div className="flex flex-col">
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {moods.map((mood, index) => (
          <button
            key={index}
            onClick={() => setSelectedMood(mood)}
            className={`text-3xl p-4 rounded-full border-2 ${
              selectedMood?.label === mood.label ? "bg-pink-100 border-pink-500" : "border-gray-300"
            } hover:scale-105 transition`}
          >
            {mood.emoji}
          </button>
        ))}
      </div>
      <button 
      onClick={handleSave}
      className="text-center rounded-3xl text-white py-3 px-3 mb-2 bg-pink-600 hover:bg-pink-700 font-semibold">
        Save
        </button>
</div>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Mood Calendar</h2>
          <Calendar
          maxDate={new Date()}
            onChange={setSelectedDate}
            value={selectedDate}
            className="rounded-xl border border-gray-300 p-2"
            tileContent={({ date}) => {
            const key = formatDate(date);
            return savedMood[key] ? (
              <span className="text-green-500 text-xs ml-1">{savedMood[key]?.emoji}</span>
            ) : null;
          }}
          />
        </div>

        

        <div className="flex flex-col gap-4">
          <button
          onClick={trackMood}
            className="bg-pink-600 text-white py-3 px-5 rounded-full font-semibold hover:bg-pink-700 transition"
          >
            Track Mood
          </button>


          <div className="mt-6 text-center bg-pink-50 p-4 rounded-xl border border-pink-200">
            <p className="text-gray-700 mb-2 font-medium">
              Tracked your mood? Great! Let’s journal to understand it better. 💬
            </p>
            <a
              href="/journal"
              className="text-pink-600 font-semibold underline hover:text-pink-800"
            >
              Start Journaling →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTrack;
