import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#00C49F', '#FF8042', '#8884d8'];

export  function MoodPieChart({ moodSummary }) {
  // Fallback in case moodSummary is undefined/null
  const safeData = moodSummary && Object.keys(moodSummary).length > 0
    ? Object.entries(moodSummary).map(([week, count]) => ({
        name: week,
        value: count,
      }))
    : [];

  if (safeData.length === 0) {
    return <p className="text-gray-500 text-center">No mood entries made yet.</p>;
  }

  return (
    <PieChart width={300} height={300}>
      <Pie
        data={safeData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
        label
      >
        {safeData.map((_, index) => (
          <Cell key={index} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}
