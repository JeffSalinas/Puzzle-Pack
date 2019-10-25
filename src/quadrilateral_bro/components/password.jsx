import React from 'react';
import ReactDOM from 'react-dom';

const Password = (props) => {

  return (
    ReactDOM.createPortal(
      <div className="popupContainer">
        <div className="popupStyle">
          <div className="title">
            <h3>Quadrilateral Bro</h3>
          </div>
          <div id="text">
            Password:
            <input onKeyDown={props.passwordHandler}></input>
          </div>
          <p className="pswInstruction">{'Password ? jumpToLvl() : '}<br></br>
          {'*Press Any Key To Begin*'}
          </p>
        </div>
      </div>,
      document.getElementById('password')
    )
  )
}

export default Password;