import {Given, Then, When} from 'cucumber'
import expect from 'expect'
import {File} from '../../src/domain/File'
import {FileTree} from '../../src/domain/FileTree'
import {SimpleEventEmitter} from '../../src/domain/SimpleEventEmitter'
import {WorkspaceService} from '../../src/domain/WorkspaceService'
import {FileContent} from '../../src/domain/FileContent'
import {FileDetails} from '../../src/domain/FileDetails'
import {MemoryFileRepository} from "../../src/domain/MemoryFileRepository"

const eventEmitter = new SimpleEventEmitter()
const memoryFileRepository = new MemoryFileRepository()
const fileTree = new FileTree(eventEmitter, memoryFileRepository)
const fileDetails = new FileDetails()
const fileContent = new FileContent()
const workspaceService = new WorkspaceService(
  eventEmitter,
  fileTree,
  fileContent,
  fileDetails
)
workspaceService.init()

Given(/^the following files have been loaded by the File Tree$/, function (filesTable, done) {
  memoryFileRepository.files =
    filesTable.hashes().map((file) => new File(file.filename, file.content, file.path))
  fileTree.loadFiles(done)
})

When(/^I select "([^"]*)" in the File Tree$/, function (filename) {
  fileTree.toggleSelected(
    fileTree.files.find((file) => file.name === filename)
  )
})

Then(/^the File Content should contain "([^"]*)"$/, function (content) {
  expect(fileContent.content).toEqual(content)
})

Then(/^the File Details path should be "([^"]*)"$/, function (path) {
  expect(fileDetails.path).toEqual(path)
})
