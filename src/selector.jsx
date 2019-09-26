import React from 'react';
import { BrowserRouter as Redirect, NavLink } from "react-router-dom";

function Selector (props) {

  return (
    <div>
      <div id="quadGameBoard">
        <NavLink to='/quadLanding'>
          <button>Quadrilateral Bro</button>
        </NavLink>
        <NavLink to='/trickyLanding'>
        <button>Tricky Tricky</button>
        </NavLink>
      </div>
    </div>
  )
}

export default Selector;