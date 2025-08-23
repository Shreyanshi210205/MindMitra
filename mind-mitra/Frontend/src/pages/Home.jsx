import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import CardSwap, { Card } from "../animations/CardSwap";


import bgImage from "../assets/homeBG.png";
import mood1 from "../assets/moodTrack.png";
import mood2 from "../assets/moodJournal.png";
import mood3 from "../assets/moodTools.png";
import placeholder from "../assets/placeholder.png";
import chatbot from "../assets/chatbot.png";
import mission from "../assets/mission.png";

import { NavLink } from "react-router-dom";

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name,setName]=useState('');
  const [email,setEmail]=useState('')
  const [feedback,setFeedback]=useState('')

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("https://mindmitra-jhfv.onrender.com/api/articles/mindful");
        const data = await res.json();
        setArticles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);


  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch('https://mindmitra-jhfv.onrender.com/api/send-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, feedback }),
    });

    if (res.ok) {
      alert('Feedback sent!');
      setName('');
      setEmail('');
      setFeedback('');
    } else {
      alert('Failed to send feedback');
    }
  } catch (error) {
    console.error('Error sending feedback:', error);
    alert('Something went wrong');
  }
};


  return (
    <div className="scroll-smooth">
      {/* Floating Chatbot */}
      <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end space-y-2 floating-bot">
        <div className="bg-pink-600 text-white font-semibold text-sm px-4 py-2 rounded-xl shadow-md max-w-[200px]">
          Hey, you can talk to me for help 👋
        </div>
        <NavLink to="/chat">
          <button className="bg-white/80 rounded-full hover:shadow-2xl transition duration-300 flex items-center justify-center cursor-pointer">
            <img src={chatbot} className="w-20 h-17" />
          </button>
        </NavLink>
      </div>

      {/* Hero Section */}
<div className="relative w-full h-screen">
  <img
    className="absolute inset-0 w-full h-full object-cover"
    src={bgImage}
    alt="Mental Health Background"
  />
  <div className="absolute inset-0 " /> {/* Optional overlay for contrast */}

  <div className="relative z-10 flex items-center px-6 sm:px-12 h-full">
    <div className="text-left text-black max-w-xl" data-aos="fade-up">
      <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl leading-tight">
        Welcome to MindMitra
      </h1>
      <p className="mt-2 text-base sm:text-lg">
        Your companion in self-care and emotional wellness.
      </p>
      <button className="mt-4 px-6 py-3 bg-pink-600 text-white font-semibold rounded-full shadow hover:bg-pink-700 transition">
        Your Journey to Healthy Mind Starts Here!!
      </button>
    </div>
  </div>
</div>


      {/* About Us */}
      <section className="py-10 px-12 sm:px-12 over bg-white">
        <h1
          className="text-3xl sm:text-5xl font-bold text-center text-green-700 mb-7 mt-10"
          data-aos="fade-up"
        >
          Our Mission
        </h1>
        <div className="flex md:flex-row flex-col gap-15 items-center justify-end">
          <div
            className="pr-5 text-xl font-bold lg:text-left text-center leading-relaxed"
            data-aos="fade-right"
          >
            Our mission is to create a safe, supportive space where individuals
            can learn, heal, and grow. We believe mental health is just as
            important as physical health — and everyone deserves access to
            understanding, empathy, and help.
            <br />
            We’re here to break the stigma around mental health. Our mission is
            to provide trusted resources, tools, mood tracking and journals that
            empower you to take charge of your well-being — one step at a time.
          </div>
          <div
            className="w-full lg:w-1/2 flex justify-center"
            data-aos="fade-left"
          >
            <img
              className="w-64 sm:w-80 lg-w-full max-w-md object-contain"
              src={mission}
              alt="Mission"
            />
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-30 px-6 sm:px-12 bg-pink-100 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Only show feature text on large screens */}
          <div className="space-y-8 lg:block ">
            <h1
              data-aos="fade-up"
              className="text-5xl font-bold text-green-700"
            >
              Our Features
            </h1>
            <div data-aos="fade-right" data-aos-delay={100}>
              <h2 className="text-2xl font-semibold mb-1">🧠 Mood Tracker</h2>
              <p className="text-lg text-gray-700 font-semibold">
                Track your daily moods with just a tap. MindMitra helps you
                identify emotional patterns, giving you clarity and control over
                your mental well-being.
              </p>
            </div>
            <div data-aos="fade-right" data-aos-delay={200}>
              <h2 className="text-2xl font-semibold mb-1">📔 Journaling</h2>
              <p className="text-lg text-gray-700 font-semibold">
                Reflect, express, and grow with personalized AI-powered prompts
                in a secure, distraction-free space.
              </p>
            </div>
            <div data-aos="fade-right" data-aos-delay={300}>
              <h2 className="text-2xl font-semibold mb-1">🛠️ Mind Tools</h2>
              <p className="text-lg text-gray-700 font-semibold">
                Access calming tools like breathing exercises, affirmations, and
                visuals designed to reduce stress and support a balanced
                mindset.
              </p>
            </div>
          </div>

          {/* Cards: three in a single row on small screens, animation on large screens */}
          <div
            data-aos="fade-left"
            data-aos-delay={100}
            className="w-full"
            style={{ height: "600px", position: "relative" }}
          >
            {/* Show three cards in a single row on small screens */}
            <div className="flex flex-col gap-6 items-stretch justify-center lg:hidden">
              <div className="flex flex-col items-center justify-around p-6 gap-2 bg-white rounded-xl shadow w-full">
                <img
                  className="w-24 h-24 object-contain rounded-xl"
                  src={mood1}
                  alt="Mood Tracker"
                />
                <h3 className="text-base font-bold text-green-700">
                  🧠 Mood Tracker
                </h3>
                <p className="text-center text-gray-700 text-xs mt-2">
                  Log your mood and see trends over time for emotional clarity.
                </p>
              </div>
              <div className="flex flex-col items-center justify-around p-6 gap-2 bg-white rounded-xl shadow w-full">
                <img
                  className="w-24 h-24 object-contain rounded-xl"
                  src={mood2}
                  alt="Journaling"
                />
                <h3 className="text-base font-bold text-green-700">
                  📔 Journaling
                </h3>
                <p className="text-center text-gray-700 text-xs mt-2">
                  Write freely and get personalized prompts to reflect better.
                </p>
              </div>
              <div className="flex flex-col items-center justify-around p-6 gap-2 bg-white rounded-xl shadow w-full">
                <img
                  className="w-24 h-24 object-contain rounded-xl"
                  src={mood3}
                  alt="Mind Tools"
                />
                <h3 className="text-base font-bold text-green-700">
                  🛠️ Mind Tools
                </h3>
                <p className="text-center text-gray-700 text-xs mt-2">
                  Practice mindfulness with quick, helpful tools built into the app.
                </p>
              </div>
            </div>
            {/* Show CardSwap animation on large screens */}
            <div className="hidden lg:block h-full">
              <CardSwap
                cardDistance={60}
                verticalDistance={60}
                delay={3500}
                pauseOnHover={false}
              >
                <Card>
                  <div className="flex flex-col items-center justify-around p-10 gap-4">
                    <h3 className="text-xl font-bold text-green-700">
                      🧠 Mood Tracker
                    </h3>
                    <img
                      className="w-60 h-60 object-contain rounded-xl"
                      src={mood1}
                      alt="Mood Tracker"
                    />
                    <p className="text-center text-gray-700">
                      Log your mood and see trends over time for emotional clarity.
                    </p>
                  </div>
                </Card>
                <Card>
                  <div className="flex flex-col items-center justify-around p-10 gap-4">
                    <h3 className="text-xl font-bold text-green-700">
                      📔 Journaling
                    </h3>
                    <img
                      className="w-60 h-60 object-contain rounded-xl"
                      src={mood2}
                      alt="Journaling"
                    />
                    <p className="text-center text-gray-700">
                      Write freely and get personalized prompts to reflect better.
                    </p>
                  </div>
                </Card>
                <Card>
                  <div className="flex flex-col items-center justify-around p-10 gap-4">
                    <h3 className="text-2xl font-bold text-green-700">
                      🛠️ Mind Tools
                    </h3>
                    <img
                      className="w-60 h-60 object-contain rounded-xl"
                      src={mood3}
                      alt="Mind Tools"
                    />
                    <p className="text-center text-gray-700">
                      Practice mindfulness with quick, helpful tools built into the app.
                    </p>
                  </div>
                </Card>
              </CardSwap>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-12 px-6 sm:px-12 bg-white">
        <h2
          className="text-2xl md:text-4xl font-semibold mb-6 text-center text-pink-600"
          data-aos="fade-up"
        >
          Mindfulness Insights from Trusted Sources
        </h2>

        {loading ? (
          <p className="text-center">Loading articles...</p>
        ) : articles.length === 0 ? (
          <p className="text-center text-gray-600">
            No articles available right now.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <div
                key={index}
                className="border border-gray-200 p-4 rounded-lg shadow hover:shadow-md transition"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="h-40 bg-gray-100 rounded mb-3 overflow-hidden">
                  <img
                    src={placeholder}
                    alt="Article"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold text-pink-700 mb-2">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {article.description}
                </p>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm underline hover:text-blue-800"
                >
                  Read more →
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/*Feedback section */}
      <section className="py-12 px-6 sm:px-12 bg-pink-100 relative overflow-hidden">
  <h2 className="text-4xl font-bold text-green-700 text-center mb-10">
    Feedback Form
  </h2>

 

  {/* Form Container */}
  <div className="relative z-10 m-auto w-full max-w-2xl bg-white/90 backdrop-blur-lg rounded-xl shadow-2xl border border-purple-300">
    <form onSubmit={handleSubmit} className="flex flex-col items-stretch justify-center p-8" action="">
      <div className="mb-6">
        <label className="font-semibold block mb-2" htmlFor="name">Your Name</label>
        <input
          className="w-full p-3 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          type="text"
          required
          placeholder="Enter your name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="font-semibold block mb-2" htmlFor="email">Your Email</label>
        <input
          className="w-full p-3 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="font-semibold block mb-2" htmlFor="text">Your Feedback</label>
        <textarea
          placeholder="Write your feedback"  
          className="w-full p-3 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          rows={5}
          value={feedback}
          onChange={(e)=>setFeedback(e.target.value)}
        />
      </div>
      <button className="mx-auto bg-green-500 hover:bg-green-600 py-3 px-6 transition-colors rounded-xl text-white font-semibold shadow-md hover:shadow-lg">
        Submit
      </button>
    </form>
  </div>
</section>

{/*Footer*/}


    </div>
  );
}

export default Home;
