import {Given, Then, When} from 'cucumber'
import * as expect from 'expect'
import {File} from "../../src/domain/File"
import {FileTree} from "../../src/domain/FileTree"
import {SimpleEventEmitter} from "../../src/domain/SimpleEventEmitter"
import {WorkspaceService} from "../../src/domain/WorkspaceService"
import {FileContent} from "../../src/domain/FileContent"
import {FileDetails} from "../../src/domain/FileDetails"

const eventEmitter = new SimpleEventEmitter()
const fileTreeSteps = new FileTree(eventEmitter)
const fileDetails = new FileDetails()
const fileContent = new FileContent()
const workspaceService = new WorkspaceService(eventEmitter, fileTreeSteps, fileDetails, fileContent)
workspaceService.init()

Given(/^the following files have been loaded by the File Tree$/, function (filesTable) {
  const files = []
  filesTable.hashes().forEach((file) => {
    files.push(new File(file.filename, file.content, new Date(file.createdAt)))
  })
  fileTreeSteps.load(files)
})

When(/^I select "([^"]*)" in the File Tree$/, function (filename) {
  const file = fileTreeSteps.files.find((file)=> file.filename === filename)
  fileTreeSteps.select(file)
})

Then(/^the File Content should contain "([^"]*)"$/, function (content) {
  expect(fileContent.content).toEqual(content)
})

Then(/^the File Details should contain "([^"]*)"$/, function (createdAt) {
  expect(fileDetails.createdAt.toString()).toEqual(new Date(createdAt).toString())
})
