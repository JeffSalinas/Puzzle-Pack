import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import TrickyApp from './tricky_tricky/tricky_app.jsx';
import QuadApp from './quadrilateral_bro/quad_app.jsx';
import Selector from './selector.jsx';

function RouteManager() {
  return (
    <Router>
      <Route exact path="/" component={Selector} />
      <Route path="/QuadrilateralBro" component={QuadApp} />
      <Route path="/TrickyTricky" component={TrickyApp} />
    </Router>
  )
}

export default RouteManager;