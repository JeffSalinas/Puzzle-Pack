import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

const MobileButtons = ({ shiftDown, setShiftDown }) => {
  const [ mobileShift, setMobileShift ] = useState(false);

  const handleClick = (key) => {
    console.log('down');
    setMobileShift(true)

    var e = new KeyboardEvent("keydown", {
      cancelable: true,
      key: key,
      shiftKey: key === 'Shift' ? true : mobileShift,
    });

    document.dispatchEvent(e);
  };

  const handleShiftUp = (key) => {
    console.log('up')
    setMobileShift(false);
    var e = new KeyboardEvent("keyup", {
      cancelable: true,
      key: key,
      shiftKey: false,
    });

    document.dispatchEvent(e);
  };

  return (
    ReactDOM.createPortal(
      <div id="button-viewPort-container">
        <div id="shift-button-container">
          <div id="shift-R-container" >
            <button className="LRButtons disable-dbl-tap-zoom noselect" onClick={() => handleClick('r')} style={{fontWeight: 'bold', fontSize: '15px'}} >{'R'}</button>
            <button className="LRButtons disable-dbl-tap-zoom noselect" onTouchEnd={() => handleShiftUp('Shift')} onTouchStart={() => handleClick('Shift')} style={{fontWeight: 'bold', fontSize: '15px'}} >{'Shift'}</button>
          </div>
        </div>
        <div id="viewPort-place-holder"></div>
        <div id="mobile-button-container">
          <div className="UDContainer">
            <button className="UDButtons disable-dbl-tap-zoom" onClick={() => handleClick('ArrowUp')}><ArrowDropUpIcon fontSize="large" /> </button>
          </div>
          <div id="LRContainer">
            <button className="LRButtons disable-dbl-tap-zoom" onClick={() => handleClick('ArrowLeft')}><ArrowLeftIcon fontSize="large" /></button>
            <button className="LRButtons disable-dbl-tap-zoom" onClick={() => handleClick('ArrowRight')}><ArrowRightIcon fontSize="large" /></button>
          </div>
          <div className="UDContainer">
            <button className="UDButtons disable-dbl-tap-zoom" onClick={() => handleClick('ArrowDown')}><ArrowDropDownIcon fontSize="large" /></button>
          </div>
        </div>
      </div>,
    document.getElementById('popup')
    )
  );
};

export default MobileButtons;