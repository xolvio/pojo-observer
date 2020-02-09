// file.only
import React from 'react'
import useDomainTyped, {DomainTypeWrapper} from './useDomainTyped'
import {render, fireEvent, wait} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import {addHash} from './addHash'

test('', () => {
  class TestClass {
    current = 2
    previous(isTrue: boolean) {
      this.current--
    }

    getCurrent() {
      return this.current
    }
  }

  // let initialized: boolean
  // let command
  // const useModelWithHooks = model => {
  //   return useDomainTyped(model)
  //   if (!initialized) {
  //     initialized = true
  //     ;[command] = useDomainTyped(model)
  //     return [command]
  //   }
  //   return [{previous: () => {}, getCurrent: () => {}}]
  // }

  let reloadedFirst = 0

  function ComponentUsingModel({
    methods
  }: {
    methods: DomainTypeWrapper<TestClass>
  }) {
    console.log('GOZDECKI reloadedOther++', reloadedFirst++)
    console.log('GOZDECKI methods.getCurrent()', methods.getCurrent())
    return (
      <div>
        <button onClick={() => methods.previous(true)}>
          Change the numbers in first component
        </button>
        <div data-testid={'numberInFirst'}>{methods.getCurrent()}</div>
      </div>
    )
  }

  let reloadedOther = 0

  function OtherComponentUsingModel({
    methods
  }: {
    methods: DomainTypeWrapper<TestClass>
  }) {
    console.log('GOZDECKI reloadedOther++', reloadedOther++)
    console.log('GOZDECKI methods.getCurrent()', methods.getCurrent())
    return (
      <div>
        <button onClick={() => methods.previous(true)}>
          Change in the other component
        </button>
        <div data-testid={'numberInOther'}>{methods.getCurrent()}</div>
      </div>
    )
  }

  let reloaded = 0

  const instanceOfTestClass = new TestClass()
  function ComponentWithNestedUseOfTheModelObject() {
    const methods = useDomainTyped(instanceOfTestClass)
    return (
      <>
        <ComponentUsingModel methods={methods} />
        <OtherComponentUsingModel methods={methods} />
      </>
    )
  }

  const {getByTestId, getByText} = render(
    <ComponentWithNestedUseOfTheModelObject />
  )

  expect(getByTestId('numberInFirst')).toHaveTextContent(2)
  expect(getByTestId('numberInOther')).toHaveTextContent(2)

  fireEvent.click(getByText('Change the numbers in first component'))

  expect(getByTestId('numberInFirst')).toHaveTextContent(1)
  expect(getByTestId('numberInOther')).toHaveTextContent(1)
})

test('add hash internally', () => {
  class TestClass {
    current = 2
    previous(isTrue: boolean) {
      this.current--
    }

    getCurrent() {
      return this.current
    }
  }

  const model = new TestClass()

  function ComponentUsingModel({model}: {model: TestClass}) {
    const methods = useDomainTyped(model)

    return (
      <div>
        <button onClick={() => methods.previous(true)}>
          Change the numbers in first component
        </button>
        <div data-testid={'numberInFirst'}>{methods.getCurrent()}</div>
      </div>
    )
  }

  function OtherComponentUsingModel({model}: {model: TestClass}) {
    const methods = useDomainTyped(model)

    return (
      <div>
        <button onClick={() => methods.previous(true)}>
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

  expect(getByTestId('numberInFirst')).toHaveTextContent(2)
  expect(getByTestId('numberInOther')).toHaveTextContent(2)

  fireEvent.click(getByText('Change the numbers in first component'))

  expect(getByTestId('numberInFirst')).toHaveTextContent(1)
  expect(getByTestId('numberInOther')).toHaveTextContent(1)
})

test('add hash explicitly', () => {
  class TestClass {
    current = 2
    previous(isTrue: boolean) {
      this.current--
    }

    getCurrent() {
      return this.current
    }
  }

  function ComponentUsingModel({model}: {model: TestClass}) {
    const methods = useDomainTyped(addHash(model))

    return (
      <div>
        <button onClick={() => methods.previous(true)}>
          Change the numbers in first component
        </button>
        <div data-testid={'numberInFirst'}>{methods.getCurrent()}</div>
      </div>
    )
  }

  function OtherComponentUsingModel({model}: {model: TestClass}) {
    const methods = useDomainTyped(addHash(model))

    return (
      <div>
        <button onClick={() => methods.previous(true)}>
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

  expect(getByTestId('numberInFirst')).toHaveTextContent(2)
  expect(getByTestId('numberInOther')).toHaveTextContent(2)

  fireEvent.click(getByText('Change the numbers in first component'))

  expect(getByTestId('numberInFirst')).toHaveTextContent(1)
  expect(getByTestId('numberInOther')).toHaveTextContent(1)
})

let howManyTimes = 0
test('have a global model', async () => {
  class TestClass {
    __current = 2
    get current() {
      return this.__current
    }
    set current(value) {
      this.__current = value
    }

    // constructor() {
    //   setInterval(() => {
    //     howManyTimes++
    //     this.current--
    //   }, 1000)
    // }

    previous(isTrue: boolean) {
      this.current--
    }

    getCurrent() {
      return this.current
    }
  }

  const model = new TestClass()

  const useNumberChanger = () => {
    return useDomainTyped(model)
  }

  function ComponentUsingModel() {
    const methods = useNumberChanger()

    return (
      <div>
        <button onClick={() => methods.previous(true)}>
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
        <button onClick={() => methods.previous(true)}>
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

  expect(getByTestId('numberInFirst')).toHaveTextContent(2)
  expect(getByTestId('numberInOther')).toHaveTextContent(2)
  expect(model.getCurrent()).toEqual(2)

  fireEvent.click(getByText('Change the numbers in first component'))

  expect(getByTestId('numberInFirst')).toHaveTextContent(1)
  expect(getByTestId('numberInOther')).toHaveTextContent(1)
  expect(model.getCurrent()).toEqual(1)

  model.previous(true)
  expect(model.getCurrent()).toEqual(0)
  expect(getByTestId('numberInFirst')).toHaveTextContent(0)
  expect(getByTestId('numberInOther')).toHaveTextContent(0)

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

    constructor() {}
  }

  class TestClass {
    constructor() {
      this.member = new MemberClass()
    }
    previous(isTrue: boolean) {
      this.member.current--
    }

    getCurrent() {
      return this.member.current
    }
  }

  const model = new TestClass()

  const useNumberChanger = () => {
    return useDomainTyped(model)
  }

  function ComponentUsingModel() {
    const methods = useNumberChanger()
    return (
      <div>
        <button onClick={() => methods.previous(true)}>
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
        <button onClick={() => methods.previous(true)}>
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

  expect(getByTestId('numberInFirst')).toHaveTextContent(2)
  expect(getByTestId('numberInOther')).toHaveTextContent(2)
  expect(model.getCurrent()).toEqual(2)

  fireEvent.click(getByText('Change the numbers in first component'))

  expect(getByTestId('numberInFirst')).toHaveTextContent(1)
  expect(getByTestId('numberInOther')).toHaveTextContent(1)
  expect(model.getCurrent()).toEqual(1)

  model.previous(true)
  expect(model.getCurrent()).toEqual(0)
  expect(getByTestId('numberInFirst')).toHaveTextContent(0)
  expect(getByTestId('numberInOther')).toHaveTextContent(0)
  debug()

  // await wait(() => expect(getByTestId('numberInOther')).toHaveTextContent(5))
})
