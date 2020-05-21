/* eslint-disable react-native/no-inline-styles */
import React , {useState,useContext, useEffect} from "react";
import {Redirect} from 'react-router-dom';
import { message } from "../assets/config";
import firebase from "firebase";
import moment from "moment";
import Header from "./Header"
import ListItem from "./ListItem"
import { AuthContext } from "./auth"
import Footer from "./Footer";
import Loader from "./Loader";

const Dashboard = () => {
const [data, setData] = useState([]);
const [occupiedUser, setOccupiedUser] = useState([]);
const { user,signIn } = useContext(AuthContext);
const [loading,setLoading]= useState(false);

useEffect(() => {
  setInterval(() => {
    readUserData();
  }, 1000);
}, []);

const sendData = (id) => {
  let flag = data.some((items) => items.occupant === user.displayName);
  let arr;
  arr = data.map((items) => {
    if (!flag && items.id === id && items.occupant === "") {
      items.status = !items.status;
      items.occupant = user.displayName;
      items.enabled = true;
      items.timestamp = moment().unix()
      const occupy = {
        RoomId: items.id,
        User: user.displayName,
        timestamp:moment().unix()
      };
      firebase.database().ref("Occupy").push(occupy);
    } else if (flag && items.id === id && items.occupant === user.displayName) {
       items.status = !items.status;
       items.occupant = "";
       items.timestamp = null;
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

const remainingTime = (timestamp) => {
  const a = moment(moment(moment.unix(timestamp).toLocaleString()).add(60,'m').toLocaleString())
  const b = moment.unix(moment().unix()).toLocaleString()
  return a.diff(b,'minutes')
}

const lessThanZero = (roomId,roomName,occupant) => {
  const property = roomId-1
  const updateRoom = {
    enabled:true,
    id:roomId,
    name:roomName,
    occupant:"",
    status:false,
    timestamp:null
  }
  firebase
  .database()
  .ref("Occupy/")
  .on("value", function (snapshot) {
    for (const occupantProp in snapshot.val()){
      if(snapshot.val()[occupantProp].User === occupant){
        firebase.database().ref().child("Occupy/"+occupantProp).remove()
      }
    }
  })
  firebase.database().ref("Rooms/data").child(property).set(updateRoom);
}

const extendTime = (roomId,roomName,occupantName) => {
  const property = roomId-1
  const updateRoom = {
    enabled:true,
    id:roomId,
    name:roomName,
    occupant:occupantName,
    status:true,
    timestamp:moment().unix()
  }
  firebase.database().ref("Rooms/data").child(property).set(updateRoom);
}


const occupy = occupiedUser ? Array.from(Object.values(occupiedUser)) : ["Dummy User"]
const occupyUser = occupy.map((item) => {
  return item.User
})

if(!signIn){
  return <Redirect to={"/"} />
}

const freeRoom = data.filter(item => item.occupant === '').length;
const stats= freeRoom === 0 ? 'No room' : freeRoom === 1 ? '1 room' : `${freeRoom} rooms`;
const colorCode = stats === 'No room' ? 'tomato' : '#0c9';

  return (
    <div className="bg">
      <div className="bg-white position-relative vh-100">
        <div className="container vh-100">
        <Header
          style={{color: colorCode}}
          src={user && user.photoURL}
          onClick={() => firebase.auth().signOut()}
          stats={stats}
          show={freeRoom !== 0 ? true : false}
        />
        {loading ? <Loader style={{ display: loading ? 'flex' : 'none', backgroundColor: 'red',}} /> :
          data !== undefined ?
            data.map(item => {
              return <ListItem
              keyValue={item.id}
              name={item.name}
              item={item.occupant}
              status={item.status}
              occupied={occupyUser}
              user={user.displayName}
              enabled={item.enabled}
              time={
                isNaN(remainingTime(item.timestamp))
                  ? null
                :
                remainingTime(item.timestamp) <= 0
                  ? lessThanZero(item.id,item.name,item.occupant)
                : remainingTime(item.timestamp) > 0 && remainingTime(item.timestamp) <= 5
                  ? remainingTime(item.timestamp) +  " mins left"
                :
                  remainingTime(item.timestamp) + " mins left"
              }
              onClick={() => sendData(item.id)}
              handleExtend = {() => extendTime(item.id,item.name,item.occupant)}
              showExtend={item.status && remainingTime(item.timestamp) <= 5}
            />
          }) : <p>{message}</p>}
        <Footer />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
