/* eslint-disable react-native/no-inline-styles */
import React , {useState,useContext, useEffect} from "react";
import {Redirect} from 'react-router-dom';
import { message } from "../assets/config";
import firebase from "firebase";
import Header from "./Header"
import ListItem from "./ListItem"
import Loader from "./Loader"
import { AuthContext } from "./auth"
import Footer from "./Footer";

const Dashboard = ({history}) => {
const [data, setData] = useState([]);
const [occupiedUser, setOccupiedUser] = useState([]);
const { user,signIn} = useContext(AuthContext)
const [ display, setDisplay ] = useState(false)

useEffect(() => {
  
  if(!signIn){
    setDisplay(true)
  }
  readUserData();
}, []);




const sendData = (id) => {
  setDisplay(true)
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
  setDisplay(false)
};

const logOut = () => {
  firebase.auth().signOut()
  history.push('/')
}
const sendUserData = () => {
  firebase
  .database()
  .ref("Rooms/")
  .set({
    data,
  });
};

const readUserData = () => {
  setDisplay(true)
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
    setDisplay(false)
};

const occupy = occupiedUser ? Array.from(Object.values(occupiedUser)) : ["Dummy User"]
const occupyUser = occupy.map((item) => {
  return item.User
})
console.log(display)


  return (
    display ?  <Loader style={{ display: display ? "flex" : "none" }} /> :
      <div className="container position-relative vh-100">
        <Header src={user && user.photoURL} onClick={() => logOut()}/>
        {data !== undefined ?
        data.map(item =>
          <ListItem key={item.id} name={item.name} item={item.occupant} status={item.status} occupied={occupyUser} user={user.displayName} enabled={item.enabled} onClick={() => sendData(item.id)} />
        ) : <p>{message}</p>}
        <Footer/>
      </div>
  );
};

export default Dashboard;
