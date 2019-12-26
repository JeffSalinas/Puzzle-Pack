import React from 'react';
import ReactDOM from 'react-dom';

const Popup = (props) => {

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
                Level: {props.currentlvl}<br></br>
                Password: {props.level.password}
            </div>
            <p id="instruction">*Press Any Key To Begin*</p>
          </div>
        </div>
        <div className="mobile-buttons-placeholder"></div>
      </div>,
      document.getElementById('popup')
    )
  );
};

export default Popup;