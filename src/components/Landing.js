/* eslint-disable react-native/no-inline-styles */
import React, {useContext , useState } from "react";
import { withRouter } from 'react-router'
import {Redirect} from 'react-router-dom';
import firebase from "firebase";
import "../design/App.css";
import { config } from "../assets/config";
import Loader from "./Loader";
import Footer from "./Footer";
import { AuthContext } from "./auth"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const Landing = ({history}) => {
  const [ display, setDisplay ] = useState(false)
  const {signIn} = useContext(AuthContext)
  const uiConfig = {
    signInFlow: "redirect",
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    callbacks: {
      signInSuccess: () => {
        history.push('/dashboard');},
    },
  };

   
  return (
    display ?  <Loader style={{ display: display ? "flex" : "none" }} /> :
      <div className="bg">
        <div className="d-flex flex-column justify-content-center  align-items-center h-75">
          <h3 className="text-white font-weight-bold my-3 ">Quiped Application</h3>
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
        </div>
        <Footer />
     </div>
  );
};

export default withRouter(Landing);
