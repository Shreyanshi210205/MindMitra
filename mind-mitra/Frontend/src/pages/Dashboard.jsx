import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { FirebaseContext } from '../context/firebase';
import { FaUser, FaSmile, FaBook, FaChartBar, FaSignOutAlt } from 'react-icons/fa';

function Dashboard() {
  const navigate = useNavigate();
  const { setLoggedIn, googleLoggedin, loggedIn, setGoogleLoggedin } = useContext(AuthContext);
  const { logoutGoogle } = useContext(FirebaseContext);

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

  return (
    <div className="pt-14 flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-700 text-white p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-10">MindMitra</h1>
          <nav className="flex flex-col space-y-6 text-lg">
            <a href="#" className="flex items-center gap-3 hover:text-yellow-300">
              <FaUser /> Your Profile
            </a>
            <a href="#" className="flex items-center gap-3 hover:text-yellow-300">
              <FaSmile /> Your Moods
            </a>
            <a href="#" className="flex items-center gap-3 hover:text-yellow-300">
              <FaBook /> Your Journals
            </a>
            <a href="#" className="flex items-center gap-3 hover:text-yellow-300">
              <FaChartBar /> Statistics
            </a>
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mt-10"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Profile</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Chart Card */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-2">Journaling (per week)</h3>
            <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600">
              Bar Chart Placeholder
            </div>
          </div>

          {/* Pie Chart Card */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-2">Mood Tracking Share</h3>
            <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600">
              Pie Chart Placeholder
            </div>
          </div>

          {/* Mood Dot Graph */}
          <div className="bg-white rounded-xl p-6 shadow-md md:col-span-2">
            <h3 className="text-xl font-semibold mb-2">Mood Trend (Last Week)</h3>
            <div className="flex justify-between mt-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-400"></div>
                  <span className="text-sm mt-1">{day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
