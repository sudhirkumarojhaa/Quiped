import React from 'react';
import '../design/App.css';
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

export default function Login({uiConfig,firebaseAuth}) {
  return (
    <div className="bg">
      <div className="d-flex flex-column justify-content-center  align-items-center my-5">
        <h2 className="text-white my-3 ">Quiped Application</h2>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebaseAuth}
        />
      </div>
    </div>
  )
}
