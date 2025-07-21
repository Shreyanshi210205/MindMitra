import { useContext, useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { AuthContext } from '../context/AuthContext';
import { FirebaseContext } from '../context/firebase';

const MoodTab = () => {
  const [moodDays, setMoodDays] = useState(0);
  const [moodTrend, setMoodTrend] = useState([]);

  const {user}=useContext(AuthContext)
    const {userGoogle}=useContext(FirebaseContext)
    const [userId,setUserId]=useState(null)

  const moodScale = {
    happy: 5,
    grateful: 4,
    neutral: 3,
    tired: 2,
    anxious: 1.5,
    sad: 1,
    angry: 0.5
  };

  
  useEffect(() => {
    const currentUserId = user?.uid || userGoogle?.uid;
  if (!currentUserId) return;
    const getMoodDays=async()=>{
      const res=await fetch(`http://localhost:5000/api/get-moodDays/${currentUserId}`)
      const data=await res.json();
      let cnt=0;
      data.forEach(()=>{
        cnt=cnt+1;
      })
      setMoodDays(cnt)
    }
    
    setUserId(currentUserId)
    getMoodDays()
    
  }, [userId,user,userGoogle]);

  
  useEffect(() => {
    const currentUserId = user?.uid || userGoogle?.uid;
  if (!currentUserId) return;
  const getMoodTrend=async()=>{
const res=await fetch(`http://localhost:5000/api/get-moodTrend/${currentUserId}`)
      const data=await res.json()
      
        const mapped = data.map(entry => {
  const cleanMood = entry.mood?.label?.toLowerCase().trim(); 

  return {
    date: new Date(entry.date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
    }),
    moodValue: moodScale[cleanMood] ?? 2.5,
    mood: cleanMood,
  };
});

        setMoodTrend(mapped);
  }
    setUserId(currentUserId)
    getMoodTrend();
  
  }, [userId,user,userGoogle]);

  const tabVariants = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <motion.div
      key="moods"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={tabVariants}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-blue-800">Your Moods</h2>

      <p className="mb-6 text-xl text-green-700">
        You have tracked your mood on <span className="font-bold">{moodDays}</span> days.
      </p>

      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold mb-4">Mood Trend Over Time</h3>
        {moodTrend.length === 0 ? (
          <p>No mood data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={moodTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                domain={[0, 5]}
                tickFormatter={(val) => {
                  const mood = Object.entries(moodScale).find(([_, v]) => v === val);
                  return mood ? mood[0] : '';
                }}
              />
              <Tooltip formatter={(value, name) => [`Mood Level: ${value}`, '']} />
              <Legend />
              <Line
                type="monotone"
                dataKey="moodValue"
                stroke="#2563EB"
                strokeWidth={2}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      <NavLink to="/mood-track">
      <button className='m-10 flex flex-col items-center justify-center text-xl bg-pink-300 font-bold rounded-xl cursor-pointer p-2'>Track Your Mood Now</button>
      </NavLink>
    </motion.div>
  );
};

export default MoodTab;
