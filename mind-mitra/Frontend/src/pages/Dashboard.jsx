import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { FirebaseContext } from '../context/firebase';
import { FaUser, FaSmile, FaBook, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { MoodPieChart } from '../components/MoodPieChart.jsx';
import { JournalBarChart } from '../components/JournalBarChart.jsx';

function Dashboard() {
  const navigate = useNavigate();
  const {token, setLoggedIn, googleLoggedin, loggedIn, setGoogleLoggedin } = useContext(AuthContext);
  const { logoutGoogle } = useContext(FirebaseContext);

  const [activeTab, setActiveTab] = useState('profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [loading,setLoading]=useState(true)
  const [summary,setSummary]=useState({mood:{},journal:{}})

  const [weekMood, setWeekMood] = useState({});


  useEffect(()=>{
    const fetchSummary=async()=>{
      const res=await fetch("http://localhost:5000/api/summary",{
        headers:{
          Authorization:`Bearer ${token}`
        },
        
      })
      const data=await res.json();
      setSummary(data)
      setLoading(false)
    }
    const fetchWeekMood = async () => {
  const res = await fetch("http://localhost:5000/api/week-mood", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  setWeekMood(data.weekMood);
};

    if(loggedIn || googleLoggedin){
    fetchSummary()
  fetchWeekMood()}
    
  },[loggedIn,googleLoggedin,token])

  const handleLogout = () => {
    if (loggedIn) {
      localStorage.removeItem('token');
      setLoggedIn(false);
    } else if (googleLoggedin) {
      logoutGoogle();
      setGoogleLoggedin(false);
    }
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const navItems = [
    { key: 'profile', label: 'Your Profile', icon: <FaUser /> },
    { key: 'moods', label: 'Your Moods', icon: <FaSmile /> },
    { key: 'journals', label: 'Your Journals', icon: <FaBook /> },
    { key: 'stats', label: 'Statistics', icon: <FaChartBar /> },
  ];

  const tabVariants = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div className="pt-14 h-screen flex bg-gray-100 relative">
      <button
        className="fixed  top-4 pt-14 left-4 z-50 p-2 bg-green-700 text-white rounded-md "
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <div className="space-y-1">
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </div>
      </button>

      <aside
        className={`fixed top-0 left-0 h-screen z-40 bg-green-700 text-white transition-all duration-300 ease-in-out flex flex-col justify-between pl-4 pt-16
          ${isSidebarOpen ? 'w-64' : 'w-20'} }
        `}
        style={{ overflowX: 'hidden' }}
      >
        <div className='mb-10'>
          <h1
            className={` mb-20 px-2  ${
              isSidebarOpen ? 'opacity-0' : 'opacity-0'
            }`}
          >
            
          </h1>
          <nav className="flex flex-col text-lg space-y-4">
            {navItems.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setIsSidebarOpen(false);
                }}
                className={`relative flex items-center gap-3 transition-all duration-300 pl-3 py-2 rounded-l-full
                ${activeTab === key ? 'text-black bg-gray-100 font-semibold' : 'hover:text-yellow-300'}`}
              >
                <span className="text-xl">{icon}</span>
                {(isSidebarOpen) && (
                  <span className="transition-opacity duration-300">{label}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mt-10"
        >
          <FaSignOutAlt />
          {(isSidebarOpen ) && <span>Logout</span>}
        </button>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-[#cce7e2] bg-opacity-40 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <main
        className={`transition-all duration-300 ease-in-out flex-1 overflow-y-auto p-6 mt-16 md:mt-0
        ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}
      >
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={tabVariants}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-md">
      <h3 className="text-xl font-semibold mb-2">Mood Tracking (Weekly)</h3>
      <MoodPieChart moodSummary={summary.mood} />
    </div>

    <div className="bg-white rounded-xl p-6 shadow-md">
      <h3 className="text-xl font-semibold mb-2">Journal Entries (Weekly)</h3>
      <JournalBarChart journalSummary={summary.journal} />
    </div>
                <div className="bg-white rounded-xl p-6 shadow-md md:col-span-2">
                  <h3 className="text-xl font-semibold mb-2">Mood Trend (Last Week)</h3>
                  <div className="flex justify-between mt-4">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
  <div key={day} className="flex flex-col items-center">
    <div className="w-10 h-10 text-xl flex items-center justify-center rounded-full bg-green-100 border">
      {weekMood[day] || 'N/A'}
    </div>
    <span className="text-sm mt-1">{day}</span>
  </div>
))}

                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'moods' && (
            <motion.div
              key="moods"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={tabVariants}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-blue-800">Your Moods</h2>
              <p>Coming soon: Mood tracking view...</p>
            </motion.div>
          )}

          {activeTab === 'journals' && (
            <motion.div
              key="journals"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={tabVariants}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-purple-800">Your Journals</h2>
              <p>Coming soon: Journal entries and insights...</p>
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={tabVariants}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-green-800">Statistics</h2>
              <p>Coming soon: Charts and usage analytics...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default Dashboard;
