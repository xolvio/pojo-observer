import React from 'react';
import './Spec.css';
import FileTree from '../components/FileTree'
import FileContents from '../components/FileContents'
import FileDetails from '../components/FileDetails'
import root from '../SpecRoot'

function Spec() {
  return (
    <div className={"flex-container"}>
      <FileTree fileTree={root.fileTree}/>
      <div className={"right"}>
        <FileContents fileContents={root.fileContents}/>
        <FileDetails fileDetails={root.fileDetails}/>
      </div>
    </div>
  );
}

export default Spec;
