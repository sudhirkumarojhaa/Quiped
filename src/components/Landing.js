/* eslint-disable react-native/no-inline-styles */
import React, {useContext,useState,useEffect } from "react";
import { useHistory } from 'react-router-dom';
import firebase from "firebase";
import "../design/App.css";
import { config } from "../assets/config";
import Loader from "./Loader";
import { AuthContext } from "./auth"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const Landing = () => {
  const {signIn} = useContext(AuthContext)
  const history = useHistory();

  useEffect(() => {
    setLoading(true)
    if(signIn){
      if(firebase.auth().currentUser !== null){
        if(firebase.auth().currentUser.email.indexOf('ithands') === -1 && firebase.auth().currentUser.email.indexOf('rubico') === -1 ){
          firebase.auth().signOut();
          alert('You are not authorized to login in. Please ask your HR to add you in Quiped');
          window.location.reload()
        } else{
          history.push('/dashboard')
        }
      } 
    } else {
      setTimeout(() => {
        setLoading(false)
      }, 1500);
    }
    
  },[signIn,history])

  const [loading,setLoading] = useState(false)
  const uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      {
        provider : firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        customParameters: {
          prompt: 'select_account'
        }
      }
    ],
    callbacks: {
      signInSuccess: () => false,
    },
  };

  return (
    loading ?
      <Loader style={{ display: loading ? 'flex' : 'none'}} /> :
        <div className="bg">
          <div className="d-flex flex-column justify-content-center  align-items-center h-100">
            <h1 className="text-dark font-weight-bold title">Rubico IT</h1>
            <h6 className="text-capitalize text-white tag">HDR conference room management application.</h6>
            <StyledFirebaseAuth
              uiConfig={uiConfig}
              firebaseAuth={firebase.auth()}
            />
          </div>
        </div>
  );
};

export default Landing;
