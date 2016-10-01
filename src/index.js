import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';

import {App} from './app/app';
import {Hello} from './app/hello';
import {Population} from './app/population';
import {PopulationSettings} from './app/population_settings';

import './index.scss';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Hello}/>
      <Route path="/create" component={PopulationSettings}/>
      <Route path="/simulation" component={Population}>
      </Route>
    </Route>

  </Router>,
  document.getElementById('root')
);
