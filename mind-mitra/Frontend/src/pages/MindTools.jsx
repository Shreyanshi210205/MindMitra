import React, { useState, useEffect, useRef } from "react";
import medBG from "../assets/medBG.png";

const MindTools = () => {
  const [showBreathing, setShowBreathing] = useState(false);
  const [durationBreathe, setDurationBreathe] = useState(15);
  const [durationMeditate, setDurationMeditate] = useState(15);
  const [remaining, setRemaining] = useState(0);
  const [isInhaling, setIsInhaling] = useState(true);

  const [breathIntervalId, setBreathIntervalId] = useState(null);
  const [totalTimerId, setTotalTimerId] = useState(null);

  const [showMeditating, setShowMeditating] = useState(false);
  const [isMeditatingActive, setIsMeditatingActive] = useState(false);
  const [isBreathingActive, setIsBreathingActive] = useState(false);

  const [selectedAudio, setSelectedAudio] = useState("none");
  const audioRef = useRef(null);
  const timerPausedRef = useRef(false);

  const startBreathing = () => {
    setShowBreathing(true);
    setRemaining(durationBreathe);
    setIsBreathingActive(false);
  };

  const beginBreathingTimer = () => {
    setIsBreathingActive(true);
    timerPausedRef.current = false;

    const breathInterval = setInterval(() => {
      setIsInhaling((prev) => !prev);
    }, 3000);
    setBreathIntervalId(breathInterval);

    const timerInterval = setInterval(() => {
      if (!timerPausedRef.current) {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(breathInterval);
            clearInterval(timerInterval);
            setShowBreathing(false);
            setIsBreathingActive(false);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
    setTotalTimerId(timerInterval);
  };

  const stopBreathing = () => {
    clearInterval(breathIntervalId);
    clearInterval(totalTimerId);
    setShowBreathing(false);
    setIsBreathingActive(false);
  };

  const startMeditating = () => {
    setShowMeditating(true);
    setRemaining(durationMeditate);
    setIsMeditatingActive(false);
  };

  const beginMeditationTimer = () => {
    timerPausedRef.current=false
  setIsMeditatingActive(true);

  if (selectedAudio !== "none") {
  const audio = new Audio(selectedAudio);
  audio.loop = true;

  audio
    .play()
    .then(() => {
      audioRef.current = audio;
    })
    .catch((err) => {
      console.log("Audio failed to play:", err);
    });
}

  const timer = setInterval(() => {
     if (!timerPausedRef.current) {
    setRemaining((prev) => {
      if (prev <= 1) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        clearInterval(timer);
        setShowMeditating(false);
        return 0;
      }
      return prev - 1;
    });
  }
  }, 1000);

  setTotalTimerId(timer);
};

  const stopMeditating = () => {
    clearInterval(totalTimerId);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setShowMeditating(false);
    setIsMeditatingActive(false);
  };

  const togglePause = () => {
    timerPausedRef.current = !timerPausedRef.current;
    if (timerPausedRef.current) {
      if (audioRef.current) audioRef.current.pause();
    } else {
      if (audioRef.current) audioRef.current.play();
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(breathIntervalId);
      clearInterval(totalTimerId);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [breathIntervalId, totalTimerId]);

  return (
    <div className="bg-[#cce7e2] min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">🧘 Mind Tools</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Breathing Tool */}
        <div className="bg-white shadow-xl rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">Breathing Tool</h2>
          <p className="mb-4 text-gray-500">
            Select duration and begin a guided breathing session.
          </p>
          <select
            className="mb-4 p-2 rounded-md border"
            value={durationBreathe}
            onChange={(e) => setDurationBreathe(Number(e.target.value))}
          >
            <option value={15}>15 seconds</option>
            <option value={30}>30 seconds</option>
            <option value={45}>45 seconds</option>
          </select>
          <div className="max-w-2xl">
            <button
              onClick={startBreathing}
              className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition"
            >
              Start Breathing
            </button>
          </div>
        </div>

        {/* Meditation Tool */}
        <div className="bg-white shadow-xl rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">Meditation</h2>
          <p className="mb-4 text-gray-500">
            Select a duration and relax with calming sounds.
          </p>
          <select
            className="mb-4 p-2 rounded-md border"
            value={durationMeditate}
            onChange={(e) => setDurationMeditate(Number(e.target.value))}
          >
            <option value={15}>15 seconds</option>
            <option value={30}>30 seconds</option>
            <option value={60}>1 minute</option>
            <option value={120}>2 minute</option>
          </select>

          <select
            className="mb-4 p-2 rounded-md border"
            value={selectedAudio}
            onChange={(e) => setSelectedAudio(e.target.value)}
          >
            <option value="none">No Sound</option>
            <option value="/audios/forest.mp3">Forest</option>
            <option value="/audios/river.mp3">River</option>
            <option value="/audios/rain.mp3">Rain</option>
          </select>

          <div className="max-w-2xl">
            <button
              className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition"
              onClick={startMeditating}
            >
              Start Meditation
            </button>
          </div>
        </div>
      </div>

      {/* Breathing Modal */}
      {showBreathing && (
        <div className="fixed inset-0 bg-[#cce7e2] flex items-center justify-center">
          <div className="bg-white/70 rounded-3xl p-8 text-center max-w-sm w-full shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-blue-600">
              {isInhaling ? "Breathe In" : "Breathe Out"}
            </h3>
            <div className="w-48 h-48 mx-auto flex items-center justify-center">
              <div
                className={`m-auto rounded-full bg-blue-400 transition-all duration-3000 ${
                  isInhaling ? "w-40 h-40" : "w-24 h-24"
                }`}
              ></div>
            </div>
            <p className="mt-4 text-gray-600">Remaining: {remaining}s</p>

            {!isBreathingActive ? (
              <button
                onClick={beginBreathingTimer}
                className="mt-4 bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600"
              >
                Start Session
              </button>
            ) : (
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={togglePause}
                  className="text-yellow-600 font-bold hover:underline"
                >
                  {timerPausedRef.current ? "Resume" : "Pause"}
                </button>
                <button
                  onClick={stopBreathing}
                  className="text-red-500 font-bold hover:underline"
                >
                  Stop
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Meditation Modal */}
      {showMeditating && (
        <div className="fixed inset-0 bg-[#cce7e2] flex items-center justify-center">
          <div className="bg-white/70 rounded-3xl p-8 text-center max-w-sm w-full shadow-lg relative">
            <img
              src={medBG}
              className="inset-0 absolute w-full h-full object-cover rounded-xl"
              alt="meditation background"
            />
            <div className="relative bg-white/80 rounded-xl p-10">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">
                Meditate Peacefully
              </h3>
              <p className="mt-4 text-gray-600">Remaining: {remaining}s</p>

              {!isMeditatingActive ? (
                <button
                  onClick={beginMeditationTimer}
                  className="mt-4 bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600"
                >
                  Start Session
                </button>
              ) : (
                <div className="mt-4 flex justify-center gap-4">
                  <button
                    onClick={togglePause}
                    className="text-yellow-600 font-bold hover:underline"
                  >
                    {timerPausedRef.current ? "Resume" : "Pause"}
                  </button>
                  <button
                    onClick={stopMeditating}
                    className="text-red-500 font-bold hover:underline"
                  >
                    Stop
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MindTools;
