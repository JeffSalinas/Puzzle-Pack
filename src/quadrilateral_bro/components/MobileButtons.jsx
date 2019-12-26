import React from 'react';
import ReactDOM from 'react-dom';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

const MobileButtons = ({ shiftDown, setShiftDown }) => {

  const handleClick = (key) => {
    console.log('click', shiftDown)

    var e = new KeyboardEvent("keydown", {
      cancelable: true,
      key: key,
      shiftKey: key === 'Shift' ? true : shiftDown,
    });

    document.dispatchEvent(e);
  }

  const handleShiftUp = (key) => {
    setShiftDown(false);

    var e = new KeyboardEvent("keyup", {
      cancelable: true,
      key: key,
      shiftKey: false,
    });

    document.dispatchEvent(e);
  }

  return (
    ReactDOM.createPortal(
      <div id="button-viewPort-container">
        <div id="shift-button-container">
          <div id="LRContainer">
            <button className="LRButtons" onMouseUp={() => handleShiftUp('Shift')} onMouseDown={() => handleClick('Shift')} style={{fontWeight: 'bold', fontSize: '15px'}} >{'Shift'}</button>
          </div>
        </div>
        <div id="viewPort-place-holder"></div>
        <div id="mobile-button-container">
          <div className="UDContainer">
            <button className="UDButtons" onClick={() => handleClick('ArrowUp')}><ArrowDropUpIcon fontSize="large" /> </button>
          </div>
          <div id="LRContainer">
            <button className="LRButtons" onClick={() => handleClick('ArrowLeft')}><ArrowLeftIcon fontSize="large" /></button>
            <button className="LRButtons" onClick={() => handleClick('ArrowRight')}><ArrowRightIcon fontSize="large" /></button>
          </div>
          <div className="UDContainer">
            <button className="UDButtons" onClick={() => handleClick('ArrowDown')}><ArrowDropDownIcon fontSize="large" /></button>
          </div>
        </div>
      </div>,
    document.getElementById('popup')
    )
  )
}

export default MobileButtons;