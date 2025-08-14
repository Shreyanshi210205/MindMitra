import { useEffect, useState, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { AuthContext } from '../context/AuthContext';
import { FirebaseContext } from '../context/firebase';


const StatsTab = () => {
  const { user } = useContext(AuthContext);
  const { userGoogle } = useContext(FirebaseContext);

  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    const currentUserId = user?.uid || userGoogle?.uid;
    if (!currentUserId) return;

    const fetchData = async () => {
      try {
        const [moodRes, journalRes] = await Promise.all([
          fetch(`https://mindmitra-jhfv.onrender.com/api/get-moodTrend/${currentUserId}`),
          fetch(`https://mindmitra-jhfv.onrender.com/api/get-journalEntries/${currentUserId}`)
        ]);

        const moodDataRaw = await moodRes.json();
        const journalDataRaw = await journalRes.json();

        const moodMap = {};
        moodDataRaw.forEach(entry => {
          const date = new Date(entry.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
          
          moodMap[date] = 1;
        });

        const journalMap = {};
        journalDataRaw.forEach(entry => {
          const date = new Date(entry.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
          journalMap[date] = 1;
        });

        const allDates = new Set([...Object.keys(moodMap), ...Object.keys(journalMap)]);
        const combined = Array.from(allDates).map(date => ({
          date,
          moodValue: moodMap[date] ?? 0,
          journaled: journalMap[date] ?? 0
        })).sort((a, b) => new Date(a.date) - new Date(b.date));
        
        const today = new Date();
const last7Days = Array.from({ length: 7 }).map((_, i) => {
  const d = new Date(today);
  d.setDate(d.getDate() - i);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
});

const filteredCombined = combined.filter(d => last7Days.includes(d.date));
setCombinedData(filteredCombined);

      } catch (error) {
        console.error('Error fetching mood or journal data:', error);
      }
    };

    fetchData();
  }, [user, userGoogle]);

 return (
  <div className="bg-white p-6 rounded-xl shadow-md max-w-5xl mx-auto mt-8">
    <h3 className="text-xl font-semibold mb-4 text-blue-800">Mood vs Journal Activity (Past Days)</h3>

    {combinedData.length === 0 ? (
      <p className="text-gray-500 italic">No mood or journal data available to compare.</p>
    ) : (
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={combinedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            domain={[0, 1]}
            ticks={[0, 1]}
            tickFormatter={(val) => (val === 1 ? 'Yes' : 'No')}
            label={{ value: 'Logged', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value, name) =>
              name === 'Mood' ? [`${value ? 'Logged' : 'Not Logged'}`, 'Mood'] :
              [`${value ? 'Written' : 'Not Written'}`, 'Journal']
            }
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="moodValue"
            name="Mood"
            stroke="#4F46E5"
            strokeWidth={2}
            dot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="journaled"
            name="Journal"
            stroke="#10B981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    )}
  </div>
);

};

export default StatsTab;
