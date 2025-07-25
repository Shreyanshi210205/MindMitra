import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { FaGlobe, FaBars, FaTimes } from "react-icons/fa";
import logo from "/logo.png";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  
  const  {loggedIn,googleLoggedin}=useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false);

  const linkStyle = "relative transition duration-200 hover:text-pink-600";
  const activeStyle =
    "after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-[#fb64b6]";
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="w-full px-4 md:px-8 py-3 bg-[#cce7e2] flex items-center justify-between fixed z-[1000]">
      <div className="flex items-center space-x-2">
        <img src={logo} alt="MindMitra Logo" className="w-8 h-8 object-contain" />
        <span className="text-xl font-semibold text-gray-800">MindMitra</span>
      </div>

      <div className="hidden md:flex space-x-8 text-gray-800 font-semibold">
        <NavLink to="/" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ""}`}>
          Home
        </NavLink>
        <NavLink to="/mood-track" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ""}`}>
          Mood Tracker
        </NavLink>
        <NavLink to="/journal" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ""}`}>
          Journal
        </NavLink>
        <NavLink to="/mind-tools" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ""}`}>
          Mind Tools
        </NavLink>
      </div>

      <div className="hidden md:flex items-center space-x-4">
        {(loggedIn || googleLoggedin)? (<NavLink to="/dashboard">
        <button className="cursor-pointer px-4 py-1 border border-pink-600 text-pink-600 rounded-full hover:bg-pink-100 transition">
          Dashboard
        </button>
        </NavLink>) :
        (<NavLink to="/signup">
        <button className="cursor-pointer px-4 py-1 border border-pink-600 text-pink-600 rounded-full hover:bg-pink-100 transition">
          Login / Sign Up
        </button>
        </NavLink>)
        }
        
      </div>

      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu}>
          {isOpen ? (
            <FaTimes className="text-xl text-gray-700" />
          ) : (
            <FaBars className="text-xl text-gray-700" />
          )}
        </button>
      </div>

      
      {isOpen && (
        <div className={`absolute top-full left-0 w-full bg-[#cce7e2] flex flex-col items-start p-4 gap-4 md:hidden shadow-md
    transition-all duration-300 ease-in-out
    ${isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'}
  `}>
          <NavLink to="/" onClick={toggleMenu} className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ""}`}>
            Home
          </NavLink>
          <NavLink to="/mood" onClick={toggleMenu} className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ""}`}>
            Mood Tracker
          </NavLink>
          <NavLink to="/journal" onClick={toggleMenu} className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ""}`}>
            Journal
          </NavLink>
          <NavLink to="/tools" onClick={toggleMenu} className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ""}`}>
            Mind Tools
          </NavLink>
          <NavLink to="/signup">
          <button className="mt-2 px-4 py-1 border border-pink-600 text-pink-600 rounded-full hover:bg-pink-100 transition">
            Login / Sign Up
          </button>
          </NavLink>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
