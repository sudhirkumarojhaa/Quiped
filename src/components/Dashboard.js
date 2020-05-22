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
const [id, setID] = useState(null);
const [occupiedUser, setOccupiedUser] = useState([]);
const [toggleTime,setToggleTime] = useState(false);
const { user,signIn } = useContext(AuthContext);
const [loading,setLoading]= useState(false);

useEffect(() => {
  setInterval(() => {
    readUserData();
  }, 1000);
}, []);

const sendData = (id,timeLimit) => {
  let flag = data.some((items) => items.occupant === user.displayName);
  let arr;
  arr = data.map((items) => {
    if (!flag && items.id === id && items.occupant === "") {
      items.status = !items.status;
      items.occupant = user.displayName;
      items.enabled = true;
      items.timestamp = moment().unix();
      items.timeLimit = timeLimit
      const occupy = {
        RoomId: items.id,
        User: user.displayName,
        timestamp:moment().unix()
      };
      firebase.database().ref("Occupy").push(occupy);
      setID(null)
      setToggleTime(false)
    } else if (flag && items.id === id && items.occupant === user.displayName) {
       items.status = !items.status;
       items.occupant = "";
       items.timestamp = null;
       items.timeLimit = null;
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
    });
  firebase
    .database()
    .ref("Occupy/")
    .on("value", function (snapshot) {
      setOccupiedUser(snapshot.val());
      setLoading(false)
    }); 
};

const remainingTime = (timestamp,timeLimit) => {
  const a = moment(moment(moment.unix(timestamp).toLocaleString()).add(timeLimit,'m').toLocaleString())
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

const extendTime = (roomId,roomName,occupantName,roomTimestamp,extendLimit) => {
  const property = roomId-1
  const updateRoom = {
    enabled:true,
    id:roomId,
    name:roomName,
    occupant:occupantName,
    status:true,
    timestamp:roomTimestamp,
    timeLimit:extendLimit + 10
  }
  firebase.database().ref("Rooms/data").child(property).set(updateRoom);
}

const setTime = (id) => {
  setID(id);
  setToggleTime(true)
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
        <div className="container position-relative">
        <Header
          style={{color: colorCode}}
          src={user && user.photoURL}
          onClick={() => firebase.auth().signOut()}
          stats={stats}
          show={freeRoom !== 0 ? true : false}
        />
        {toggleTime ? 
          <div className="d-flex flex-column bg-white justify-content-center align-items-center position-absolute w-100 h-100" >
            <p className="tag text-center bg-info p-2 w-50 text-white mb-2 hand" onClick={()=> sendData(id,15)}>15 mins</p>
            <p className="tag text-center bg-info p-2 w-50 text-white mb-2 hand" onClick={()=> sendData(id,30)}>30 mins</p>
            <p className="tag text-center bg-info p-2 w-50 text-white mb-2 hand" onClick={()=> sendData(id,45)}>45 mins</p>
            <p className="tag text-center bg-info p-2 w-50 text-white mb-2 hand" onClick={()=> sendData(id,60)}>60 mins</p>
          </div> 
          : null 
        }
        {loading ? <Loader style={{ display: loading ? 'flex' : 'none'}} /> :
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
                remainingTime(item.timestamp,item.timeLimit) <= 0
                  ? lessThanZero(item.id,item.name,item.occupant)
                : remainingTime(item.timestamp,item.timeLimit) > 0 && remainingTime(item.timestamp,item.timeLimit) <= 5
                  ? remainingTime(item.timestamp,item.timeLimit) +  " mins left"
                :
                  remainingTime(item.timestamp,item.timeLimit) + " mins left"
              }
              onClick={item.status ? () => sendData(item.id) : () => setTime(item.id)}
              handleExtend = {() => extendTime(item.id,item.name,item.occupant,item.timestamp,item.timeLimit)}
              showExtend={item.status && remainingTime(item.timestamp,item.timeLimit) <= 5}
              fade={id!==null}
            />
          }) : <p>{message}</p>}
          {id === null ?
            <div className="fixed-bottom mb-5 d-flex justify-content-around align-items-center">
              <div className="d-flex">
                <div className="box" style={{ borderColor:'#999'}}></div>
                <p className="small mx-2">Press to Book</p>
              </div>
              <div className="d-flex">
                <div className="box" style={{ borderColor:'#0c9'}}></div>
                <p className="small mx-2">Press to Vacate</p>
              </div>
            </div> 
            : null 
          }
        <Footer />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
