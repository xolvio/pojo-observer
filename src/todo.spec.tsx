/* eslint-disable react/button-has-type */
import * as React from 'react'
import '@testing-library/jest-dom'
import {render} from '@testing-library/react'

import useObserver from './useObserver'

class TodoList {
  public todos: string[] = []

  addTodo(todo: string) {
    this.todos = [...this.todos, todo]
  }

  deleteToto(todo: string) {
    this.todos = this.todos.filter((t) => t !== todo)
  }
}

const state = new TodoList()

const MyComponent = () => {
  useObserver(state)

  return (
    <div>
      <ol>
        {state.todos.map((todo) => (
          <li key={todo} data-testid={todo}>
            {todo}
            <button onClick={() => state.deleteToto(todo)}>delete</button>
          </li>
        ))}
      </ol>
      <button
        onClick={() => {
          state.addTodo('first todo')
        }}
      >
        Add
      </button>
    </div>
  )
}

test('issue #20', () => {
  const {getByText, getByTestId, queryByText} = render(<MyComponent />)

  getByText('Add').click()

  getByTestId('first todo')

  getByText('delete').click()

  expect(queryByText('first todo')).not.toBeInTheDocument()
})
