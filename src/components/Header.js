import React from 'react'

export default function Header({src,onClick}) {
  return (
    <div className="d-flex justify-content-between align-items-center mx-5 w-90">
      <h5 className="text-info text-center my-3">Occupancy Status</h5>
      <div>
        <img src={src} alt="profile" className="pro" />
        <button onClick={onClick}>
          <p className="logout">Sign Out</p>
        </button>
      </div>
    </div>
  )
}
