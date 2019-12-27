import React from 'react';
import ReactDOM from 'react-dom';

const Out = (props) => {

  return (
    ReactDOM.createPortal(
      <div className="popupMainContainer">
        <div className="shift-placeholder"></div>
        <div className="popupContainer">
          <div className="popupStyle">
            <div className="title">
              <h3>Tricky Tricky!</h3>
            </div>
            <div id="text2">Try Again!</div>
          </div>
        </div>
        <div className="mobile-buttons-placeholder"></div>
      </div>,
      document.getElementById('popup')
    )
  );
};
  
export default Out;