import * as React from 'react'
import useDomain from './useDomain'
import {render, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import {addHash} from './addHash'

test('add hash internally', () => {
  class TestClass {
    current = 2

    previous() {
      this.current--
    }

    getCurrent() {
      return this.current
    }
  }

  const model = new TestClass()

  function ComponentUsingModel({model}: {model: TestClass}) {
    const methods = useDomain(model)

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
    const methods = useDomain(model)

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

  fireEvent.click(getByText('Change the numbers in first component'))

  expect(getByTestId('numberInFirst')).toHaveTextContent('1')
  expect(getByTestId('numberInOther')).toHaveTextContent('1')
})

test('that it can work with objects', () => {
  const obj = {
    foo: 'here',
    mutateMe: () => (obj.foo = 'there')
  }

  function ComponentUsingModel({model}) {
    useDomain(model)

    return (
      <div>
        <div data-testid={'foo'}>{obj.foo}</div>
      </div>
    )
  }

  const {getByTestId} = render(<ComponentUsingModel model={obj} />)

  expect(getByTestId('foo')).toHaveTextContent('here')
  obj.mutateMe()
  expect(getByTestId('foo')).toHaveTextContent('there')
})

test('that it can work with multiple objects', () => {
  const obj1 = {
    foo: 'here',
    mutateMe: () => (obj1.foo = 'there')
  }

  const obj2 = {
    bar: 'pete',
    mutateMe: () => (obj2.bar = 'paul')
  }

  function ComponentUsingModel({model1, model2}) {
    useDomain(model1)
    useDomain(model2)

    return (
      <div>
        <div data-testid={'foo'}>{obj1.foo}</div>
        <div data-testid={'bar'}>{obj2.bar}</div>
      </div>
    )
  }

  const {getByTestId} = render(
    <ComponentUsingModel model1={obj1} model2={obj2} />
  )

  expect(getByTestId('foo')).toHaveTextContent('here')
  expect(getByTestId('bar')).toHaveTextContent('pete')
  obj1.mutateMe()
  expect(getByTestId('foo')).toHaveTextContent('there')
  expect(getByTestId('bar')).toHaveTextContent('pete')
  obj2.mutateMe()
  expect(getByTestId('bar')).toHaveTextContent('paul')
})

test('that it can work with multiple objects', () => {
  const obj1 = {
    foo: 'here',
    mutateMe: () => (obj1.foo = 'there')
  }

  const obj2 = {
    bar: 'pete',
    mutateMe: () => (obj2.bar = 'paul')
  }

  function ComponentUsingModel1({model}) {
    useDomain(model)

    return (
      <div>
        <div data-testid={'foo'}>{obj1.foo}</div>
      </div>
    )
  }

  function ComponentUsingModel2({model}) {
    useDomain(model)

    return (
      <div>
        <div data-testid={'bar'}>{obj2.bar}</div>
      </div>
    )
  }

  const getByTestId1 = render(<ComponentUsingModel1 model={obj1} />).getByTestId
  const getByTestId2 = render(<ComponentUsingModel2 model={obj2} />).getByTestId

  expect(getByTestId1('foo')).toHaveTextContent('here')
  expect(getByTestId2('bar')).toHaveTextContent('pete')
  obj1.mutateMe()
  expect(getByTestId1('foo')).toHaveTextContent('there')
  expect(getByTestId2('bar')).toHaveTextContent('pete')
  obj2.mutateMe()
  expect(getByTestId1('foo')).toHaveTextContent('there')
  expect(getByTestId2('bar')).toHaveTextContent('paul')
})

test('add hash explicitly', () => {
  class TestClass {
    current = 2

    previous() {
      this.current--
    }

    getCurrent() {
      return this.current
    }
  }

  function ComponentUsingModel({model}: {model: TestClass}) {
    const methods = useDomain(addHash(model))

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
    const methods = useDomain(addHash(model))

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

  fireEvent.click(getByText('Change the numbers in first component'))

  expect(getByTestId('numberInFirst')).toHaveTextContent('1')
  expect(getByTestId('numberInOther')).toHaveTextContent('1')
})

test('have a global model', async () => {
  class TestClass {
    __current = 2

    get current() {
      return this.__current
    }

    set current(value) {
      this.__current = value
    }

    previous() {
      this.current--
    }

    getCurrent() {
      return this.current
    }
  }

  const model = new TestClass()

  const useNumberChanger = () => {
    return useDomain(model)
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

  fireEvent.click(getByText('Change the numbers in first component'))

  expect(getByTestId('numberInFirst')).toHaveTextContent('1')
  expect(getByTestId('numberInOther')).toHaveTextContent('1')
  expect(model.getCurrent()).toEqual(1)

  model.previous()
  expect(model.getCurrent()).toEqual(0)
  expect(getByTestId('numberInFirst')).toHaveTextContent('0')
  expect(getByTestId('numberInOther')).toHaveTextContent('0')

  // await wait(() => expect(getByTestId('numberInOther')).toHaveTextContent(5))
})

test('some ddd idea', () => {
  class MemberClass {
    __current = 2

    get current() {
      return this.__current
    }

    set current(value) {
      this.__current = value
    }
  }

  class TestClass {
    member: MemberClass = new MemberClass()

    previous() {
      this.member.current--
    }

    getCurrent() {
      return this.member.current
    }
  }

  const model = new TestClass()

  const useNumberChanger = () => {
    return useDomain(model)
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

  const {getByTestId, getByText, debug} = render(
    <ComponentWithNestedUseOfTheModelObject />
  )

  expect(getByTestId('numberInFirst')).toHaveTextContent('2')
  expect(getByTestId('numberInOther')).toHaveTextContent('2')
  expect(model.getCurrent()).toEqual(2)

  fireEvent.click(getByText('Change the numbers in first component'))

  expect(getByTestId('numberInFirst')).toHaveTextContent('1')
  expect(getByTestId('numberInOther')).toHaveTextContent('1')
  expect(model.getCurrent()).toEqual(1)

  model.previous()
  expect(model.getCurrent()).toEqual(0)
  expect(getByTestId('numberInFirst')).toHaveTextContent('0')
  expect(getByTestId('numberInOther')).toHaveTextContent('0')
  debug()

  // await wait(() => expect(getByTestId('numberInOther')).toHaveTextContent(5))
})

test('Changing a state of one model should not reload a react component using a different model', () => {
  const firstModel = {
    foo: 'here',
    mutateMe: () => (firstModel.foo = 'there')
  }

  let firstComponentRerunTimes = 0

  function ComponentUsingModel() {
    firstComponentRerunTimes++
    useDomain(firstModel)

    return (
      <div>
        <div data-testid={'foo'}>{firstModel.foo}</div>
      </div>
    )
  }

  const otherModel = {
    someValue: 'someString',
    changeMe: function() {
      this.someValue = 'otherString'
    },
    getRerunTimes: function() {
      return this.someValue
    }
  }

  let differentComponentRerunTimes = 0

  function ComponentUsingDifferentModel() {
    differentComponentRerunTimes++
    useDomain(otherModel)

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

  firstModel.mutateMe()
  expect(getByTestId('foo')).toHaveTextContent('there')
  expect(firstComponentRerunTimes).toEqual(2)
  expect(differentComponentRerunTimes).toEqual(1)

  otherModel.changeMe()
  expect(differentComponentRerunTimes).toEqual(2)
  expect(firstComponentRerunTimes).toEqual(2)
})
