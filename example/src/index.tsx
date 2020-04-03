import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Spec from './pages/Spec';
import root from './SpecRoot'

// fixme pojo-observer is broken here too
root.specService.init()

ReactDOM.render(
  <React.StrictMode>
    {/* We would use a router and a layout here */}
    <Spec />
  </React.StrictMode>,
  document.getElementById('root')
);


