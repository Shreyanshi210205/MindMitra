// MoodInsights.jsx

import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom"; 
import { URL } from "../chatbot"; 
import ReactMarkdown from 'react-markdown'

const MoodInsight = () => {
  const location = useLocation();
  const { mood } = location.state || {}; 

  const [suggestions, setSuggestions] = useState("");

  useEffect(() => {
    const getSuggestions = async () => {
      const prompt = `I am feeling ${mood.label}. Suggest some steps to manage or improve this mood.`;

      const payload = {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      };

      const res = await fetch(URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      setSuggestions(reply);
    };

    if (mood) getSuggestions();
  }, [mood]);

  return (
    <div className="p-8 pt-25 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Mood: <span className="capitalize">You are {mood.label} {mood.emoji}</span></h2>

      <div className="bg-gray-100 p-4 rounded-xl shadow-sm mb-6">
        <h3 className="  mb-2 font-bold text-xl text-pink-700">Suggested Steps:</h3>
        {suggestions ? (
          <ReactMarkdown >{suggestions}</ReactMarkdown>
        ) : (
          <p className="text-sm text-gray-400">Fetching suggestions...</p>
        )}
      </div>
<NavLink to='/journal'>
      <button className="bg-pink-600 text-white px-5 py-2 rounded-full hover:bg-pink-700 transition">
        Go to Journal →
      </button>
      </NavLink>
    </div>
  );
};

export default MoodInsight;
