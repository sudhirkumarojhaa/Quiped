import React from 'react'
import off from "../assets/off.png";

export default function Header({src,onClick,stats,style,show}) {
  return (
    <div className="pb-3 header">
      <div className="d-flex justify-content-between align-items-center">
        {show ? <h6 className="my-3 font-weight-bold" style={style}>Occupancy Status: {stats} available </h6> :  <h6 className="my-3  font-weight-bold text-info">HDR Conference Room Management</h6> }
        <div className="d-flex ml-3">
          <img src={src} alt="profile" className="profile" />
          <button onClick={onClick}>
            <p className="logout font-weight-bold">Sign Out</p>
            <img className="off" src={off} alt="loader" />
          </button>
        </div>
      </div>
      <li className="small text-dark font-weight-bold">Rooms already occupied by other members can't be occupied.</li>
      <li className="small text-dark font-weight-bold">You can only occupy one vacant room at a time.</li>
      <li className="small text-dark font-weight-bold">Extend button would be visible five minutes before the end time. Clicking on it will add another 15 mins in your end time.</li>
      <li className="small text-dark font-weight-bold">Rooms will automatically vacate after the alloted time.However, Do remember to vacate by clicking again at the end of the meeting.</li>
    </div>
  )
}
