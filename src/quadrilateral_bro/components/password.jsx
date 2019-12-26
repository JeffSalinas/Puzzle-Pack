import React from 'react';
import ReactDOM from 'react-dom';

const Password = ({password, setPassword, submitPassword}) => {

  return (
    ReactDOM.createPortal(
      <div className="popupMainContainer">
        <div className="shift-placeholder"></div>
        <div className="popupContainer">
          <div className="popupStyle">
            <div className="title">
              <h3>Quadrilateral Bro</h3>
            </div>
            <div id="text">
              Password:
              <form onSubmit={submitPassword}>
                <input id="password_input" value={password} onChange={setPassword}></input>
              </form>
            </div>
            <p className="pswInstruction">{'Enter A Password Or' } <br></br>
            {'*Press Any Key To Begin*'}
            </p>
          </div>
        </div>
        <div className="mobile-buttons-placeholder"></div>
      </div>,
      document.getElementById('password')
    )
  );
};

export default Password;