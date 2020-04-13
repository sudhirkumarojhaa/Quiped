/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import firebase from "firebase";
import "./design/App.css";
import { config, message } from "./assets/config";
import Login from "./components/Login";
import Landing from "./components/Landing";

import Footer from "./components/Footer";
import Loader from "./components/Loader";
import Header from "./components/Header";
import ListItem from "./components/ListItem";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./components/auth.js";

const App = () => {
  return (
    <div className="app">
      <AuthProvider>
        <Router> 
          <Switch>
            <Route exact path="/" component={Landing} />
            <ProtectedRoute exact  path="/dashboard" component={Dashboard}/>
            <Route path="/login" component={Login} />
            {/* <Route path="/dashboard" component={Dashboard} /> */}
          </Switch>
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;
