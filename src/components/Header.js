import React from 'react'

export default function Header({src,onClick,freeRoom,totalRoom}) {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center w-90">
        <h5 className="text-info text-center my-3">Quiped App</h5>
        <div>
          <img src={src} alt="profile" className="profile" />
          <button onClick={onClick}>
            <p className="logout">Sign Out</p>
          </button>
        </div>
      </div>
      <li className="small font-weight-bold text-dark">Rooms already occupied by other members can't be occupied.</li>
      <li className="small font-weight-bold text-dark">You can only occupy one room at a time which are vacant.</li>
      <li className="small font-weight-bold text-dark">At the end of the meeting please click again to vacate.</li>
      <div className="d-flex justify-content-between align-items-center w-90 py-2">
        <p className="tab font-weight-bold text-info">Rooms Occupied</p>
        <p className="tab font-weight-bold text-info">{freeRoom} / {totalRoom}</p>
      </div>
    </div>
  )
}
