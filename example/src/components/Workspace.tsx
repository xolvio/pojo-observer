import React from 'react';
import './Workspace.css';
import FileTree from './FileTree'
import FileContent from './FileContentView'
import FileDetails from '../components/FileDetails'
import root from '../root'

function Workspace() {
  return (
    <div className={"flex-container"}>
      <FileTree fileTree={root.fileTree}/>
      <div className={"right"}>
        <FileContent fileContent={root.fileContent}/>
        <FileDetails fileDetails={root.fileDetails}/>
      </div>
    </div>
  );
}

export default Workspace;
