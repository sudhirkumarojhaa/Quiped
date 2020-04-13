/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect , useContext } from "react";
import {Route, Redirect} from 'react-router-dom'; 
import firebase from "firebase";
import "../design/App.css";
import { config, message } from "../assets/config";
import Login from "./Login";
import Footer from "./Footer";
import Loader from "./Loader";
import Header from "./Header";
import ListItem from "./ListItem";
import { AuthContext } from "./auth"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const Landing = () => {
  const {signIn, user} = useContext(AuthContext)
  const uiConfig = {
    signInFlow: "popup",
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    callbacks: {
      signInSuccess: () => false,
    },
  };

  if(signIn){
    return <Redirect to={"/dashboard"} />
  }

  return (
    <div className="w-100">
      <div className="w-100 ">
      <div className="bg">
        <div className="d-flex flex-column justify-content-center  align-items-center ">
          <h2 className="text-white my-3 ">Quiped Application</h2>
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
