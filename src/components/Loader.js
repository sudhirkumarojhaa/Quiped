import React from 'react'
import loader from "../assets/loader.gif";

export default function Loader(style) {
  return (
    <div className="loading d-flex justify-content-center align-items-center flex-column" style={style}>
      <img src={loader} alt="loader" />
    </div>
  )
}
