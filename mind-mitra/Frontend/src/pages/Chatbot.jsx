import React, { useState, useRef } from "react";
import {URL} from '../../src/chatbot'
import ReactMarkdown from 'react-markdown'

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi there! 👋 How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [result,setResult]=useState(undefined)
  const messagesEndRef = useRef(null);
  const [showFetch,setShowFetch]=useState(false);

  // const fetchRes={sender:"bot",text:"Fetching response..."}

  const mentalHealthKeywords = [
  // Core terms
  "mental health", "depression", "anxiety", "stress", "trauma", "therapy",
  "counseling", "psychologist", "psychiatrist", "well-being", "self-care",
  "mental illness", "panic", "disorder", "sad", "feeling down", "feeling low",
  "emotion", "emotional", "mood", "overwhelmed", "hopeless", "helpless","sad",

  // Specific disorders and conditions
  "bipolar", "schizophrenia", "ocd", "ptsd", "adhd", "eating disorder",
  "bulimia", "anorexia", "insomnia", "sleep disorder", "phobia", "social anxiety",
  "intrusive thoughts", "mania", "hypomania", "dissociation", "paranoia",

  // Suicidal ideation and crisis
  "suicidal", "suicide", "want to die", "kill myself", "ending my life",
  "crisis", "self harm", "cutting", "hurting myself",

  // Therapy and support
  "therapy", "therapist", "support group", "mental support", "talk to someone",
  "need help", "counselor", "psychotherapy", "cbt", "mental exercises",

  // Life challenges that affect mental health
  "breakup", "grief", "loss", "death", "lonely", "isolation", "family issues",
  "relationship problems", "divorce", "academic stress", "work stress", "burnout",
  "career anxiety", "exams", "pressure", "peer pressure", "financial stress",

  // Wellness and coping strategies
  "mindfulness", "meditation", "journaling", "deep breathing", "relaxation",
  "grounding", "self compassion", "healing", "coping", "safe space",

  // Feelings & emotional vocabulary
  "worthless", "useless", "angry", "fear", "worried", "scared", "numb", "crying",
  "tears", "frustrated", "anxious", "guilt", "shame", "regret", "emptiness",

  // Related medical/diagnostic terms
  "mental disorder", "clinical", "diagnosed", "diagnosis", "treatment", "medication",
  "antidepressant", "therapy session", "mental episode", "mental breakdown"
];


  const handleSend = async () => {
    // e.preventDefault()
    setShowFetch(true)
  if (input.trim() === "") return;

  const newMessage = { sender: "user", text:input };
  setMessages((prev) => [...prev, newMessage]);
    setInput(""); 

  const lowerInput=input.toLowerCase()
  const isKeyword=mentalHealthKeywords.some((keyword)=>{
    return lowerInput.includes(keyword)
  })
  if(!isKeyword)
  {
    const fallback={sender:'bot',text:"I'm here to support mental health–related topics. Please ask something in that area 💬"}
    setMessages((prev)=>[...prev,fallback])
    setShowFetch(false)
    return
  }

  
    
  const payload = {
    contents: [
      {
        parts: [{ text:input }],
      },
    ],
  };

  try {
    const res = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    const botReply = data.candidates[0].content.parts[0].text;
    setResult(botReply)
    const newAns = { sender: "bot", text: botReply };
    setMessages((prev) => [...prev, newAns]);

  } catch (err) {
    console.error("Bot error:", err);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "Sorry, something went wrong." },
    ]);
  }
  setShowFetch(false)
};


  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  return (
    <div className="pt-15  w-full h-screen  shadow-xl border border-gray-300 rounded-2xl flex flex-col ">
      <div className="bg-pink-600 text-white text-center py-3 font-semibold rounded-t-2xl">
        MindMitra Chat
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] px-3 py-2 rounded-xl text-md ${
                msg.sender === "user"
                  ? "bg-pink-100 text-black"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <ReactMarkdown>
              {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {showFetch &&(<div className=" flex justify-start">
          <div className="max-w-[70%] px-3 py-2 rounded-xl text-md bg-white text-gray-500">
            <ReactMarkdown>Fetching Response...</ReactMarkdown>
          </div>
        </div>
      )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-5 border-t flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border border-gray-300 rounded-full px-3 py-3 text-sm outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-pink-600 text-white px-4 py-3 rounded-full text-sm hover:bg-pink-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
