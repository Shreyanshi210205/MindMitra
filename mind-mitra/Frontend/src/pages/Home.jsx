import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import CardSwap, { Card } from '../animations/CardSwap'

import bgImage from '../assets/homeBG.png';
import mood1 from '../assets/moodTrack.png';
import mood2 from '../assets/moodJournal.png';
import mood3 from '../assets/moodTools.png';
import placeholder from '../assets/placeholder.png';
import chatbot from '../assets/chatbot.png';
import mission from '../assets/mission.png';

import { NavLink } from 'react-router-dom';

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/articles/mindful");
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

  return (
    <div className="scroll-smooth">

      {/* Floating Chatbot */}
      <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end space-y-2 floating-bot">
        <div className="bg-pink-600 text-white font-semibold text-sm px-4 py-2 rounded-xl shadow-md max-w-[200px]">
          Hey, you can talk to me for help 👋
        </div>
        <NavLink to='/chat'>
          <button className="bg-white/80 rounded-full hover:shadow-2xl transition duration-300 flex items-center justify-center cursor-pointer">
            <img src={chatbot} className="w-20 h-17" />
          </button>
        </NavLink>
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-screen max-h-screen">
        <img className="h-screen w-full object-fill" src={bgImage} alt="Mental Health Background" />
        <div className="absolute inset-0 flex items-center px-6 sm:px-12">
          <div className="text-left text-black max-w-xl" data-aos="fade-up">
            <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl leading-tight">
              Welcome to MindMitra
            </h1>
            <p className="mt-2 text-base sm:text-lg">
              Your companion in self-care and emotional wellness.
            </p>
            <button className="mt-4 px-6 py-3 bg-pink-600 text-black font-semibold rounded-full shadow hover:bg-pink-500 transition cursor-pointer">
              Start Your Mental Health Journey
            </button>
          </div>
        </div>
      </div>

      {/* About Us */}
      <section className='py-10 px-12 sm:px-12 bg-white'>
        <h1 className='text-3xl sm:text-5xl font-bold text-center text-green-700 mb-7 mt-10' data-aos="fade-up">
          Our Mission
        </h1>
        <div className='flex md:flex-row flex-col gap-15 items-center justify-end'>
          <div className='pr-5 text-xl font-bold lg:text-left text-center leading-relaxed' data-aos="fade-right">
            Our mission is to create a safe, supportive space where individuals can learn, heal, and grow. We believe mental health is just as important as physical health — and everyone deserves access to understanding, empathy, and help.
            <br />
            We’re here to break the stigma around mental health. Our mission is to provide trusted resources, tools, mood tracking and journals that empower you to take charge of your well-being — one step at a time.
          </div>
          <div className='w-full lg:w-1/2 flex justify-center' data-aos="fade-left">
            <img className='w-64 sm:w-80 lg-w-full max-w-md object-contain' src={mission} alt="Mission" />
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16 pb-20 px-6 sm:px-12 bg-pink-100">
        <h1>Our Features</h1>
        <div style={{ height: '600px', position: 'relative' }}>
  <CardSwap
    cardDistance={60}
    verticalDistance={60}
    delay={3500}
    pauseOnHover={false}
  >
    <Card>
      <div className='flex flex-col items-center justify-around p-30'>
      <h3>Card 1</h3>
      <img src={mood1} alt="" />
      <p>Your content here</p>
      </div>
    </Card>
    <Card>
      <h3>Card 2</h3>
      <p>Your content here</p>
    </Card>
    <Card>
      <h3>Card 3</h3>
      <p>Your content here</p>
    </Card>
  </CardSwap>
</div>
      </section>

      {/* Articles Section */}
      <section className="py-12 px-6 sm:px-12 bg-white">
        <h2 className="text-2xl md:text-4xl font-semibold mb-6 text-center text-pink-600" data-aos="fade-up">
          Mindfulness Insights from Trusted Sources
        </h2>

        {loading ? (
          <p className="text-center">Loading articles...</p>
        ) : articles.length === 0 ? (
          <p className="text-center text-gray-600">No articles available right now.</p>
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
                  <img src={placeholder} alt="Article" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-lg font-semibold text-pink-700 mb-2">{article.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{article.description}</p>
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
    </div>
  );
}

export default Home;
