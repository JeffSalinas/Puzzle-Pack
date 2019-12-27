import React from 'react';
import ReactDOM from 'react-dom';

const Password = (props) => {

  return (
    ReactDOM.createPortal(
      <div className="popupMainContainer">
        <div className="shift-placeholder"></div>
        <div className="popupContainer">
          <div className="popupStyle">
            <div className="title">
            <h3>Tricky Tricky!</h3>
          </div>
          <div id="text">
            Password:
            <input></input>
          </div>
          <p className="pswInstruction">{'Password ? jumpToLvl() : '}<br></br>
          {'*Press Any Key To Begin*'}
            </p>
          </div>
        </div>
        <div className="mobile-buttons-placeholder"></div>
      </div>,
      document.getElementById('password')
    )
  )
}

export default Password;