/* eslint-disable react-native/no-inline-styles */
import React , {useState,useContext, useEffect} from "react";
import {Redirect} from 'react-router-dom';
import { message } from "../assets/config";
import firebase from "firebase";
import Header from "./Header"
import ListItem from "./ListItem"
import { AuthContext } from "./auth"
import Footer from "./Footer";
import Loader from "./Loader";

const Dashboard = () => {
const [data, setData] = useState([]);
const [occupiedUser, setOccupiedUser] = useState([]);
const { user,signIn } = useContext(AuthContext);
const [loading,setLoading]= useState(false)

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
  setLoading(true);
  firebase
    .database()
    .ref("Rooms/")
    .on("value", function (snapshot) {
      setData(snapshot.val().data);
      setLoading(false)
    });
  firebase
    .database()
    .ref("Occupy/")
    .on("value", function (snapshot) {
      setOccupiedUser(snapshot.val());
      setLoading(false)
    });
};

const occupy = occupiedUser ? Array.from(Object.values(occupiedUser)) : ["Dummy User"]
const occupyUser = occupy.map((item) => {
  return item.User
})

if(!signIn){
  return <Redirect to={"/"} />
}

const freeRoom = data.filter(item => item.occupant !== '').length;

  return (
    <div className="bg">
      <div className="container position-relative vh-100">
        <Header src={user && user.photoURL} onClick={() => firebase.auth().signOut()} freeRoom={freeRoom} totalRoom={data.length}  />
        {loading ? <Loader style={{ display: loading ? 'flex' : 'none' }} /> :
          data !== undefined ?
            data.map(item =>
              <ListItem key={item.id} name={item.name} item={item.occupant} status={item.status} occupied={occupyUser} user={user.displayName} enabled={item.enabled} onClick={() => sendData(item.id)} />
            ) : <p>{message}</p>}
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
