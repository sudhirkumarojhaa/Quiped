import React, { useEffect, useState } from "react";
import firebase from "firebase";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [signIn, setSignIn] = useState(false);
  const [user, setUser] = useState("");
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setSignIn(!!user);
      setUser(user);
    });
  }, []);
  
  
  return (
    <AuthContext.Provider
      value={{
        user,
        signIn
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
