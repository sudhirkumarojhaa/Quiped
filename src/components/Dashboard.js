/* eslint-disable react-native/no-inline-styles */
import React , {useState,useContext , useEffect} from "react";
import {Route, Redirect} from 'react-router-dom'; 
import { config } from "../assets/config";
import firebase from "firebase";
import Header from "./Header"
import ListItem from "./ListItem"
import { AuthContext } from "./auth"


const Dashboard = () => {

const [data, setData] = useState([]);
const [display, setDisplay] = useState(false);
const [occupiedUser, setOccupiedUser] = useState([]);
const { user,signIn } = useContext(AuthContext)

useEffect(() => {
  readUserData();
}, []);

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

console.log(user)
const occupy = occupiedUser ? Array.from(Object.values(occupiedUser)) : ["Dummy User"]
const occupyUser = occupy.map((item) => {
  return item.User
})

if(!signIn){
  return <Redirect to={"/"} />
}


  return (
      <div className="container position-relative vh-100">
          <div>
            <Header src={user.photoURL} onClick={() => firebase.auth().signOut()}/>
            {data !== undefined ?
              data.map(item =>
                <ListItem key={item.id} name={item.name} item={item.occupant} status={item.status} occupied={occupyUser} user={user.displayName} enabled={item.enabled} onClick={() => sendData(item.id)}/>
               ) : <p>sdfgjghgfd</p>}
          </div>
        </div>
  );
};

export default Dashboard;
