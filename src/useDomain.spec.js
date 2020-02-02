import React, {useEffect} from 'react'
import ReactDOM from 'react-dom'
import {act} from 'react-dom/test-utils'

import useDomain from './useDomain'

const model = {}
model.hash = () => model.current
model.commands = {
  previous: () => model.current > 0 ? --model.current : 0,
  next: () => ++model.current
}
model.queries = {current: () => model.current}

describe('useDomain', () => {

  let container

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
    container = null
  })

  describe('rendering', () => {
    let numberOfRenders
    beforeEach(() => {
      numberOfRenders = 0
      model.current = 1
    })

    function MyComponent() {
      const [queries, commands] = useDomain(model)
      useEffect(() => {
        numberOfRenders++
      })
      return (
        <>
          <p>{queries.current()}</p>
          <button onClick={commands.previous}>previous</button>
        </>
      )
    }

    it('should re-render when a command changes the model', () => {
      act(() => {
        ReactDOM.render(<MyComponent model={model}/>, container)
      })
      const button = container.querySelector('button')
      const label = container.querySelector('p')

      expect(label.textContent).toBe("1")
      expect(numberOfRenders).toBe(1)

      act(() => {
        button.dispatchEvent(new MouseEvent('click', {bubbles: true}))
      })

      expect(label.textContent).toBe('0')
      expect(numberOfRenders).toBe(2)
    })
    it('should not re-render when a command does not change the model', () => {
      act(() => ReactDOM.render(<MyComponent model={model}/>, container))
      const button = container.querySelector('button')
      const label = container.querySelector('p')

      expect(label.textContent).toBe("1")
      expect(numberOfRenders).toBe(1)

      act(() => {
        button.dispatchEvent(new MouseEvent('click', {bubbles: true}))
      })

      expect(label.textContent).toBe('0')
      expect(numberOfRenders).toBe(2)

      act(() => {
        button.dispatchEvent(new MouseEvent('click', {bubbles: true}))
      })

      expect(label.textContent).toBe('0')
      expect(numberOfRenders).toBe(2)
    })
  })
  describe('history', () => {
    let commandHistory

    function MyComponent() {
      const [, commands, history] = useDomain(model)
      commandHistory = history

      return (
        <>
          <button id="previous" onClick={commands.previous}>previous</button>
          <button id="next" onClick={commands.next}>next</button>
        </>
      )
    }

    it('should record a command history with a sequential id', () => {
      act(() => ReactDOM.render(<MyComponent model={model}/>, container))
      const previousButton = container.querySelector('button#previous')
      const nextButton = container.querySelector('button#next')
      model.current = 2

      act(() => {
        previousButton.dispatchEvent(new MouseEvent('click', {bubbles: true}))
      })
      expect(commandHistory.length).toEqual(1)
      expect(commandHistory[0].id).toEqual(0)
      expect(commandHistory[0].command).toEqual('previous')

      act(() => {
        nextButton.dispatchEvent(new MouseEvent('click', {bubbles: true}))
      })
      expect(commandHistory.length).toEqual(2)
      expect(commandHistory[0].id).toEqual(0)
      expect(commandHistory[0].command).toEqual('previous')
      expect(commandHistory[1].id).toEqual(1)
      expect(commandHistory[1].command).toEqual('next')
    });
  })
  describe('binding strategy', () => {
    it('should bind to models that explicitly define commands and queries', function () {
      let queries, commands

      function MyComponent() {
        [queries, commands] = useDomain({
          hash: () => '',
          commands: {aCommand: () => 'a command works'},
          queries: {aQuery: () => 'a query works'},
        })
        return (<></>)
      }

      act(() => ReactDOM.render(<MyComponent model={model}/>, container))

      expect(commands.aCommand()).toEqual('a command works')
      expect(queries.aQuery()).toEqual('a query works')
    });
    it('should bind to models that decorate commands and queries', function () {
      const decoratedModel = {
        hash: () => '',
        aCommand: () => 'a command works',
        anotherCommand: () => 'another command works',
        aQuery: () => 'a query works',
        anotherQuery: () => 'another query works',
      }
      decoratedModel.aCommand.command = true
      decoratedModel.anotherCommand.command = true
      decoratedModel.aQuery.query = true
      decoratedModel.anotherQuery.query = true

      let queries, commands

      function MyComponent() {
        [queries, commands] = useDomain(decoratedModel)
        return (<></>)
      }

      act(() => ReactDOM.render(<MyComponent model={model}/>, container))

      expect(commands.aCommand()).toEqual('a command works')
      expect(commands.anotherCommand()).toEqual('another command works')
      expect(queries.aQuery()).toEqual('a query works')
      expect(queries.anotherQuery()).toEqual('another query works')
    });
  })
})
