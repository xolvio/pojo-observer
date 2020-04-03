import React from 'react'
import useObserver from '../lib/pojo-observer'
import {IFileTree} from '../SpecRoot'

const FileTree: React.FC<IFileTree> = (props) => {
  const fileTree = props.fileTree
  useObserver(fileTree)

  const filesList = fileTree.files.map((file) =>
    <li key={file.canonicalPath}
        onClick={() => fileTree.toggleSelected(file)}
        className={`file-tree_item ${file.selected?"selected":""}`}>
          <span role={"img"} aria-label={"File icon"}>📄</span>{file.canonicalPath} [{file.selected.toString()}]
    </li>
  )

  return (
    <div className={"file-tree"}>
      <h1> File Tree</h1>
      <ul>{filesList}</ul>
    </div>
  )
}

export default FileTree
