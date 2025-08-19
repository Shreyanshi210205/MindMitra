import React, { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { AuthContext } from "../context/AuthContext";
import { FirebaseContext } from "../context/firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Journal = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [journalText, setJournalText] = useState("");
  const [savedEntries, setSavedEntries] = useState({});
  const [userId,setUserId]=useState(null) 
  const {user,loggedIn,googleLoggedIn}=useContext(AuthContext)
  const {userGoogle}=useContext(FirebaseContext)

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); 
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const navigate=useNavigate()

useEffect(()=>{
  if(!loggedIn || !googleLoggedIn){
    navigate("/login")
    toast.error('PLEASE LOGIN FIRST')
  }
  const currentUserId = user?.uid || userGoogle?.uid;
  if (!currentUserId) return;
  else setUserId(currentUserId)
  const getJournals=async()=>{
    const res =await fetch(`https://mindmitra-jhfv.onrender.com/api/get-journal/${currentUserId}`)
    const journalMap={}
    const data=await res.json();
    data.forEach(element => {
      journalMap[element.date]=element.journal
    });
    setSavedEntries(journalMap)
    
  }
  setUserId(currentUserId)
  getJournals()
},[user,userGoogle])

useEffect(()=>{
if(savedEntries[formatDate(selectedDate)])
    setJournalText(savedEntries[formatDate(selectedDate)])
},[savedEntries,selectedDate])

  const handleSave = async() => {
    const key = formatDate(selectedDate);
    console.log(key)
    if(key!=formatDate(new Date)){
        alert("You can only write today's journal!")
        return;
    }
    if(journalText==="") {
      alert('Write something in your journal')
      return;
    }
    
    if (journalText.trim() !== "" && key==formatDate(new Date)) {
      setSavedEntries((prev) => ({
        ...prev,
        [key]: journalText.trim(),
      }));
      try{
        await fetch('https://mindmitra-jhfv.onrender.com/api/post-journal',{
          method:'POST',
          headers:{
            'Content-type':'application/json'
          },
          body:JSON.stringify({userId,date:key,journal:journalText.trim()})
        })
          alert("Journal saved!");
      }
      catch(err){
        console.error('Failed to post journal',err)
      }
      
    }
    
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const key = formatDate(date);
    setJournalText(savedEntries[key] || "");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#cce7e2] py-10 px-4">
  <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-3xl shadow-xl">
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4 text-pink-600">Your Journal Calendar</h2>
      <Calendar
        maxDate={new Date()}
        onChange={handleDateChange}
        value={selectedDate}
        tileContent={({ date }) => {
          const key = formatDate(date);
          return savedEntries[key] ? (
            <span className="text-green-500 text-xs ml-1">✅</span>
          ) : null;
        }}
        className="rounded-xl border border-gray-300 p-2 w-full max-w-xs"
      />
    </div>

    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-700">
        Journal Entry for {formatDate(selectedDate)}
      </h2>
      {(savedEntries[formatDate(selectedDate)] || formatDate(selectedDate) === formatDate(new Date())) ? (
        <textarea
          rows={10}
          className="border bg-white border-gray-300 rounded-xl p-4 text-md resize-none outline-none focus:ring-2 focus:ring-pink-300"
          placeholder="Write your thoughts here..."
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          disabled={formatDate(selectedDate) !== formatDate(new Date())}
        ></textarea>
      ) : (
        <div className="text-gray-400 bg-white rounded-xl p-3">
          You didn't journal this day
        </div>
      )}

      <button
        onClick={handleSave}
        className="bg-pink-600 text-white py-3 px-5 rounded-full font-semibold hover:bg-pink-700 transition disabled:opacity-50"
        disabled={formatDate(selectedDate) !== formatDate(new Date())}
      >
        Save Journal
      </button>
    </div>
  </div>
</div>

  );
};

export default Journal;
