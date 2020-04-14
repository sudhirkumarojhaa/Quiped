/* eslint-disable react-native/no-inline-styles */
import React , {useState,useContext, useEffect} from "react";
import {Redirect} from 'react-router-dom';
import { message } from "../assets/config";
import firebase from "firebase";
import Header from "./Header"
import ListItem from "./ListItem"
import { AuthContext } from "./auth"
import Footer from "./Footer";

const Dashboard = () => {
const [data, setData] = useState([]);
const [occupiedUser, setOccupiedUser] = useState([]);
const { user,signIn } = useContext(AuthContext)

useEffect(() => {
  readUserData();
}, []);

const sendData = (id) => {
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
  sendUserData();
};

const sendUserData = () => {
  firebase
  .database()
  .ref("Rooms/")
  .set({
    data,
  });
};

const readUserData = () => {
  firebase
    .database()
    .ref("Rooms/")
    .on("value", function (snapshot) {
      setData(snapshot.val().data);
    });
  firebase
    .database()
    .ref("Occupy/")
    .on("value", function (snapshot) {
      setOccupiedUser(snapshot.val());
    });
};

const occupy = occupiedUser ? Array.from(Object.values(occupiedUser)) : ["Dummy User"]
const occupyUser = occupy.map((item) => {
  return item.User
})

if(!signIn){
  return <Redirect to={"/"} />
}

  return (
      <div className="container position-relative vh-100">
        <Header src={user && user.photoURL} onClick={() => firebase.auth().signOut()}/>
        {data !== undefined ?
        data.map(item =>
          <ListItem key={item.id} name={item.name} item={item.occupant} status={item.status} occupied={occupyUser} user={user.displayName} enabled={item.enabled} onClick={() => sendData(item.id)} />
        ) : <p>{message}</p>}
        <Footer/>
      </div>
  );
};

export default Dashboard;
