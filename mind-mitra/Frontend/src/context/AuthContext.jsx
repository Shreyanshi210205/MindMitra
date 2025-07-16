import { createContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext(null);

export const AuthProvider = (props) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [googleLoggedin,setGoogleLoggedin]=useState(false);
  const [token,setToken]=useState('')

  const auth = getAuth();

  useEffect(() => {
    const checkFirebaseAuth = async () => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken();
          setToken(token)

          try {
            const res = await fetch("http://localhost:5000/api/google-login", {
              method: "POST",
              headers:{
                Authorization: `Bearer ${token}`,
              },
            });

            if (!res.ok) throw new Error("Firebase user unauthorized");

            const data = await res.json();
            setUser(firebaseUser);
            setGoogleLoggedin(true);
            console.log(" Firebase user logged in:", data);
          } catch (err) {
            console.error("Firebase auth error:", err);
          }
        }
      });
    };

    const checkManualAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/check-auth", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Manual login unauthorized");

        const data = await res.json();
        setUser(data); 
        setLoggedIn(true);
        console.log("Manual user logged in:", data);
      } catch (err) {
        console.error("Manual auth error:", err);
      }
    };

    checkFirebaseAuth();
    checkManualAuth();
  }, [auth]);

  return (
    <AuthContext.Provider value={{token, user, loggedIn, setLoggedIn,googleLoggedin,setGoogleLoggedin }}>
      {props.children}
    </AuthContext.Provider>
  );
};
