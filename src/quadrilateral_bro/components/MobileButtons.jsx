import React from 'react';

const MobileButtons = () => {
  return(
    <>
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
    </>
  )
}

export default MobileButtons;