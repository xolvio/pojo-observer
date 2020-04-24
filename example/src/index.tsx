import * as React from 'react'
import ReactDOM from 'react-dom'
import './index.css';
import Workspace from './components/Workspace';
import root from './root'

root.workspaceService.init()

ReactDOM.render(
  <React.StrictMode>
    {/* We would use a router and a layout here */}
    <Workspace />
  </React.StrictMode>,
  document.getElementById('root')
);


