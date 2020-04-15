/* eslint-disable max-classes-per-file */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'react'
import {render, act} from '@testing-library/react'
import useObserver from './useObserver'
import '@testing-library/jest-dom/extend-expect'
import {addHash} from './addHash'

test('add hash internally', () => {
  class TestClass {
    current = 2

    previous(): void {
      this.current--
    }

    getCurrent(): number {
      return this.current
    }
  }

  const obj = new TestClass()

  function ComponentUsingModel({model}: {model: TestClass}) {
    useObserver(model)

    return (
      <div>
        <button onClick={(): void => model.previous()}>
          Change the numbers in first component
        </button>
        <div data-testid={'numberInFirst'}>{model.getCurrent()}</div>
      </div>
    )
  }

  function OtherComponentUsingModel({model}: {model: TestClass}) {
    useObserver(model)

    return (
      <div>
        <button onClick={(): void => model.previous()}>
          Change in the other component
        </button>
        <div data-testid={'numberInOther'}>{model.getCurrent()}</div>
      </div>
    )
  }

  function ComponentWithNestedUseOfTheModelObject() {
    return (
      <>
        <ComponentUsingModel model={obj} />
        <OtherComponentUsingModel model={obj} />
      </>
    )
  }

  const {getByTestId, getByText} = render(
    <ComponentWithNestedUseOfTheModelObject />
  )

  expect(getByTestId('numberInFirst')).toHaveTextContent('2')
  expect(getByTestId('numberInOther')).toHaveTextContent('2')

  getByText('Change the numbers in first component').click()

  expect(getByTestId('numberInFirst')).toHaveTextContent('1')
  expect(getByTestId('numberInOther')).toHaveTextContent('1')
})

test('that it can work with objects', () => {
  const obj = {
    foo: 'here',
    mutateMe: (): string => (obj.foo = 'there'),
  }

  function ComponentUsingModel({model}) {
    useObserver(model)

    return (
      <div>
        <div data-testid={'foo'}>{model.foo}</div>
      </div>
    )
  }

  const {getByTestId} = render(<ComponentUsingModel model={obj} />)

  expect(getByTestId('foo')).toHaveTextContent('here')
  act(() => {
    obj.mutateMe()
  })
  expect(getByTestId('foo')).toHaveTextContent('there')
})

test('that it can work with multiple objects', () => {
  const obj1 = {
    foo: 'here',
    mutateMe: (): string => (obj1.foo = 'there'),
  }

  const obj2 = {
    bar: 'pete',
    mutateMe: (): string => (obj2.bar = 'paul'),
  }

  function ComponentUsingModel({model1, model2}) {
    useObserver(model1)
    useObserver(model2)

    return (
      <div>
        <div data-testid={'foo'}>{model1.foo}</div>
        <div data-testid={'bar'}>{model2.bar}</div>
      </div>
    )
  }

  const {getByTestId} = render(
    <ComponentUsingModel model1={obj1} model2={obj2} />
  )

  expect(getByTestId('foo')).toHaveTextContent('here')
  expect(getByTestId('bar')).toHaveTextContent('pete')
  act(() => {
    obj1.mutateMe()
  })
  expect(getByTestId('foo')).toHaveTextContent('there')
  expect(getByTestId('bar')).toHaveTextContent('pete')
  act(() => {
    obj2.mutateMe()
  })
  expect(getByTestId('bar')).toHaveTextContent('paul')
})

test('that it can work with multiple objects', () => {
  const obj1 = {
    foo: 'here',
    mutateMe: (): string => (obj1.foo = 'there'),
  }

  const obj2 = {
    bar: 'pete',
    mutateMe: (): string => (obj2.bar = 'paul'),
  }

  function ComponentUsingModel1({model}) {
    useObserver(model)

    return (
      <div>
        <div data-testid={'foo'}>{model.foo}</div>
      </div>
    )
  }

  function ComponentUsingModel2({model}) {
    useObserver(model)

    return (
      <div>
        <div data-testid={'bar'}>{model.bar}</div>
      </div>
    )
  }

  const getByTestId1 = render(<ComponentUsingModel1 model={obj1} />).getByTestId
  const getByTestId2 = render(<ComponentUsingModel2 model={obj2} />).getByTestId

  expect(getByTestId1('foo')).toHaveTextContent('here')
  expect(getByTestId2('bar')).toHaveTextContent('pete')
  act(() => {
    obj1.mutateMe()
  })
  expect(getByTestId1('foo')).toHaveTextContent('there')
  expect(getByTestId2('bar')).toHaveTextContent('pete')
  act(() => {
    obj2.mutateMe()
  })
  expect(getByTestId1('foo')).toHaveTextContent('there')
  expect(getByTestId2('bar')).toHaveTextContent('paul')
})

test('add hash explicitly', () => {
  class TestClass {
    current = 2

    previous(): void {
      this.current--
    }

    getCurrent(): number {
      return this.current
    }
  }

  function ComponentUsingModel({model}: {model: TestClass}) {
    const methods = useObserver(addHash(model))

    return (
      <div>
        <button onClick={() => methods.previous()}>
          Change the numbers in first component
        </button>
        <div data-testid={'numberInFirst'}>{methods.getCurrent()}</div>
      </div>
    )
  }

  function OtherComponentUsingModel({model}: {model: TestClass}) {
    const methods = useObserver(addHash(model))

    return (
      <div>
        <button onClick={() => methods.previous()}>
          Change in the other component
        </button>
        <div data-testid={'numberInOther'}>{methods.getCurrent()}</div>
      </div>
    )
  }

  function ComponentWithNestedUseOfTheModelObject() {
    const model = new TestClass()
    return (
      <>
        <ComponentUsingModel model={model} />
        <OtherComponentUsingModel model={model} />
      </>
    )
  }

  const {getByTestId, getByText} = render(
    <ComponentWithNestedUseOfTheModelObject />
  )

  expect(getByTestId('numberInFirst')).toHaveTextContent('2')
  expect(getByTestId('numberInOther')).toHaveTextContent('2')

  getByText('Change the numbers in first component').click()

  expect(getByTestId('numberInFirst')).toHaveTextContent('1')
  expect(getByTestId('numberInOther')).toHaveTextContent('1')
})

test('have a global model', async () => {
  class TestClass {
    __current = 2

    get current(): number {
      return this.__current
    }

    set current(value: number) {
      this.__current = value
    }

    previous(): void {
      this.current--
    }

    getCurrent(): number {
      return this.current
    }
  }

  const model = new TestClass()

  const useNumberChanger = () => {
    return useObserver(model)
  }

  function ComponentUsingModel() {
    const methods = useNumberChanger()

    return (
      <div>
        <button onClick={() => methods.previous()}>
          Change the numbers in first component
        </button>
        <div data-testid={'numberInFirst'}>{methods.getCurrent()}</div>
      </div>
    )
  }

  function OtherComponentUsingModel() {
    const methods = useNumberChanger()

    return (
      <div>
        <button onClick={() => methods.previous()}>
          Change in the other component
        </button>
        <div data-testid={'numberInOther'}>{methods.getCurrent()}</div>
      </div>
    )
  }

  function ComponentWithNestedUseOfTheModelObject() {
    return (
      <>
        <ComponentUsingModel />
        <OtherComponentUsingModel />
      </>
    )
  }

  const {getByTestId, getByText} = render(
    <ComponentWithNestedUseOfTheModelObject />
  )

  expect(getByTestId('numberInFirst')).toHaveTextContent('2')
  expect(getByTestId('numberInOther')).toHaveTextContent('2')
  expect(model.getCurrent()).toEqual(2)

  getByText('Change the numbers in first component').click()

  expect(getByTestId('numberInFirst')).toHaveTextContent('1')
  expect(getByTestId('numberInOther')).toHaveTextContent('1')
  expect(model.getCurrent()).toEqual(1)

  act(() => {
    model.previous()
  })
  expect(model.getCurrent()).toEqual(0)
  expect(getByTestId('numberInFirst')).toHaveTextContent('0')
  expect(getByTestId('numberInOther')).toHaveTextContent('0')
})

test('nested classes', () => {
  class MemberClass {
    __current = 2

    get current(): number {
      return this.__current
    }

    set current(value: number) {
      this.__current = value
    }
  }

  class TestClass {
    member: MemberClass = new MemberClass()

    previous(): void {
      this.member.current--
    }

    getCurrent(): number {
      return this.member.current
    }
  }

  const model = new TestClass()

  const useNumberChanger = () => {
    return useObserver(model)
  }

  function ComponentUsingModel() {
    const methods = useNumberChanger()
    return (
      <div>
        <button onClick={() => methods.previous()}>
          Change the numbers in first component
        </button>
        <div data-testid={'numberInFirst'}>{methods.getCurrent()}</div>
        )}
      </div>
    )
  }

  function OtherComponentUsingModel() {
    const methods = useNumberChanger()

    return (
      <div>
        <button onClick={() => methods.previous()}>
          Change in the other component
        </button>
        <div data-testid={'numberInOther'}>{methods.getCurrent()}</div>
      </div>
    )
  }

  function ComponentWithNestedUseOfTheModelObject() {
    return (
      <>
        <ComponentUsingModel />
        <OtherComponentUsingModel />
      </>
    )
  }

  const {getByTestId, getByText} = render(
    <ComponentWithNestedUseOfTheModelObject />
  )

  expect(getByTestId('numberInFirst')).toHaveTextContent('2')
  expect(getByTestId('numberInOther')).toHaveTextContent('2')
  expect(model.getCurrent()).toEqual(2)

  getByText('Change the numbers in first component').click()

  expect(getByTestId('numberInFirst')).toHaveTextContent('1')
  expect(getByTestId('numberInOther')).toHaveTextContent('1')
  expect(model.getCurrent()).toEqual(1)

  act(() => {
    model.previous()
  })
  expect(model.getCurrent()).toEqual(0)
  expect(getByTestId('numberInFirst')).toHaveTextContent('0')
  expect(getByTestId('numberInOther')).toHaveTextContent('0')
})

test('Changing a state of one model should not re-render a react component using a different model', () => {
  const firstModel = {
    foo: 'here',
    mutateMe: (): string => (firstModel.foo = 'there'),
  }

  let firstComponentRerunTimes = 0

  function ComponentUsingModel() {
    firstComponentRerunTimes++
    useObserver(firstModel)

    return (
      <div>
        <div data-testid={'foo'}>{firstModel.foo}</div>
      </div>
    )
  }

  const otherModel = {
    someValue: 'someString',
    changeMe: function (): void {
      this.someValue = 'otherString'
    },
    getRerunTimes: function (): string {
      return this.someValue
    },
  }

  let differentComponentRerunTimes = 0

  function ComponentUsingDifferentModel() {
    differentComponentRerunTimes++
    useObserver(otherModel)

    return (
      <div>
        <div>{otherModel.getRerunTimes()}</div>
      </div>
    )
  }

  const {getByTestId} = render(<ComponentUsingModel />)
  render(<ComponentUsingDifferentModel />)
  expect(differentComponentRerunTimes).toEqual(1)
  expect(firstComponentRerunTimes).toEqual(1)
  expect(getByTestId('foo')).toHaveTextContent('here')

  act(() => {
    firstModel.mutateMe()
  })
  expect(getByTestId('foo')).toHaveTextContent('there')
  expect(firstComponentRerunTimes).toEqual(2)
  expect(differentComponentRerunTimes).toEqual(1)

  act(() => {
    otherModel.changeMe()
  })
  expect(differentComponentRerunTimes).toEqual(2)
  expect(firstComponentRerunTimes).toEqual(2)
})

test('it should re-render when null fields are set to a value', () => {
  const object = {field: null}

  function Component() {
    useObserver(object)
    return (
      <div data-testid={'foo'}>
        {object.field === null ? 'null' : object.field}
      </div>
    )
  }

  const {getByTestId} = render(<Component />)

  expect(getByTestId('foo')).toHaveTextContent('null')
  act(() => {
    object.field = 'boo'
  })
  expect(getByTestId('foo')).toHaveTextContent('boo')
})

test('it should re-render when null fields are set to an object whose value changes', () => {
  const object = {field: null}

  function Component() {
    useObserver(object)
    return (
      <div data-testid={'foo'}>
        {object.field === null ? 'null' : object.field.nested.deep}
      </div>
    )
  }

  const {getByTestId} = render(<Component />)

  expect(getByTestId('foo')).toHaveTextContent('null')
  act(() => {
    object.field = {
      nested: {
        deep: 'value',
      },
    }
  })
  expect(getByTestId('foo')).toHaveTextContent('value')
  act(() => {
    object.field.nested.deep = 'fathoms'
  })
  expect(getByTestId('foo')).toHaveTextContent('fathoms')
})

test('it should re-render when multi-level depth fields are set to an object whose value changes - no proxy', () => {
  const object = {field: null}

  function Component() {
    useObserver(object)
    console.log("GOZDECKI object.field.nested.deep.very", object?.field?.nested.deep.very)

    return (
      <div data-testid={'foo'}>
        {object.field === null ? 'null' : object.field.nested.deep.very}
      </div>
    )
  }

  const {getByTestId} = render(<Component />)

  expect(getByTestId('foo')).toHaveTextContent('null')
  act(() => {
    object.field = {
      nested: {
        deep: 'value',
      },
    }
  })
  act(() => {
    object.field.nested = {
      deep: {
        very: 'deeper',
      },
    }
  })

  console.log("GOZDECKI object.field.nested.deep", object.field.nested.deep)
  expect(getByTestId('foo')).toHaveTextContent('deeper')
  act(() => {
    object.field.nested.deep.very = 'fathoms'
  })
  expect(getByTestId('foo')).toHaveTextContent('fathoms')
})

test('it should re-render when array values change', () => {
  const object = {arr: ['zero']}

  function Component() {
    useObserver(object)
    return <div data-testid={'foo'}>{object.arr.toString()}</div>
  }

  const {getByTestId} = render(<Component />)

  act(() => {
    object.arr[0] = 'one'
  })
  expect(getByTestId('foo')).toHaveTextContent('one')
  act(() => {
    object.arr.push('two')
  })
  expect(getByTestId('foo')).toHaveTextContent('one,two')
})

describe.skip('pending edge-cases', () => {
  test('it should re-render when array values have objects whose internal values change', () => {
    const object = {arr: []}

    function Component() {
      useObserver(object)
      return <div data-testid={'foo'}>{object.arr[0].hello}</div>
    }

    object.arr[0] = {
      hello: 'world',
    }

    const {getByTestId} = render(<Component />)

    expect(getByTestId('foo')).toHaveTextContent('world')
    object.arr[0].hello = 'there'
    expect(getByTestId('foo')).toHaveTextContent('there')
  })

  test('it should re-render when multi-level depth fields are set to an object whose value changes - new field', () => {
    const object = {}

    function Component() {
      useObserver(object)
      return (
        <div data-testid={'foo'}>
          {object &&
          object['field'] &&
          object['field'].nested &&
          object['field'].nested.deep
            ? object['field'].nested.deep.very
            : 'null'}
        </div>
      )
    }

    const {getByTestId} = render(<Component />)

    expect(getByTestId('foo')).toHaveTextContent('null')
    act(() => {
      object['field'] = {
        nested: {
          deep: 'value',
        },
      }

      object['field'].nested = {
        deep: {
          very: 'deeper',
        },
      }
    })

    expect(getByTestId('foo')).toHaveTextContent('deeper')
    act(() => {
      object['field'].nested.deep.very = 'fathoms'
    })
    expect(getByTestId('foo')).toHaveTextContent('fathoms')
  })
})

test('unmounting one component does not cause other components to be unsubscribed', () => {
  class TestClass {
    current = 5

    previous(): void {
      this.current--
    }
  }

  const model = new TestClass()

  function ComponentUsingModel() {
    const methods = useObserver(model)

    return (
      <div>
        <button onClick={() => methods.previous()}>
          Change the numbers in first component
        </button>
        <div data-testid={'numberInFirst'}>{methods.current}</div>
      </div>
    )
  }

  function OtherComponentUsingModel() {
    const methods = useObserver(model)

    return (
      <div>
        <button onClick={() => methods.previous()}>
          Change in the other component
        </button>
        <div data-testid={'numberInOther'}>{methods.current}</div>
      </div>
    )
  }

  function ComponentWithNestedUseOfTheModelObject() {
    useObserver(model)
    return (
      <>
        <ComponentUsingModel />
        {model.current > 3 ? <OtherComponentUsingModel /> : null}
      </>
    )
  }

  const {getByTestId, getByText} = render(
    <ComponentWithNestedUseOfTheModelObject />
  )

  expect(getByTestId('numberInFirst')).toHaveTextContent('5')
  expect(getByTestId('numberInOther')).toHaveTextContent('5')
  expect(model.current).toEqual(5)

  getByText('Change the numbers in first component').click()

  expect(getByTestId('numberInFirst')).toHaveTextContent('4')
  expect(getByTestId('numberInOther')).toHaveTextContent('4')
  expect(model.current).toEqual(4)

  act(() => {
    model.previous()
  })
  expect(model.current).toEqual(3)
  expect(getByTestId('numberInFirst')).toHaveTextContent('3')

  act(() => {
    model.previous()
  })
  expect(model.current).toEqual(2)
  expect(getByTestId('numberInFirst')).toHaveTextContent('2')
})
