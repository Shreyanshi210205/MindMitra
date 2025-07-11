import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { FirebaseContext } from '../context/firebase';

function Dashboard() {

  const navigate=useNavigate()
  const {setLoggedIn,googleLoggedin,loggedIn,setGoogleLoggedin}=useContext(AuthContext)
  const {logoutGoogle}=useContext(FirebaseContext)

const handleLogout = () => {
  if(loggedIn){
  localStorage.removeItem('token'); 
  setLoggedIn(false)
}
  else if(googleLoggedin) {
    logoutGoogle();
    setGoogleLoggedin(false);
  }
  navigate('/login'); 
  toast.success('Logged out successfully');
};

  return (
    <div className='pt-16'>
        <button onClick={handleLogout} className='bg-red-400'>logout</button>
    </div>
  )
}

export default Dashboard