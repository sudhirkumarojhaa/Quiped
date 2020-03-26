/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import './design/App.css';
import { config } from './assets/config';
import loader from "../src/assets/loader.gif";
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const App = () => {
  const [data, setData] = useState([]);
  const [display,setDisplay]= useState(false);
  useEffect(() => {
    readUserData();
  }, []);

  const sendData = id => {
    setDisplay(true);
    const arr = data.map(items => {
      if (items.id === id) {
        items.status = !items.status;
      }
      return items;
    });
    setData(arr);
    firebase
      .database()
      .ref('Rooms/')
      .set({
        data,
      })
  };
  const readUserData = () => {
    setDisplay(true);
    firebase
      .database()
      .ref('Rooms/')
      .on('value', function (snapshot) {
        setData(snapshot.val().data);
        setDisplay(false);
      });
  };
  return (
    <div className="container position-relative vh-100">
      {display ? <div className="loading justify-content-center align-items-center flex-column" style={{ display: display ? 'flex' : 'none' }}>
        <img src={loader} alt="loader" />
        <p className="text-info">Updating status ...</p>
      </div> :
      <div>
      <h5 className="title text-info text-center my-3"> Occupancy Status</h5>
      {/* Mapping of data element */}
      {data !== undefined ?
      data.map(item =>
        <div className="d-flex  justify-content-between list" key={item.id}>
          <p className="text-info">{item.name}</p>
          <div
            style={{ borderColor: item.status ? '#82E871' : '#e3e3e3' }}
            className="box" data-toggle="modal" data-target="#myModal"
            onClick={() => sendData(item.id)}>
          </div>
        </div>
      ) : <p>Please ask your administrator to add rooms.</p>}
      {/* End of Mapping */}
      <div className="btn my-3 d-flex">
        <button onClick={() => window.location.reload()}>
        <p>Refresh status</p>
        </button>
      </div>
      </div>
      }

      <footer className="position-fixed bg-info w-100 d-flex justify-content-between p-3">
        <p className="text-white small">&copy; Copyright 2020, All rights reserved.</p>
        <p className="text-white small">Made with &hearts; by Sudhir</p>
      </footer>
    </div>
  );
};

export default App;
