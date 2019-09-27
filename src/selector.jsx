import React from 'react';
import { BrowserRouter as Redirect, NavLink } from "react-router-dom";

function Selector (props) {

  return (
    <div className="viewPort">
      <div id="selectorGameBoard">
        <h1>
          Choose Your Adventure!
        </h1>
          <NavLink to='/QuadrilateralBro'>
            <img className="selectorButtons" src="./images/quadButton.png"></img>
          </NavLink>
          <NavLink to='/TrickyTricky'>
            <img className="selectorButtons" src="./images/trickyButton.png"></img>
          </NavLink>
      </div>
    </div>
  )
}

export default Selector;