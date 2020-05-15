import React, { useEffect, useState } from 'react'
import moment from 'moment';
import firebase from 'firebase';
import '../design/App.css';

export default function ListItem({key,name,item,enabled,onClick,occupied,user,status,timestamp}) {

  const [time,setTime] = useState(null)

  useEffect(() => {
    setInterval(() => {
      remainingTime()
    }, 1000);
  },[])



  const remainingTime = () => {
    const a = moment(moment(moment.unix(timestamp).toLocaleString()).add(2,'m').toLocaleString())
    const b = moment.unix(moment().unix()).toLocaleString()
    const roomId = key-1
    if(timestamp !== undefined){
      setTime(a.diff(b,'minutes'))  
    }
    if(timestamp !== undefined && a.diff(b,'minutes') <= 0){
       
       
       firebase
        .database()
        .ref("Rooms/data")
        .on("value", function (snapshot) {
          for(const property in snapshot.val()){
            if(snapshot.val()[property].occupant === user){
              console.log(property)
              const updateRoom = {
                enabled:true,
                id:property,
                name:name,
                occupant:"",
                status:false
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
          if(snapshot.val()[property].User === user){
            firebase.database().ref().child("Occupy/"+property).remove()
          }
        }
    });
    }
  }
  
  
  return (
    <div onClick={onClick} className="d-flex justify-content-between align-items-center list" key={key}>
      <p className="text-info">{name}</p>
      <div className="d-flex  justify-content-between align-items-center ">
        {timestamp ? <p className="tab text-danger px-3">{time} minutes remaining</p> : null }
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

