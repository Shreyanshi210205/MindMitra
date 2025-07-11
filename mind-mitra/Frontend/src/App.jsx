import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'
import ChatBot from './pages/Chatbot';
import MoodTrack from './pages/MoodTrack';
import Journal from './pages/Journal';
import MoodInsight from './pages/MoodInsight';
import MindTools from './pages/MindTools';
import { useEffect, useState } from 'react';
import Loader from './components/Loader';
import AOS from 'aos';
import 'aos/dist/aos.css';



function App() {
  const location=useLocation();
  const [loading,setLoading]=useState(true)
  useEffect(()=>{
    AOS.init({
      duration:500,
      once:true
    })
  })
  useEffect(()=>{
    setLoading(true)
    const id=setTimeout(() => {
      setLoading(false)
    }, 2000);
    return ()=>{clearTimeout(id)}
  },[location])
  return (
    <>
   
    {loading && <Loader/>}
      <Routes>
        <Route path='/' element={<Layout/>}>
        <Route index element={<Home/>}/>
        <Route path='/signup' element={<Signup></Signup>}></Route>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route>
        <Route path='/chat' element={<ChatBot></ChatBot>}></Route>
        <Route path='/mood-track' element={<MoodTrack></MoodTrack>}></Route>
        <Route path='/journal' element={<Journal></Journal>}>  </Route>
        <Route path='/mood-insight' element={<MoodInsight></MoodInsight>}></Route>
        <Route path='/mind-tools' element={<MindTools></MindTools>}></Route>
        </Route>
      </Routes>
     
    </>
  )
}

export default App
