import React, {useEffect} from 'react'
import {render, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import useDomain, {Model} from './useDomain'
import {command, hashable, query} from './decorators'

const model: Model = {
  current: undefined,
  hash: () => model.current,
  commands: {
    previous: () => (model.current > 0 ? --model.current : 0),
    next: () => ++model.current
  },
  queries: {current: () => model.current}
}

describe('useDomain', () => {
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
          <p data-testid="current">{queries.current()}</p>
          <button onClick={commands.previous}>previous</button>
        </>
      )
    }

    it('should re-render when a command changes the model', () => {
      const {getByTestId, getByText} = render(<MyComponent model={model} />)

      const previousButton = getByText('previous')
      const current = getByTestId('current')

      expect(current).toHaveTextContent('1')
      expect(numberOfRenders).toBe(1)

      fireEvent.click(previousButton)

      expect(current).toHaveTextContent('0')
      expect(numberOfRenders).toBe(2)
    })

    it('should not re-render when a command does not change the model', () => {
      const {getByTestId, getByText} = render(<MyComponent model={model} />)

      const previousButton = getByText('previous')
      const current = getByTestId('current')

      expect(current).toHaveTextContent('1')
      expect(numberOfRenders).toBe(1)

      fireEvent.click(previousButton)

      expect(current).toHaveTextContent('0')
      expect(numberOfRenders).toBe(2)

      fireEvent.click(previousButton)

      expect(current).toHaveTextContent('0')
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
          <button onClick={commands.previous}>previous</button>
          <button onClick={commands.next}>next</button>
        </>
      )
    }

    it('should record a command history with a sequential id', () => {
      const {getByTestId, getByText} = render(<MyComponent model={model} />)

      const previousButton = getByText('previous')
      const nextButton = getByText('next')
      model.current = 2

      fireEvent.click(previousButton)

      expect(commandHistory.length).toEqual(1)
      expect(commandHistory[0].id).toEqual(0)
      expect(commandHistory[0].command).toEqual('previous')

      fireEvent.click(nextButton)

      expect(commandHistory.length).toEqual(2)
      expect(commandHistory[0].id).toEqual(0)
      expect(commandHistory[0].command).toEqual('previous')
      expect(commandHistory[1].id).toEqual(1)
      expect(commandHistory[1].command).toEqual('next')
    })
  })
  describe('binding strategy', () => {
    it('should bind to models that explicitly define commands and queries', function() {
      let queries, commands

      function MyComponent() {
        ;[queries, commands] = useDomain({
          hash: () => '',
          commands: {aCommand: () => 'a command works'},
          queries: {aQuery: () => 'a query works'}
        })
        return <></>
      }

      render(<MyComponent model={model} />)

      expect(commands.aCommand()).toEqual('a command works')
      expect(queries.aQuery()).toEqual('a query works')
    })
    it('should bind to models that decorate commands and queries', function() {
      @hashable
      class TestClass {
        @command aCommand() {
          return 'a command works'
        }
        @command anotherCommand = () => 'another command works'

        @query aQuery() {
          return 'a query works'
        }
        @query anotherQuery = () => 'another query works'
      }

      const decoratedModel = new TestClass()

      let queries, commands

      function MyComponent() {
        ;[queries, commands] = useDomain(decoratedModel)
        return <></>
      }

      render(<MyComponent model={model} />)

      expect(commands.aCommand()).toEqual('a command works')
      expect(commands.anotherCommand()).toEqual('another command works')
      expect(queries.aQuery()).toEqual('a query works')
      expect(queries.anotherQuery()).toEqual('another query works')
    })
  })
})
