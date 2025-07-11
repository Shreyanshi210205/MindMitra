import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';

export const FirebaseContext = createContext(null);

const firebaseConfig = {
  apiKey: "AIzaSyAG3nGCKqm3tLn0B0FEe1zZ3Qm_B3QxnsM",
  authDomain: "mind-mitra-5ce39.firebaseapp.com",
  projectId: "mind-mitra-5ce39",
  storageBucket: "mind-mitra-5ce39.appspot.com",
  messagingSenderId: "710277495480",
  appId: "1:710277495480:web:89e343e3568d4458f0524d",
  measurementId: "G-JJQDGNWSKT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const FirebaseProvider = (props) => {
  const [userGoogle, setUserGooogle] = useState(null);

  const signinWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUserGooogle(result.user);
      return result.user;
    } catch (err) {
      console.error("Google sign-in error:", err);
    }
  };

  const logoutGoogle = () => {
    signOut(auth)
      .then(() => setUserGooogle(null))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUserGooogle(firebaseUser);
      } else {
        setUserGooogle(null);
      }
    });
    return () => unsubscribe(); 
  }, []);

  return (
    <FirebaseContext.Provider value={{ signinWithGoogle, logoutGoogle, userGoogle }}>
      {props.children}
    </FirebaseContext.Provider>
  );
};
