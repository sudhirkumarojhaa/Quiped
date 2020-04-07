import React from 'react'
import '../design/App.css';
export default function ListItem({key,name,item,enabled,onClick,status}) {
  console.log(enabled)
  return (
    <div  style={{ display:  enabled ? 'red' : 'green' }} className="d-flex  justify-content-between align-items-center list" key={key}>
      <p className="text-info">{name}</p>
      <div className="d-flex  justify-content-between align-items-center ">
        {item ?
          <p className="tab text-warning px-3">{item}</p> : <p className="tab text-info px-3">Vacant</p>
        }
        <div
          style={{ borderColor:  status ? 'green' : 'grey',display:  enabled ? 'block' : 'none' }}
          className="box" onClick={onClick}>
        </div>
      </div>
    </div>
  )
}

