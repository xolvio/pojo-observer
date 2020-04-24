import * as React from 'react';
import useObserver from '../useObserver'
import {IFileDetails} from '../root'

const FileDetails: React.FC<IFileDetails> = (props) => {
  const fileDetails = props.fileDetails
  useObserver(fileDetails)

  return (
    <div className={"file-details"}>
      <h1>File Details</h1>
      <ul>
        <li>filename: {fileDetails.name}</li>
        <li>path: {fileDetails.path}</li>
      </ul>
    </div>
  )
}

export default FileDetails
