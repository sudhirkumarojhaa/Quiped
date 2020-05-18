import React, { useEffect, useState } from 'react'
import moment from 'moment';
import firebase from 'firebase';
import '../design/App.css';

export default function ListItem({key,name,item,enabled,onClick,occupied,user,status,timestamp}) {
  const [time,setTime] = useState(null)
  const [extend,setExtend] = useState(false)

  useEffect(() => {
    setInterval(() => {
      remainingTime()
    }, 1000);
    if(timestamp === null){
      setExtend(false)
    }
  },[])



  const remainingTime = () => {
    const a = moment(moment(moment.unix(timestamp).toLocaleString()).add(4,'m').toLocaleString())
    const b = moment.unix(moment().unix()).toLocaleString()


    if(timestamp !== undefined && a.diff(b,'minutes') > 5){
      console.log(timestamp)
      setTime(a.diff(b,'minutes'))  
    } else if (a.diff(b,'minutes') <= 0){
      console.log(item)
       firebase
        .database()
        .ref("Rooms/data")
        .on("value", function (snapshot) {
          for(const property in snapshot.val()){
            if(snapshot.val()[property].occupant === item){
              console.log(property)
              const updateRoom = {
                enabled:true,
                id:property+1,
                name:name,
                occupant:"",
                status:false,
              }
              firebase.database().ref("Rooms/data").child(property).set(updateRoom);
            } 
          }
        })
       firebase
        .database()
        .ref("Occupy/")
        .on("value", function (snapshot) {
        for (const property in snapshot.val()){
          if(snapshot.val()[property].User === item){
            firebase.database().ref().child("Occupy/"+property).remove()
          }
        }
    });
    } else if(a.diff(b,'minutes') > 0 && a.diff(b,'minutes') <= 5){
        setTime(a.diff(b,'minutes'))  
        setExtend(true)
    }
  }

  const extendTime = () => {
    firebase
        .database()
        .ref("Rooms/data")
        .on("value", function (snapshot) {
          for(const property in snapshot.val()){
            if(snapshot.val()[property].occupant === item){
              console.log(item)
              const extendTime = {
                enabled:true,
                id:property+1,
                name:name,
                occupant:item,
                status:true,
                timestamp:moment().unix()
              }
              console.log(extendTime)
              firebase.database().ref("Rooms/data").child(property).set(extendTime);
            } 
          }
        })
      setExtend(false)
  }
  
  
  return (
    <div onClick={onClick} className="d-flex justify-content-between align-items-center list" key={key}>
      <p className="text-info">{name}</p>
      <div className="d-flex  justify-content-between align-items-center ">
        {timestamp ? <p className="tab text-danger px-3">{time} minutes remaining</p> : null }
        {extend ? <button className="btn-sm btn-success" onClick={() => extendTime()}>Extend Time</button> : null}
        {item ? 
          <p className="tab text-warning px-3">{item}</p> : <p className="tab text-info px-3">Vacant</p>
        }
        <div style={{ borderColor:  status ? '#0c9' : 'grey',display: status ? 'block' : occupied.indexOf(user) === -1 && enabled  ? 'block' : 'none' }}
          className="box">
        </div>
      </div>
    </div>
  )
}

