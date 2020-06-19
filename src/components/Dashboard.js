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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setID(null)
      setToggleTime(false)
    } else if (flag && items.id === id && items.occupant === user.displayName) {
       items.status = !items.status;
       items.occupant = "";
       items.timestamp = null;
       items.timeLimit = null;
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
      setOccupiedUser(snapshot.val().data.some(item => item.occupant === user.displayName))
      setLoading(false)
    });
};

const remainingTime = (timestamp,timeLimit) => {
  const a = moment(moment.unix(timestamp).toLocaleString()).add(timeLimit,'m')
  let totalseconds = a.diff(moment(),'seconds');
  let formatted
  if(timeLimit === 1440){
    if(moment.unix(timestamp).format('DD') !== moment().format('DD')){
      formatted = '00:00:00'
    } else{
      formatted = 'full day'
    }
  } else if(timeLimit === 239){
    formatted = moment.utc(totalseconds * 1000).format('hh:mm:ss')
  }
  else{
    formatted = moment.utc(totalseconds * 1000).format('mm:ss')
  }
  return formatted
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
    timeLimit:extendLimit + 15
  }
  firebase.database().ref("Rooms/data").child(property).set(updateRoom);
}

const setTime = (id) => {
  setID(id);
  setToggleTime(true)
}

if(!signIn){
  return <Redirect to={"/"} />
}

const freeRoom = data.filter(item => item.occupant === '').length;
const stats= freeRoom === 0 ? 'No room' : freeRoom === 1 ? '1 room' : `${freeRoom} rooms`;
const colorCode = stats === 'No room' ? 'tomato' : '#38a2b8';
  return data.length !== 0 ? (
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
          <div className="d-flex bg-white flex-column justify-content-center align-items-center position-absolute w-100 h-100" >
            <div className="d-flex flex-column justify-content-around">
              <h6 className="font-weight-bold p-2 text-center text-info small">Select Time period for the meeting. </h6>
              <button onClick={() => sendData(id,15)}>15 mins</button>
              <button onClick={() => sendData(id,30)}>30 mins</button>
              <button onClick={() => sendData(id,45)}>45 mins</button>
              <button onClick={() => sendData(id,59.99)}>60 mins</button>
              <button onClick={() => sendData(id,239)}>4 hours</button>
              <button onClick={() => sendData(id,1440)}>Full Day</button>
            </div>
            <p className="tag font-weight-bold position-absolute close" onClick={() => {setToggleTime(false); setID(null);}}>X</p>
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
              occupied={occupiedUser}
              user={user.displayName}
              enabled={item.enabled}
              time={
                remainingTime(item.timestamp,item.timeLimit) <= "00:00:00 mins left"
                  ? lessThanZero(item.id,item.name,item.occupant)
                : remainingTime(item.timestamp,item.timeLimit) > 0 && remainingTime(item.timestamp,item.timeLimit) <= 5
                  ? remainingTime(item.timestamp,item.timeLimit) +  " mins left"
                : remainingTime(item.timestamp,item.timeLimit) === 'full day'
                  ? "Full day"
                :
                  remainingTime(item.timestamp,item.timeLimit) + " mins left"
              }
              onClick={item.status ? () => sendData(item.id) : () => setTime(item.id)}
              handleExtend = {() => extendTime(item.id,item.name,item.occupant,item.timestamp,item.timeLimit)}
              showExtend={item.status && remainingTime(item.timestamp,item.timeLimit) <= "00:05:00 mins left"}
              fade={id!==null}
            />
          }) : <p>{message}</p>}
          {id === null ?
            <div className="fixed-bottom flex-column  mb-5 d-flex">
              <p className="text-center small text-info pb-2">How to use ?</p>
              <div className="d-flex justify-content-around align-items-center">
              <div className="d-flex align-items-center">
                <p className="small mx-2">Press</p>
                <div className="boxs" style={{ borderColor:'#999'}}></div>
                <p className="small mx-2">to Book a room.</p>
              </div>
              <div className="d-flex align-items-center">
                <p className="small mx-2">Press</p>
                <div className="boxs" style={{ borderColor:'#0c9'}}></div>
                <p className="small mx-2"> to Vacate a room.</p>
              </div>
              </div>
            </div>
            : null
          }
        <Footer />
        </div>
      </div>
    </div>
  ) : null;
};

export default Dashboard;
