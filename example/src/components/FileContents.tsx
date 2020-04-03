import * as React from 'react';
import useObserver from '../lib/pojo-observer'
import {IFileContents} from '../SpecRoot'

const FileContents: React.FC<IFileContents> = (props) => {
  const fileView = props.fileContents
  useObserver(props.fileContents)
  return (
    <div className={"file-contents"}>
      <h1>File Contents</h1>
      <h3>{fileView.name}</h3>
      <p>{fileView.content}</p>
    </div>
  )
}

export default FileContents
