import React from 'react'
import useObserver from '../lib/pojo-observer'
import {IFileTree} from '../SpecRoot'

const FileTree: React.FC<IFileTree> = (props) => {
  const fileTree = props.fileTree
  useObserver(fileTree)

  function loadFiles() {
    fileTree.loadFiles(/* we would provide a locator object of sorts here */)
  }

  const filesList = fileTree.files.map((file) =>
    <li key={file.canonicalPath}
        onClick={() => fileTree.toggleSelected(file)}
        className={`file-tree_item ${file.selected?"selected":""}`}>
      <span><span role={"img"} aria-label={"File icon"}>📄</span>{file.canonicalPath}</span>
    </li>
  )

  const overlay = fileTree.loading?
    <div className={"overlay"}>Loading...</div>:null

  return (
    <div className={"file-tree"}>
      <h1> File Tree</h1>
      {overlay}
      <button onClick={() => loadFiles()}>Load Files</button>
      <button disabled={fileTree.locked} onClick={() => fileTree.writeFiles()}>Write Files</button> {fileTree.locked?<span>Writing...</span>:'Idle'}
      <ul>{filesList}</ul>
    </div>
  )
}

export default FileTree
