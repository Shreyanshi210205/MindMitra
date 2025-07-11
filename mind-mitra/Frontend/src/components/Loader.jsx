import React from 'react';
import image from '../assets/brain-loader.png'
const Loader = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-[9999] transition-opacity duration-300">
      <img
        src={image}
        alt="Loading"
        className="w-20 h-20 animate-bounce"
      />
    </div>
  );
};

export default Loader;
