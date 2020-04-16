import React from 'react'

export default function Header({src,onClick,stats,style}) {
  return (
    <div className="pb-3">
      <div className="d-flex justify-content-between align-items-center w-90">
        <h6 className="my-3 font-weight-bold" style={style}>Occupancy Status: {stats} available </h6>
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
    </div>
  )
}
