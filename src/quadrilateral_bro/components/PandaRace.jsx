import React from 'react';
import ReactDOM from 'react-dom';

const PandaRace = ({ submitRaceName, raceName, setRaceName, highScore }) => {

  const handleChange = (e) => {
    e.preventDefault()

    if (e.target.value.length <= 8) {
      setRaceName(e);
    }
  }

  return (
    ReactDOM.createPortal(
      <div className="popupContainer" >
        <div className="popupStyle" style={{ height: "230px", margin: '25px 116px'}}>
          <div className="title">
            <h3 style={{fontSize: '22px'}}>The Great Panda Race</h3>
          </div>
          <p className="raceInstruction">{'Enter your name below to enter a timed race or press any key for standard play.'}
          </p>
          <div id="text" style={{fontSize: '17px', padding: '0 25px 5px 25px', alignSelf: 'flex-end'}}> 
            <form onSubmit={submitRaceName}>
              <input id="name_input" value={raceName} onChange={handleChange}></input>
            </form>
            <div className="highScoreListItemContainer">
              <p className="highScoreListName" style={{ fontWeight: 'bold', width: '100%', textAlign: 'center' }}>High Score</p>
              <p className="highScoreListName" style={{fontWeight: 'bold'}}>Name:</p>
              <p className="highScoreListTime" style={{ fontWeight: 'bold' }}>Time:</p>
            </div>
            {highScore.map((el, index)=> {
              return (
                <div key={index} className="highScoreListItemContainer">
                  <p className="highScoreListName">{[index + 1].toString() + '. ' + el.name}</p>
                  <p className="highScoreListTime">{el.time}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>,
      document.getElementById('password')
    )
  )
}

export default PandaRace;