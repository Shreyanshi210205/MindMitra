import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export function JournalBarChart({ journalSummary }) {
  const chartData =
    journalSummary && Object.keys(journalSummary).length > 0
      ? Object.entries(journalSummary).map(([week, count]) => ({
          week,
          count,
        }))
      : [];

  if (chartData.length === 0) {
    return <p className="text-gray-500 text-center">No journal entries made yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#4CAF50" />
      </BarChart>
    </ResponsiveContainer>
  );
}
