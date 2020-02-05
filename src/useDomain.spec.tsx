import React, {useEffect} from 'react'
import {render, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import useDomain, {Model} from './useDomain'
import {command, hashable, query, live} from './decorators'

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
  describe('re-rendering', () => {
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

    it('should re-render when an attribute decorated with @live is set in the model', async () => {
      @hashable
      class ModelClass {
        @live _internalProperty = 'initialState'
        internalChange = () => (this._internalProperty = 'internalChange')
      }

      const model = new ModelClass()

      function MyComponent() {
        useDomain(model)
        return (
          <>
            <p data-testid="name">{model._internalProperty}</p>
          </>
        )
      }

      const {getByTestId} = render(<MyComponent model={model} />)

      expect(getByTestId('name')).toHaveTextContent('initialState')
      model.internalChange()
      expect(getByTestId('name')).toHaveTextContent('internalChange')
    })

    it('should re-render when an attribute decorated with @live is asynchronously set in the model', async () => {
      @hashable
      class ModelClass {
        @live _internalProperty = 'initialState'
        internalChange = () => (this._internalProperty = 'internalChange')
      }

      const model = new ModelClass()

      function MyComponent() {
        useDomain(model)
        return (
          <>
            <p data-testid="name">{model._internalProperty}</p>
          </>
        )
      }

      const {getByTestId} = render(<MyComponent model={model} />)

      expect(getByTestId('name')).toHaveTextContent('initialState')

      setTimeout(() => (model._internalProperty = 'Out of band'), 10)
      expect(getByTestId('name')).toHaveTextContent('initialState')

      await new Promise(resolve => setTimeout(resolve, 100))
      expect(getByTestId('name')).toHaveTextContent('Out of band')
    })

    it('should re-render when a setter decorated with @command is called on the model', () => {
      @hashable
      class ModelClass {
        _internalProperty = 'initialState'

        @command set foo(val) {
          this._internalProperty = val
        }

        showName() {
          return this._internalProperty
        }

        internalChange() {
          this.foo = 'internalChange'
        }
      }

      const model = new ModelClass()

      function MyComponent() {
        useDomain(model)
        return (
          <>
            <p data-testid="name">{model.showName()}</p>
          </>
        )
      }

      const {getByTestId} = render(<MyComponent model={model} />)

      expect(getByTestId('name')).toHaveTextContent('initialState')
      model.internalChange()
      expect(getByTestId('name')).toHaveTextContent('internalChange')
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

        @query aQuery() {
          return 'a query works'
        }
      }

      const decoratedModel = new TestClass()

      let queries, commands

      function MyComponent() {
        ;[queries, commands] = useDomain(decoratedModel)
        return <></>
      }

      render(<MyComponent model={model} />)

      expect(commands.aCommand()).toEqual('a command works')
      expect(queries.aQuery()).toEqual('a query works')
    })

    it('should bind to models that decorate commands and queries with anonymous functions', function() {
      @hashable
      class TestClass {
        @command anotherCommand = () => 'another command works'
        @query anotherQuery = () => 'another query works'
      }

      const decoratedModel = new TestClass()

      let queries, commands

      function MyComponent() {
        ;[queries, commands] = useDomain(decoratedModel)
        return <></>
      }

      render(<MyComponent model={model} />)

      expect(commands.anotherCommand()).toEqual('another command works')
      expect(queries.anotherQuery()).toEqual('another query works')
    })
  })
})
