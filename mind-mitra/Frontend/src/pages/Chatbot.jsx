import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Chatbot() {
  console.log("Gemini Key:", import.meta.env.VITE_GEMINI_KEY);

  const mentalHealthKeywords = [
    "anxiety","depression","stress","mental health","therapy","sad","angry","panic","help","support","anxious","fine",
    "wellbeing","counseling","mood","feeling","lonely","overwhelmed","hopeless","worry","fear","trauma",
    "ptsd","bipolar","schizophrenia","addiction","substance abuse","grief","loss","cry","suicidal",
    "self-harm","cutting","eating disorder","bulimia","anorexia","body image","confidence","self-esteem",
    "worthless","motivation","burnout","fatigue","sleep","insomnia","nightmare","relationship","breakup",
    "divorce","abuse","domestic violence","bully","harassment","discrimination","isolation","social anxiety",
    "phobia","obsessive","compulsive","ocd","adhd","autism","mental illness","diagnosis","medication",
    "psychiatrist","psychologist","psychotherapy","mindfulness","meditation","relaxation","breathe","calm",
    "cope","coping","distress","emotional","regulation","anger management","crisis","hotline","helpline",
    "wellness","mental","health","disturbed","paranoia","delusion","hallucination"
  ];

  const containsMentalHealthKeywords = (text) => {
    const lowercasedText = text.toLowerCase();
    return mentalHealthKeywords.some((keyword) => lowercasedText.includes(keyword));
  };

  const messageRef=useRef(null);

  useEffect(()=>{
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  })

  const [messages, setMessages] = useState([{sender:"bot", text:"Hello! How can I assist you today?"}]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_GEMINI_KEY;
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    if (!containsMentalHealthKeywords(input)) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "I'm here to help you with mental health resources." },
      ]);
      setInput("");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        contents: [{ role: "user", parts: [{ text: input }] }],
      };

      const res = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const botReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't understand that.";

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (err) {
      console.error("Error fetching bot reply:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Please try again." },
      ]);
    }

    setInput("");
    setLoading(false);
  };

  return (
    <div className="flex flex-col pt-30 max-w-lg mx-auto p-4 bg-white rounded-lg shadow h-[80vh]">
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-md max-w-[80%] prose prose-sm ${
              msg.sender === "user"
                ? "bg-blue-100 ml-auto text-right"
                : "bg-gray-100 mr-auto text-left"
            }`}
          >
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}
        {loading && <div className="text-gray-500">Bot is typing...</div>}
        <div ref={messageRef}></div>
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me something..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
