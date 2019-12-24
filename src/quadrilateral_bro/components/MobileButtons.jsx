import React from 'react';
import ReactDOM from 'react-dom';

const MobileButtons = () => {
  return (
    ReactDOM.createPortal(
      <div id="button-viewPort-container">
        <div id="Shift-button-container">
          <div id="LRContainer">
            <button className="LRButtons">{'Shift'}</button>
          </div>
        </div>
        <div id="viewPort-place-holder"></div>
        <div id="mobile-button-container">
          <div className="UDContainer">
            <button className="UDButtons">{'^'}</button>
          </div>
          <div id="LRContainer">
            <button className="LRButtons">{'<'}</button>
            <button className="LRButtons">{'>'}</button>
          </div>
          <div className="UDContainer">
            <button className="UDButtons">{'V'}</button>
          </div>
        </div>
      </div>,
    document.getElementById('popup')
    )
  )
}

export default MobileButtons;