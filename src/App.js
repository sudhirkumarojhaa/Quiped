/* eslint-disable react-native/no-inline-styles */
import React from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import "./design/App.css";
import Landing from "./components/Landing";
import Dashboard from "./components/Dashboard";
import { AuthProvider} from "./components/auth.js";

const App = () => {
  return (
    <div className="app">
      <AuthProvider >
        <Router basename={process.env.PUBLIC_URL}>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/dashboard" component={Dashboard} />
          </Switch>
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;
