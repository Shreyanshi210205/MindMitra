import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { FirebaseContext } from '../context/firebase';

const JournalTab = () => {
  const { user } = useContext(AuthContext);
  const { userGoogle } = useContext(FirebaseContext);

  const [journalCount, setJournalCount] = useState(0);
  const [lastEntry, setLastEntry] = useState(null);
  const [streak, setStreak] = useState(0);
  const [totalWords, setTotalWords] = useState(0);

  useEffect(() => {
    const currentUserId = user?.uid || userGoogle?.uid;
    if (!currentUserId) return;

    const fetchJournalStats = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/get-journalTrend/${currentUserId}`);
        const data = await res.json();

        setJournalCount(data.count);
        setLastEntry(data.lastEntry);
        setStreak(data.streak);
        setTotalWords(data.totalWords);
      } catch (err) {
        console.error('Error fetching journal stats:', err);
      }
    };

    fetchJournalStats();
  }, [user, userGoogle]);

  const tabVariants = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <motion.div
      key="journal"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={tabVariants}
      transition={{ duration: 0.4 }}
      className=" mx-auto px-6 py-8"
    >
      <h2 className="text-3xl font-bold mb-6 text-indigo-800">Your Journal</h2>

      <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <p className="text-xl">🗓 You’ve journaled on <span className="font-bold">{journalCount}</span> days!</p>

        {lastEntry ? (
          <div>
            <p className="text-lg font-medium">📖 Last Entry: {new Date(lastEntry.date).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}</p>
            <p className="text-gray-700">📝 “{lastEntry.snippet}...”</p>
          </div>
        ) : (
          <p className="text-gray-500 italic">No entries yet. Start writing today!</p>
        )}

        <p className="text-lg">🔥 Streak: <span className="font-semibold">{streak}</span> days in a row!</p>
        <p className="text-lg">✍️ Total words written: <span className="font-semibold">{totalWords}</span></p>
      </div>

      <div className="mt-6">
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition-all">
          + New Journal Entry
        </button>
      </div>
    </motion.div>
  );
};

export default JournalTab;
