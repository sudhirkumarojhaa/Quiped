/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react";
import firebase from "firebase";
import "./design/App.css";
import { config, message } from "./assets/config";
import Login from "./components/Login";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import Header from "./components/Header";
import ListItem from "./components/ListItem";

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const App = () => {
  const [data, setData] = useState([]);
  const [signIn, setSignIn] = useState(false);
  const [user, setUser] = useState("");
  const [display, setDisplay] = useState(false);
  const [occupiedUser, setOccupiedUser] = useState([]);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setSignIn(!!user);
      setUser(user);
    });
    readUserData();
  }, []);

  const uiConfig = {
    signInFlow: "popup",
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    callbacks: {
      signInSuccess: () => false,
    },
  };

  const sendData = (id) => {
    setDisplay(true);
    let flag = data.some((items) => items.occupant === user.displayName);
    let arr;
    arr = data.map((items) => {
      if (!flag && items.id === id && items.occupant === "") {
        items.status = !items.status;
        items.occupant = user.displayName;
        items.enabled = true;
        const occupy = {
          RoomId: items.id,
          User: user.displayName,
        };
        firebase.database().ref("Occupy").push(occupy);
      } else if (flag && items.id === id && items.occupant === user.displayName) {
         items.status = !items.status;
         items.occupant = "";
         for (const property in occupiedUser){
          if(occupiedUser[property].User === user.displayName){
            firebase.database().ref().child("Occupy/"+property).remove()
          }
        }       
      }
      return items;
    });
    setData(arr);
    setDisplay(false);
    sendUserData();
  };

  const sendUserData = () => {
    setDisplay(true);
    firebase
    .database()
    .ref("Rooms/")
    .set({
      data,
    });
    setDisplay(false)
  };

  const readUserData = () => {
    setDisplay(true);
    firebase
      .database()
      .ref("Rooms/")
      .on("value", function (snapshot) {
        setData(snapshot.val().data);
        setDisplay(false);
      });
    firebase
      .database()
      .ref("Occupy/")
      .on("value", function (snapshot) {
        setOccupiedUser(snapshot.val());
        setDisplay(false);
      });
  };

  const occupy = occupiedUser ? Array.from(Object.values(occupiedUser)) : ["Dummy User"]
  const occupyUser = occupy.map((item) => {
    return item.User
  })
  return (
    <div className="app">
      {signIn ? (
        <div className="container position-relative vh-100">
          {display ? (
            <Loader style={{ display: display ? "flex" : "none" }} />
          ) : (
            <div>
              <Header
                src={user ? user.photoURL : "unknown"}
                onClick={() => firebase.auth().signOut()}
              />
              {data !== undefined ? (
                data.map((item) => (
                  <ListItem
                    key={item.id}
                    name={item.name}
                    enabled={item.enabled}
                    item={item.occupant}
                    user={user.displayName}
                    status={item.status}
                    occupied={occupyUser}
                    onClick={() => sendData(item.id)}
                  />
                ))
              ) : (
                <p>{message}</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <Login uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      )}
      <Footer />
    </div>
  );
};

export default App;
