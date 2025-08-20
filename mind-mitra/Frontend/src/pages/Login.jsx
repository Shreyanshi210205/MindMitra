import React, { useState, useContext, useEffect } from 'react';
import bgImage from '../assets/loginBG.png';
import toast from 'react-hot-toast';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FirebaseContext } from '../context/firebase';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { loggedIn, googleLoggedin, setGoogleLoggedin, setLoggedin } = useContext(AuthContext);
  const { signinWithGoogle } = useContext(FirebaseContext);

  useEffect(() => {
    if (loggedIn || googleLoggedin) navigate('/');
  }, [loggedIn, navigate, googleLoggedin]);

  const validateForm = ({ email, password }) => {
    if (!email || !password) {
      return "Email and password are required.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email address.";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { email, password };
    const errorMsg = validateForm(formData);
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }
    try {
      const res = await fetch('https://mindmitra-jhfv.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Login failed");
      } else {
        localStorage.setItem("token", data.token);
        toast.success(data.message || "Login successful");
        setLoggedin(true);
        navigate('/');
      }
      console.log(data);
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Login failed');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log("Starting Google Sign-in...");
      const result = await signinWithGoogle();
      const token = await result.getIdToken();
      const res = await fetch("https://mindmitra-jhfv.onrender.com/api/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        toast.error("Invalid response from server");
        return;
      }

      if (!res.ok) {
        toast.error(data.error || "Google login failed");
        return;
      }

      setGoogleLoggedin(true);
      toast.success(data.message || "Logged in successfully");
      navigate("/");
    } catch (err) {
      toast.error("Login failed");
    }
  };

  return (
    <div className='scroll-smooth'>
      <div className="relative w-full h-screen">
        <img className='w-full h-screen object-cover' src={bgImage} alt="bgImage" />
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className="bg-white/70 p-8 rounded-xl shadow-lg flex flex-col gap-4 w-90">
            <h2 className='text-2xl text-center font-bold'>Login</h2>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
              <input
                type="email"
                placeholder='Enter your email'
                className='bg-pink-100 p-2 rounded-md outline-none'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder='Enter your password'
                className='bg-pink-100 p-2 rounded-md outline-none'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className='cursor-pointer bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600'>
                Login
              </button>
            </form>
            <div className="flex items-center gap-2 my-2">
              <hr className="flex-grow border-gray-300" />
              <span className="text-sm text-gray-500">OR</span>
              <hr className="flex-grow border-gray-300" />
            </div>
            <button onClick={handleGoogleLogin} className="flex items-center justify-evenly cursor-pointer border border-gray-400 py-2 rounded-md hover:bg-gray-100">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Login with Google
            </button>
            <p className="text-sm mt-4 text-center">
              New here? <NavLink to='/signup'> <button className="text-blue-600 text-[16px] underline cursor-pointer">Create an account</button></NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;