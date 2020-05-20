/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import '../design/App.css';

export default function ListItem({keyValue,name,item,enabled,onClick,occupied,user,status,time,showExtend,handleExtend}) {
  return (
    <div className="d-flex justify-content-between align-items-center list" >
      <p className="text-info" key={keyValue}>{name}</p>
      <div className="d-flex  justify-content-between ">
        <p className="tab text-info px-3">{time}</p>
        {showExtend && user === item ? <p className="tab text-success px-3" onClick={handleExtend}>Extend Time</p> : null }
        {item ? 
          <p className="tab text-warning px-3">{item}</p> : <p className="tab text-info px-3">Vacant</p>
        }
        <div style={{ borderColor:  status ? '#0c9' : '#999',display: status ? 'block' : occupied.indexOf(user) === -1 && enabled  ? 'block' : 'none' }}
          className="box"
          onClick={onClick} >
        </div>
      </div>
    </div>
  )
}

