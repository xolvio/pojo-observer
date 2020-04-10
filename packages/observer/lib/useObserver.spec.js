"use strict";

var React = _interopRequireWildcard(require("react"));

var _useObserver = _interopRequireDefault(require("./useObserver"));

var _react2 = require("@testing-library/react");

require("@testing-library/jest-dom/extend-expect");

var _addHash = require("./addHash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
test('add hash internally', () => {
  class TestClass {
    constructor() {
      this.current = 2;
    }

    previous() {
      this.current--;
    }

    getCurrent() {
      return this.current;
    }

  }

  const obj = new TestClass();

  function ComponentUsingModel({
    model
  }) {
    (0, _useObserver.default)(model);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
      onClick: () => model.previous()
    }, "Change the numbers in first component"), /*#__PURE__*/React.createElement("div", {
      "data-testid": 'numberInFirst'
    }, model.getCurrent()));
  }

  function OtherComponentUsingModel({
    model
  }) {
    (0, _useObserver.default)(model);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
      onClick: () => model.previous()
    }, "Change in the other component"), /*#__PURE__*/React.createElement("div", {
      "data-testid": 'numberInOther'
    }, model.getCurrent()));
  }

  function ComponentWithNestedUseOfTheModelObject() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ComponentUsingModel, {
      model: obj
    }), /*#__PURE__*/React.createElement(OtherComponentUsingModel, {
      model: obj
    }));
  }

  const {
    getByTestId,
    getByText
  } = (0, _react2.render)( /*#__PURE__*/React.createElement(ComponentWithNestedUseOfTheModelObject, null));
  expect(getByTestId('numberInFirst')).toHaveTextContent('2');
  expect(getByTestId('numberInOther')).toHaveTextContent('2');
  getByText('Change the numbers in first component').click();
  expect(getByTestId('numberInFirst')).toHaveTextContent('1');
  expect(getByTestId('numberInOther')).toHaveTextContent('1');
});
test('that it can work with objects', () => {
  const obj = {
    foo: 'here',
    mutateMe: () => obj.foo = 'there'
  };

  function ComponentUsingModel({
    model
  }) {
    (0, _useObserver.default)(model);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      "data-testid": 'foo'
    }, model.foo));
  }

  const {
    getByTestId
  } = (0, _react2.render)( /*#__PURE__*/React.createElement(ComponentUsingModel, {
    model: obj
  }));
  expect(getByTestId('foo')).toHaveTextContent('here');
  (0, _react2.act)(() => {
    obj.mutateMe();
  });
  expect(getByTestId('foo')).toHaveTextContent('there');
});
test('that it can work with multiple objects', () => {
  const obj1 = {
    foo: 'here',
    mutateMe: () => obj1.foo = 'there'
  };
  const obj2 = {
    bar: 'pete',
    mutateMe: () => obj2.bar = 'paul'
  };

  function ComponentUsingModel({
    model1,
    model2
  }) {
    (0, _useObserver.default)(model1);
    (0, _useObserver.default)(model2);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      "data-testid": 'foo'
    }, model1.foo), /*#__PURE__*/React.createElement("div", {
      "data-testid": 'bar'
    }, model2.bar));
  }

  const {
    getByTestId
  } = (0, _react2.render)( /*#__PURE__*/React.createElement(ComponentUsingModel, {
    model1: obj1,
    model2: obj2
  }));
  expect(getByTestId('foo')).toHaveTextContent('here');
  expect(getByTestId('bar')).toHaveTextContent('pete');
  (0, _react2.act)(() => {
    obj1.mutateMe();
  });
  expect(getByTestId('foo')).toHaveTextContent('there');
  expect(getByTestId('bar')).toHaveTextContent('pete');
  (0, _react2.act)(() => {
    obj2.mutateMe();
  });
  expect(getByTestId('bar')).toHaveTextContent('paul');
});
test('that it can work with multiple objects', () => {
  const obj1 = {
    foo: 'here',
    mutateMe: () => obj1.foo = 'there'
  };
  const obj2 = {
    bar: 'pete',
    mutateMe: () => obj2.bar = 'paul'
  };

  function ComponentUsingModel1({
    model
  }) {
    (0, _useObserver.default)(model);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      "data-testid": 'foo'
    }, model.foo));
  }

  function ComponentUsingModel2({
    model
  }) {
    (0, _useObserver.default)(model);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      "data-testid": 'bar'
    }, model.bar));
  }

  const getByTestId1 = (0, _react2.render)( /*#__PURE__*/React.createElement(ComponentUsingModel1, {
    model: obj1
  })).getByTestId;
  const getByTestId2 = (0, _react2.render)( /*#__PURE__*/React.createElement(ComponentUsingModel2, {
    model: obj2
  })).getByTestId;
  expect(getByTestId1('foo')).toHaveTextContent('here');
  expect(getByTestId2('bar')).toHaveTextContent('pete');
  (0, _react2.act)(() => {
    obj1.mutateMe();
  });
  expect(getByTestId1('foo')).toHaveTextContent('there');
  expect(getByTestId2('bar')).toHaveTextContent('pete');
  (0, _react2.act)(() => {
    obj2.mutateMe();
  });
  expect(getByTestId1('foo')).toHaveTextContent('there');
  expect(getByTestId2('bar')).toHaveTextContent('paul');
});
test('add hash explicitly', () => {
  class TestClass {
    constructor() {
      this.current = 2;
    }

    previous() {
      this.current--;
    }

    getCurrent() {
      return this.current;
    }

  }

  function ComponentUsingModel({
    model
  }) {
    const methods = (0, _useObserver.default)((0, _addHash.addHash)(model));
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
      onClick: () => methods.previous()
    }, "Change the numbers in first component"), /*#__PURE__*/React.createElement("div", {
      "data-testid": 'numberInFirst'
    }, methods.getCurrent()));
  }

  function OtherComponentUsingModel({
    model
  }) {
    const methods = (0, _useObserver.default)((0, _addHash.addHash)(model));
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
      onClick: () => methods.previous()
    }, "Change in the other component"), /*#__PURE__*/React.createElement("div", {
      "data-testid": 'numberInOther'
    }, methods.getCurrent()));
  }

  function ComponentWithNestedUseOfTheModelObject() {
    const model = new TestClass();
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ComponentUsingModel, {
      model: model
    }), /*#__PURE__*/React.createElement(OtherComponentUsingModel, {
      model: model
    }));
  }

  const {
    getByTestId,
    getByText
  } = (0, _react2.render)( /*#__PURE__*/React.createElement(ComponentWithNestedUseOfTheModelObject, null));
  expect(getByTestId('numberInFirst')).toHaveTextContent('2');
  expect(getByTestId('numberInOther')).toHaveTextContent('2');
  getByText('Change the numbers in first component').click();
  expect(getByTestId('numberInFirst')).toHaveTextContent('1');
  expect(getByTestId('numberInOther')).toHaveTextContent('1');
});
test('have a global model', async () => {
  class TestClass {
    constructor() {
      this.__current = 2;
    }

    get current() {
      return this.__current;
    }

    set current(value) {
      this.__current = value;
    }

    previous() {
      this.current--;
    }

    getCurrent() {
      return this.current;
    }

  }

  const model = new TestClass();

  const useNumberChanger = () => {
    return (0, _useObserver.default)(model);
  };

  function ComponentUsingModel() {
    const methods = useNumberChanger();
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
      onClick: () => methods.previous()
    }, "Change the numbers in first component"), /*#__PURE__*/React.createElement("div", {
      "data-testid": 'numberInFirst'
    }, methods.getCurrent()));
  }

  function OtherComponentUsingModel() {
    const methods = useNumberChanger();
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
      onClick: () => methods.previous()
    }, "Change in the other component"), /*#__PURE__*/React.createElement("div", {
      "data-testid": 'numberInOther'
    }, methods.getCurrent()));
  }

  function ComponentWithNestedUseOfTheModelObject() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ComponentUsingModel, null), /*#__PURE__*/React.createElement(OtherComponentUsingModel, null));
  }

  const {
    getByTestId,
    getByText
  } = (0, _react2.render)( /*#__PURE__*/React.createElement(ComponentWithNestedUseOfTheModelObject, null));
  expect(getByTestId('numberInFirst')).toHaveTextContent('2');
  expect(getByTestId('numberInOther')).toHaveTextContent('2');
  expect(model.getCurrent()).toEqual(2);
  getByText('Change the numbers in first component').click();
  expect(getByTestId('numberInFirst')).toHaveTextContent('1');
  expect(getByTestId('numberInOther')).toHaveTextContent('1');
  expect(model.getCurrent()).toEqual(1);
  (0, _react2.act)(() => {
    model.previous();
  });
  expect(model.getCurrent()).toEqual(0);
  expect(getByTestId('numberInFirst')).toHaveTextContent('0');
  expect(getByTestId('numberInOther')).toHaveTextContent('0');
});
test('nested classes', () => {
  class MemberClass {
    constructor() {
      this.__current = 2;
    }

    get current() {
      return this.__current;
    }

    set current(value) {
      this.__current = value;
    }

  }

  class TestClass {
    constructor() {
      this.member = new MemberClass();
    }

    previous() {
      this.member.current--;
    }

    getCurrent() {
      return this.member.current;
    }

  }

  const model = new TestClass();

  const useNumberChanger = () => {
    return (0, _useObserver.default)(model);
  };

  function ComponentUsingModel() {
    const methods = useNumberChanger();
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
      onClick: () => methods.previous()
    }, "Change the numbers in first component"), /*#__PURE__*/React.createElement("div", {
      "data-testid": 'numberInFirst'
    }, methods.getCurrent()), ")}");
  }

  function OtherComponentUsingModel() {
    const methods = useNumberChanger();
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
      onClick: () => methods.previous()
    }, "Change in the other component"), /*#__PURE__*/React.createElement("div", {
      "data-testid": 'numberInOther'
    }, methods.getCurrent()));
  }

  function ComponentWithNestedUseOfTheModelObject() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ComponentUsingModel, null), /*#__PURE__*/React.createElement(OtherComponentUsingModel, null));
  }

  const {
    getByTestId,
    getByText
  } = (0, _react2.render)( /*#__PURE__*/React.createElement(ComponentWithNestedUseOfTheModelObject, null));
  expect(getByTestId('numberInFirst')).toHaveTextContent('2');
  expect(getByTestId('numberInOther')).toHaveTextContent('2');
  expect(model.getCurrent()).toEqual(2);
  getByText('Change the numbers in first component').click();
  expect(getByTestId('numberInFirst')).toHaveTextContent('1');
  expect(getByTestId('numberInOther')).toHaveTextContent('1');
  expect(model.getCurrent()).toEqual(1);
  (0, _react2.act)(() => {
    model.previous();
  });
  expect(model.getCurrent()).toEqual(0);
  expect(getByTestId('numberInFirst')).toHaveTextContent('0');
  expect(getByTestId('numberInOther')).toHaveTextContent('0');
});
test('Changing a state of one model should not re-render a react component using a different model', () => {
  const firstModel = {
    foo: 'here',
    mutateMe: () => firstModel.foo = 'there'
  };
  let firstComponentRerunTimes = 0;

  function ComponentUsingModel() {
    firstComponentRerunTimes++;
    (0, _useObserver.default)(firstModel);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      "data-testid": 'foo'
    }, firstModel.foo));
  }

  const otherModel = {
    someValue: 'someString',
    changeMe: function () {
      this.someValue = 'otherString';
    },
    getRerunTimes: function () {
      return this.someValue;
    }
  };
  let differentComponentRerunTimes = 0;

  function ComponentUsingDifferentModel() {
    differentComponentRerunTimes++;
    (0, _useObserver.default)(otherModel);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, otherModel.getRerunTimes()));
  }

  const {
    getByTestId
  } = (0, _react2.render)( /*#__PURE__*/React.createElement(ComponentUsingModel, null));
  (0, _react2.render)( /*#__PURE__*/React.createElement(ComponentUsingDifferentModel, null));
  expect(differentComponentRerunTimes).toEqual(1);
  expect(firstComponentRerunTimes).toEqual(1);
  expect(getByTestId('foo')).toHaveTextContent('here');
  (0, _react2.act)(() => {
    firstModel.mutateMe();
  });
  expect(getByTestId('foo')).toHaveTextContent('there');
  expect(firstComponentRerunTimes).toEqual(2);
  expect(differentComponentRerunTimes).toEqual(1);
  (0, _react2.act)(() => {
    otherModel.changeMe();
  });
  expect(differentComponentRerunTimes).toEqual(2);
  expect(firstComponentRerunTimes).toEqual(2);
});
test('it should re-render when null fields are set to a value', () => {
  const object = {
    field: null
  };

  function Component() {
    (0, _useObserver.default)(object);
    return /*#__PURE__*/React.createElement("div", {
      "data-testid": 'foo'
    }, object.field === null ? 'null' : object.field);
  }

  const {
    getByTestId
  } = (0, _react2.render)( /*#__PURE__*/React.createElement(Component, null));
  expect(getByTestId('foo')).toHaveTextContent('null');
  (0, _react2.act)(() => {
    object.field = 'boo';
  });
  expect(getByTestId('foo')).toHaveTextContent('boo');
});
test('it should re-render when null fields are set to an object whose value changes', () => {
  const object = {
    field: null
  };

  function Component() {
    (0, _useObserver.default)(object);
    return /*#__PURE__*/React.createElement("div", {
      "data-testid": 'foo'
    }, object.field === null ? 'null' : object.field.nested.deep);
  }

  const {
    getByTestId
  } = (0, _react2.render)( /*#__PURE__*/React.createElement(Component, null));
  expect(getByTestId('foo')).toHaveTextContent('null');
  (0, _react2.act)(() => {
    object.field = {
      nested: {
        deep: 'value'
      }
    };
  });
  expect(getByTestId('foo')).toHaveTextContent('value');
  (0, _react2.act)(() => {
    object.field.nested.deep = 'fathoms';
  });
  expect(getByTestId('foo')).toHaveTextContent('fathoms');
});
test('it should re-render when multi-level depth fields are set to an object whose value changes', () => {
  const object = {
    field: null
  };

  function Component() {
    (0, _useObserver.default)(object);
    return /*#__PURE__*/React.createElement("div", {
      "data-testid": 'foo'
    }, object.field === null ? 'null' : object.field.nested.deep.very);
  }

  const {
    getByTestId
  } = (0, _react2.render)( /*#__PURE__*/React.createElement(Component, null));
  expect(getByTestId('foo')).toHaveTextContent('null');
  (0, _react2.act)(() => {
    object.field = {
      nested: {
        deep: 'value'
      }
    };
  });
  (0, _react2.act)(() => {
    object.field.nested = {
      deep: {
        very: 'deeper'
      }
    };
  });
  expect(getByTestId('foo')).toHaveTextContent('deeper');
  (0, _react2.act)(() => {
    object.field.nested.deep.very = 'fathoms';
  });
  expect(getByTestId('foo')).toHaveTextContent('fathoms');
});
test('it should re-render when array values change', () => {
  const object = {
    arr: ['zero']
  };

  function Component() {
    (0, _useObserver.default)(object);
    return /*#__PURE__*/React.createElement("div", {
      "data-testid": 'foo'
    }, object.arr.toString());
  }

  const {
    getByTestId
  } = (0, _react2.render)( /*#__PURE__*/React.createElement(Component, null));
  (0, _react2.act)(() => {
    object.arr[0] = 'one';
  });
  expect(getByTestId('foo')).toHaveTextContent('one');
  (0, _react2.act)(() => {
    object.arr.push('two');
  });
  expect(getByTestId('foo')).toHaveTextContent('one,two');
});
describe.skip('pending edge-cases', () => {
  test('it should re-render when array values have objects whose internal values change', () => {
    const object = {
      arr: []
    };

    function Component() {
      (0, _useObserver.default)(object);
      return /*#__PURE__*/React.createElement("div", {
        "data-testid": 'foo'
      }, object.arr[0].hello);
    }

    object.arr[0] = {
      hello: 'world'
    };
    const {
      getByTestId
    } = (0, _react2.render)( /*#__PURE__*/React.createElement(Component, null));
    expect(getByTestId('foo')).toHaveTextContent('world');
    object.arr[0].hello = 'there';
    expect(getByTestId('foo')).toHaveTextContent('there');
  });
  test('it should re-render when multi-level depth fields are set to an object whose value changes - new field', () => {
    const object = {};

    function Component() {
      (0, _useObserver.default)(object);
      return /*#__PURE__*/React.createElement("div", {
        "data-testid": 'foo'
      }, object && object['field'] && object['field'].nested && object['field'].nested.deep ? object['field'].nested.deep.very : 'null');
    }

    const {
      getByTestId
    } = (0, _react2.render)( /*#__PURE__*/React.createElement(Component, null));
    expect(getByTestId('foo')).toHaveTextContent('null');
    (0, _react2.act)(() => {
      object['field'] = {
        nested: {
          deep: 'value'
        }
      };
      object['field'].nested = {
        deep: {
          very: 'deeper'
        }
      };
    });
    expect(getByTestId('foo')).toHaveTextContent('deeper');
    (0, _react2.act)(() => {
      object['field'].nested.deep.very = 'fathoms';
    });
    expect(getByTestId('foo')).toHaveTextContent('fathoms');
  });
});
test('unmounting one component does not cause other components to be unsubscribed', () => {
  class TestClass {
    constructor() {
      this.current = 5;
    }

    previous() {
      this.current--;
    }

  }

  const model = new TestClass();

  function ComponentUsingModel() {
    const methods = (0, _useObserver.default)(model);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
      onClick: () => methods.previous()
    }, "Change the numbers in first component"), /*#__PURE__*/React.createElement("div", {
      "data-testid": 'numberInFirst'
    }, methods.current));
  }

  function OtherComponentUsingModel() {
    const methods = (0, _useObserver.default)(model);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
      onClick: () => methods.previous()
    }, "Change in the other component"), /*#__PURE__*/React.createElement("div", {
      "data-testid": 'numberInOther'
    }, methods.current));
  }

  function ComponentWithNestedUseOfTheModelObject() {
    (0, _useObserver.default)(model);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ComponentUsingModel, null), model.current > 3 ? /*#__PURE__*/React.createElement(OtherComponentUsingModel, null) : null);
  }

  const {
    getByTestId,
    getByText
  } = (0, _react2.render)( /*#__PURE__*/React.createElement(ComponentWithNestedUseOfTheModelObject, null));
  expect(getByTestId('numberInFirst')).toHaveTextContent('5');
  expect(getByTestId('numberInOther')).toHaveTextContent('5');
  expect(model.current).toEqual(5);
  getByText('Change the numbers in first component').click();
  expect(getByTestId('numberInFirst')).toHaveTextContent('4');
  expect(getByTestId('numberInOther')).toHaveTextContent('4');
  expect(model.current).toEqual(4);
  (0, _react2.act)(() => {
    model.previous();
  });
  expect(model.current).toEqual(3);
  expect(getByTestId('numberInFirst')).toHaveTextContent('3');
  (0, _react2.act)(() => {
    model.previous();
  });
  expect(model.current).toEqual(2);
  expect(getByTestId('numberInFirst')).toHaveTextContent('2');
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91c2VPYnNlcnZlci5zcGVjLnRzeCJdLCJuYW1lcyI6WyJ0ZXN0IiwiVGVzdENsYXNzIiwiY3VycmVudCIsInByZXZpb3VzIiwiZ2V0Q3VycmVudCIsIm9iaiIsIkNvbXBvbmVudFVzaW5nTW9kZWwiLCJtb2RlbCIsIk90aGVyQ29tcG9uZW50VXNpbmdNb2RlbCIsIkNvbXBvbmVudFdpdGhOZXN0ZWRVc2VPZlRoZU1vZGVsT2JqZWN0IiwiZ2V0QnlUZXN0SWQiLCJnZXRCeVRleHQiLCJleHBlY3QiLCJ0b0hhdmVUZXh0Q29udGVudCIsImNsaWNrIiwiZm9vIiwibXV0YXRlTWUiLCJvYmoxIiwib2JqMiIsImJhciIsIm1vZGVsMSIsIm1vZGVsMiIsIkNvbXBvbmVudFVzaW5nTW9kZWwxIiwiQ29tcG9uZW50VXNpbmdNb2RlbDIiLCJnZXRCeVRlc3RJZDEiLCJnZXRCeVRlc3RJZDIiLCJtZXRob2RzIiwiX19jdXJyZW50IiwidmFsdWUiLCJ1c2VOdW1iZXJDaGFuZ2VyIiwidG9FcXVhbCIsIk1lbWJlckNsYXNzIiwibWVtYmVyIiwiZmlyc3RNb2RlbCIsImZpcnN0Q29tcG9uZW50UmVydW5UaW1lcyIsIm90aGVyTW9kZWwiLCJzb21lVmFsdWUiLCJjaGFuZ2VNZSIsImdldFJlcnVuVGltZXMiLCJkaWZmZXJlbnRDb21wb25lbnRSZXJ1blRpbWVzIiwiQ29tcG9uZW50VXNpbmdEaWZmZXJlbnRNb2RlbCIsIm9iamVjdCIsImZpZWxkIiwiQ29tcG9uZW50IiwibmVzdGVkIiwiZGVlcCIsInZlcnkiLCJhcnIiLCJ0b1N0cmluZyIsInB1c2giLCJkZXNjcmliZSIsInNraXAiLCJoZWxsbyJdLCJtYXBwaW5ncyI6Ijs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFMQTtBQU9BQSxJQUFJLENBQUMscUJBQUQsRUFBd0IsTUFBTTtBQUNoQyxRQUFNQyxTQUFOLENBQWdCO0FBQUE7QUFBQSxXQUNkQyxPQURjLEdBQ0osQ0FESTtBQUFB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QU4sQ0FBcUNHLGlCQUFyQyxDQUF1RCxHQUF2RDtBQUNBRCxFQUFBQSxNQUFNLENBQUNMLEtBQUssQ0FBQ0wsT0FBUCxDQUFOLENBQXNCNEIsT0FBdEIsQ0FBOEIsQ0FBOUI7QUFFQSxtQkFBSSxNQUFNO0FBQ1J2QixJQUFBQSxLQUFLLENBQUNKLFFBQU47QUFDRCxHQUZEO0FBR0FTLEVBQUFBLE1BQU0sQ0FBQ0wsS0FBSyxDQUFDTCxPQUFQLENBQU4sQ0FBc0I0QixPQUF0QixDQUE4QixDQUE5QjtBQUNBbEIsRUFBQUEsTUFBTSxDQUFDRixXQUFXLENBQUMsZUFBRCxDQUFaLENBQU4sQ0FBcUNHLGlCQUFyQyxDQUF1RCxHQUF2RDtBQUVBLG1CQUFJLE1BQU07QUFDUk4sSUFBQUEsS0FBSyxDQUFDSixRQUFOO0FBQ0QsR0FGRDtBQUdBUyxFQUFBQSxNQUFNLENBQUNMLEtBQUssQ0FBQ0wsT0FBUCxDQUFOLENBQXNCNEIsT0FBdEIsQ0FBOEIsQ0FBOUI7QUFDQWxCLEVBQUFBLE1BQU0sQ0FBQ0YsV0FBVyxDQUFDLGVBQUQsQ0FBWixDQUFOLENBQXFDRyxpQkFBckMsQ0FBdUQsR0FBdkQ7QUFDRCxDQXhFRyxDQUFKIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgdXNlT2JzZXJ2ZXIgZnJvbSAnLi91c2VPYnNlcnZlcidcbmltcG9ydCB7cmVuZGVyLCBhY3R9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgJ0B0ZXN0aW5nLWxpYnJhcnkvamVzdC1kb20vZXh0ZW5kLWV4cGVjdCdcbmltcG9ydCB7YWRkSGFzaH0gZnJvbSAnLi9hZGRIYXNoJ1xuXG50ZXN0KCdhZGQgaGFzaCBpbnRlcm5hbGx5JywgKCkgPT4ge1xuICBjbGFzcyBUZXN0Q2xhc3Mge1xuICAgIGN1cnJlbnQgPSAyXG5cbiAgICBwcmV2aW91cygpOiB2b2lkIHtcbiAgICAgIHRoaXMuY3VycmVudC0tXG4gICAgfVxuXG4gICAgZ2V0Q3VycmVudCgpOiBudW1iZXIge1xuICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q2xhc3MoKVxuXG4gIGZ1bmN0aW9uIENvbXBvbmVudFVzaW5nTW9kZWwoe21vZGVsfToge21vZGVsOiBUZXN0Q2xhc3N9KSB7XG4gICAgdXNlT2JzZXJ2ZXIobW9kZWwpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKTogdm9pZCA9PiBtb2RlbC5wcmV2aW91cygpfT5cbiAgICAgICAgICBDaGFuZ2UgdGhlIG51bWJlcnMgaW4gZmlyc3QgY29tcG9uZW50XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPXsnbnVtYmVySW5GaXJzdCd9Pnttb2RlbC5nZXRDdXJyZW50KCl9PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBmdW5jdGlvbiBPdGhlckNvbXBvbmVudFVzaW5nTW9kZWwoe21vZGVsfToge21vZGVsOiBUZXN0Q2xhc3N9KSB7XG4gICAgdXNlT2JzZXJ2ZXIobW9kZWwpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKTogdm9pZCA9PiBtb2RlbC5wcmV2aW91cygpfT5cbiAgICAgICAgICBDaGFuZ2UgaW4gdGhlIG90aGVyIGNvbXBvbmVudFxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD17J251bWJlckluT3RoZXInfT57bW9kZWwuZ2V0Q3VycmVudCgpfTwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgZnVuY3Rpb24gQ29tcG9uZW50V2l0aE5lc3RlZFVzZU9mVGhlTW9kZWxPYmplY3QoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDw+XG4gICAgICAgIDxDb21wb25lbnRVc2luZ01vZGVsIG1vZGVsPXtvYmp9IC8+XG4gICAgICAgIDxPdGhlckNvbXBvbmVudFVzaW5nTW9kZWwgbW9kZWw9e29ian0gLz5cbiAgICAgIDwvPlxuICAgIClcbiAgfVxuXG4gIGNvbnN0IHtnZXRCeVRlc3RJZCwgZ2V0QnlUZXh0fSA9IHJlbmRlcihcbiAgICA8Q29tcG9uZW50V2l0aE5lc3RlZFVzZU9mVGhlTW9kZWxPYmplY3QgLz5cbiAgKVxuXG4gIGV4cGVjdChnZXRCeVRlc3RJZCgnbnVtYmVySW5GaXJzdCcpKS50b0hhdmVUZXh0Q29udGVudCgnMicpXG4gIGV4cGVjdChnZXRCeVRlc3RJZCgnbnVtYmVySW5PdGhlcicpKS50b0hhdmVUZXh0Q29udGVudCgnMicpXG5cbiAgZ2V0QnlUZXh0KCdDaGFuZ2UgdGhlIG51bWJlcnMgaW4gZmlyc3QgY29tcG9uZW50JykuY2xpY2soKVxuXG4gIGV4cGVjdChnZXRCeVRlc3RJZCgnbnVtYmVySW5GaXJzdCcpKS50b0hhdmVUZXh0Q29udGVudCgnMScpXG4gIGV4cGVjdChnZXRCeVRlc3RJZCgnbnVtYmVySW5PdGhlcicpKS50b0hhdmVUZXh0Q29udGVudCgnMScpXG59KVxuXG50ZXN0KCd0aGF0IGl0IGNhbiB3b3JrIHdpdGggb2JqZWN0cycsICgpID0+IHtcbiAgY29uc3Qgb2JqID0ge1xuICAgIGZvbzogJ2hlcmUnLFxuICAgIG11dGF0ZU1lOiAoKTogc3RyaW5nID0+IChvYmouZm9vID0gJ3RoZXJlJylcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbXBvbmVudFVzaW5nTW9kZWwoe21vZGVsfSkge1xuICAgIHVzZU9ic2VydmVyKG1vZGVsKVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9eydmb28nfT57bW9kZWwuZm9vfTwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgY29uc3Qge2dldEJ5VGVzdElkfSA9IHJlbmRlcig8Q29tcG9uZW50VXNpbmdNb2RlbCBtb2RlbD17b2JqfSAvPilcblxuICBleHBlY3QoZ2V0QnlUZXN0SWQoJ2ZvbycpKS50b0hhdmVUZXh0Q29udGVudCgnaGVyZScpXG4gIGFjdCgoKSA9PiB7XG4gICAgb2JqLm11dGF0ZU1lKClcbiAgfSlcbiAgZXhwZWN0KGdldEJ5VGVzdElkKCdmb28nKSkudG9IYXZlVGV4dENvbnRlbnQoJ3RoZXJlJylcbn0pXG5cbnRlc3QoJ3RoYXQgaXQgY2FuIHdvcmsgd2l0aCBtdWx0aXBsZSBvYmplY3RzJywgKCkgPT4ge1xuICBjb25zdCBvYmoxID0ge1xuICAgIGZvbzogJ2hlcmUnLFxuICAgIG11dGF0ZU1lOiAoKTogc3RyaW5nID0+IChvYmoxLmZvbyA9ICd0aGVyZScpXG4gIH1cblxuICBjb25zdCBvYmoyID0ge1xuICAgIGJhcjogJ3BldGUnLFxuICAgIG11dGF0ZU1lOiAoKTogc3RyaW5nID0+IChvYmoyLmJhciA9ICdwYXVsJylcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbXBvbmVudFVzaW5nTW9kZWwoe21vZGVsMSwgbW9kZWwyfSkge1xuICAgIHVzZU9ic2VydmVyKG1vZGVsMSlcbiAgICB1c2VPYnNlcnZlcihtb2RlbDIpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD17J2Zvbyd9Pnttb2RlbDEuZm9vfTwvZGl2PlxuICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPXsnYmFyJ30+e21vZGVsMi5iYXJ9PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBjb25zdCB7Z2V0QnlUZXN0SWR9ID0gcmVuZGVyKFxuICAgIDxDb21wb25lbnRVc2luZ01vZGVsIG1vZGVsMT17b2JqMX0gbW9kZWwyPXtvYmoyfSAvPlxuICApXG5cbiAgZXhwZWN0KGdldEJ5VGVzdElkKCdmb28nKSkudG9IYXZlVGV4dENvbnRlbnQoJ2hlcmUnKVxuICBleHBlY3QoZ2V0QnlUZXN0SWQoJ2JhcicpKS50b0hhdmVUZXh0Q29udGVudCgncGV0ZScpXG4gIGFjdCgoKSA9PiB7XG4gICAgb2JqMS5tdXRhdGVNZSgpXG4gIH0pXG4gIGV4cGVjdChnZXRCeVRlc3RJZCgnZm9vJykpLnRvSGF2ZVRleHRDb250ZW50KCd0aGVyZScpXG4gIGV4cGVjdChnZXRCeVRlc3RJZCgnYmFyJykpLnRvSGF2ZVRleHRDb250ZW50KCdwZXRlJylcbiAgYWN0KCgpID0+IHtcbiAgICBvYmoyLm11dGF0ZU1lKClcbiAgfSlcbiAgZXhwZWN0KGdldEJ5VGVzdElkKCdiYXInKSkudG9IYXZlVGV4dENvbnRlbnQoJ3BhdWwnKVxufSlcblxudGVzdCgndGhhdCBpdCBjYW4gd29yayB3aXRoIG11bHRpcGxlIG9iamVjdHMnLCAoKSA9PiB7XG4gIGNvbnN0IG9iajEgPSB7XG4gICAgZm9vOiAnaGVyZScsXG4gICAgbXV0YXRlTWU6ICgpOiBzdHJpbmcgPT4gKG9iajEuZm9vID0gJ3RoZXJlJylcbiAgfVxuXG4gIGNvbnN0IG9iajIgPSB7XG4gICAgYmFyOiAncGV0ZScsXG4gICAgbXV0YXRlTWU6ICgpOiBzdHJpbmcgPT4gKG9iajIuYmFyID0gJ3BhdWwnKVxuICB9XG5cbiAgZnVuY3Rpb24gQ29tcG9uZW50VXNpbmdNb2RlbDEoe21vZGVsfSkge1xuICAgIHVzZU9ic2VydmVyKG1vZGVsKVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9eydmb28nfT57bW9kZWwuZm9vfTwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgZnVuY3Rpb24gQ29tcG9uZW50VXNpbmdNb2RlbDIoe21vZGVsfSkge1xuICAgIHVzZU9ic2VydmVyKG1vZGVsKVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9eydiYXInfT57bW9kZWwuYmFyfTwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgY29uc3QgZ2V0QnlUZXN0SWQxID0gcmVuZGVyKDxDb21wb25lbnRVc2luZ01vZGVsMSBtb2RlbD17b2JqMX0gLz4pLmdldEJ5VGVzdElkXG4gIGNvbnN0IGdldEJ5VGVzdElkMiA9IHJlbmRlcig8Q29tcG9uZW50VXNpbmdNb2RlbDIgbW9kZWw9e29iajJ9IC8+KS5nZXRCeVRlc3RJZFxuXG4gIGV4cGVjdChnZXRCeVRlc3RJZDEoJ2ZvbycpKS50b0hhdmVUZXh0Q29udGVudCgnaGVyZScpXG4gIGV4cGVjdChnZXRCeVRlc3RJZDIoJ2JhcicpKS50b0hhdmVUZXh0Q29udGVudCgncGV0ZScpXG4gIGFjdCgoKSA9PiB7XG4gICAgb2JqMS5tdXRhdGVNZSgpXG4gIH0pXG4gIGV4cGVjdChnZXRCeVRlc3RJZDEoJ2ZvbycpKS50b0hhdmVUZXh0Q29udGVudCgndGhlcmUnKVxuICBleHBlY3QoZ2V0QnlUZXN0SWQyKCdiYXInKSkudG9IYXZlVGV4dENvbnRlbnQoJ3BldGUnKVxuICBhY3QoKCkgPT4ge1xuICAgIG9iajIubXV0YXRlTWUoKVxuICB9KVxuICBleHBlY3QoZ2V0QnlUZXN0SWQxKCdmb28nKSkudG9IYXZlVGV4dENvbnRlbnQoJ3RoZXJlJylcbiAgZXhwZWN0KGdldEJ5VGVzdElkMignYmFyJykpLnRvSGF2ZVRleHRDb250ZW50KCdwYXVsJylcbn0pXG5cbnRlc3QoJ2FkZCBoYXNoIGV4cGxpY2l0bHknLCAoKSA9PiB7XG4gIGNsYXNzIFRlc3RDbGFzcyB7XG4gICAgY3VycmVudCA9IDJcblxuICAgIHByZXZpb3VzKCk6IHZvaWQge1xuICAgICAgdGhpcy5jdXJyZW50LS1cbiAgICB9XG5cbiAgICBnZXRDdXJyZW50KCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gdGhpcy5jdXJyZW50XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gQ29tcG9uZW50VXNpbmdNb2RlbCh7bW9kZWx9OiB7bW9kZWw6IFRlc3RDbGFzc30pIHtcbiAgICBjb25zdCBtZXRob2RzID0gdXNlT2JzZXJ2ZXIoYWRkSGFzaChtb2RlbCkpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBtZXRob2RzLnByZXZpb3VzKCl9PlxuICAgICAgICAgIENoYW5nZSB0aGUgbnVtYmVycyBpbiBmaXJzdCBjb21wb25lbnRcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9eydudW1iZXJJbkZpcnN0J30+e21ldGhvZHMuZ2V0Q3VycmVudCgpfTwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgZnVuY3Rpb24gT3RoZXJDb21wb25lbnRVc2luZ01vZGVsKHttb2RlbH06IHttb2RlbDogVGVzdENsYXNzfSkge1xuICAgIGNvbnN0IG1ldGhvZHMgPSB1c2VPYnNlcnZlcihhZGRIYXNoKG1vZGVsKSlcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IG1ldGhvZHMucHJldmlvdXMoKX0+XG4gICAgICAgICAgQ2hhbmdlIGluIHRoZSBvdGhlciBjb21wb25lbnRcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9eydudW1iZXJJbk90aGVyJ30+e21ldGhvZHMuZ2V0Q3VycmVudCgpfTwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgZnVuY3Rpb24gQ29tcG9uZW50V2l0aE5lc3RlZFVzZU9mVGhlTW9kZWxPYmplY3QoKSB7XG4gICAgY29uc3QgbW9kZWwgPSBuZXcgVGVzdENsYXNzKClcbiAgICByZXR1cm4gKFxuICAgICAgPD5cbiAgICAgICAgPENvbXBvbmVudFVzaW5nTW9kZWwgbW9kZWw9e21vZGVsfSAvPlxuICAgICAgICA8T3RoZXJDb21wb25lbnRVc2luZ01vZGVsIG1vZGVsPXttb2RlbH0gLz5cbiAgICAgIDwvPlxuICAgIClcbiAgfVxuXG4gIGNvbnN0IHtnZXRCeVRlc3RJZCwgZ2V0QnlUZXh0fSA9IHJlbmRlcihcbiAgICA8Q29tcG9uZW50V2l0aE5lc3RlZFVzZU9mVGhlTW9kZWxPYmplY3QgLz5cbiAgKVxuXG4gIGV4cGVjdChnZXRCeVRlc3RJZCgnbnVtYmVySW5GaXJzdCcpKS50b0hhdmVUZXh0Q29udGVudCgnMicpXG4gIGV4cGVjdChnZXRCeVRlc3RJZCgnbnVtYmVySW5PdGhlcicpKS50b0hhdmVUZXh0Q29udGVudCgnMicpXG5cbiAgZ2V0QnlUZXh0KCdDaGFuZ2UgdGhlIG51bWJlcnMgaW4gZmlyc3QgY29tcG9uZW50JykuY2xpY2soKVxuXG4gIGV4cGVjdChnZXRCeVRlc3RJZCgnbnVtYmVySW5GaXJzdCcpKS50b0hhdmVUZXh0Q29udGVudCgnMScpXG4gIGV4cGVjdChnZXRCeVRlc3RJZCgnbnVtYmVySW5PdGhlcicpKS50b0hhdmVUZXh0Q29udGVudCgnMScpXG59KVxuXG50ZXN0KCdoYXZlIGEgZ2xvYmFsIG1vZGVsJywgYXN5bmMgKCkgPT4ge1xuICBjbGFzcyBUZXN0Q2xhc3Mge1xuICAgIF9fY3VycmVudCA9IDJcblxuICAgIGdldCBjdXJyZW50KCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gdGhpcy5fX2N1cnJlbnRcbiAgICB9XG5cbiAgICBzZXQgY3VycmVudCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICB0aGlzLl9fY3VycmVudCA9IHZhbHVlXG4gICAgfVxuXG4gICAgcHJldmlvdXMoKTogdm9pZCB7XG4gICAgICB0aGlzLmN1cnJlbnQtLVxuICAgIH1cblxuICAgIGdldEN1cnJlbnQoKTogbnVtYmVyIHtcbiAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRcbiAgICB9XG4gIH1cblxuICBjb25zdCBtb2RlbCA9IG5ldyBUZXN0Q2xhc3MoKVxuXG4gIGNvbnN0IHVzZU51bWJlckNoYW5nZXIgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHVzZU9ic2VydmVyKG1vZGVsKVxuICB9XG5cbiAgZnVuY3Rpb24gQ29tcG9uZW50VXNpbmdNb2RlbCgpIHtcbiAgICBjb25zdCBtZXRob2RzID0gdXNlTnVtYmVyQ2hhbmdlcigpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBtZXRob2RzLnByZXZpb3VzKCl9PlxuICAgICAgICAgIENoYW5nZSB0aGUgbnVtYmVycyBpbiBmaXJzdCBjb21wb25lbnRcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9eydudW1iZXJJbkZpcnN0J30+e21ldGhvZHMuZ2V0Q3VycmVudCgpfTwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgZnVuY3Rpb24gT3RoZXJDb21wb25lbnRVc2luZ01vZGVsKCkge1xuICAgIGNvbnN0IG1ldGhvZHMgPSB1c2VOdW1iZXJDaGFuZ2VyKClcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IG1ldGhvZHMucHJldmlvdXMoKX0+XG4gICAgICAgICAgQ2hhbmdlIGluIHRoZSBvdGhlciBjb21wb25lbnRcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9eydudW1iZXJJbk90aGVyJ30+e21ldGhvZHMuZ2V0Q3VycmVudCgpfTwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgZnVuY3Rpb24gQ29tcG9uZW50V2l0aE5lc3RlZFVzZU9mVGhlTW9kZWxPYmplY3QoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDw+XG4gICAgICAgIDxDb21wb25lbnRVc2luZ01vZGVsIC8+XG4gICAgICAgIDxPdGhlckNvbXBvbmVudFVzaW5nTW9kZWwgLz5cbiAgICAgIDwvPlxuICAgIClcbiAgfVxuXG4gIGNvbnN0IHtnZXRCeVRlc3RJZCwgZ2V0QnlUZXh0fSA9IHJlbmRlcihcbiAgICA8Q29tcG9uZW50V2l0aE5lc3RlZFVzZU9mVGhlTW9kZWxPYmplY3QgLz5cbiAgKVxuXG4gIGV4cGVjdChnZXRCeVRlc3RJZCgnbnVtYmVySW5GaXJzdCcpKS50b0hhdmVUZXh0Q29udGVudCgnMicpXG4gIGV4cGVjdChnZXRCeVRlc3RJZCgnbnVtYmVySW5PdGhlcicpKS50b0hhdmVUZXh0Q29udGVudCgnMicpXG4gIGV4cGVjdChtb2RlbC5nZXRDdXJyZW50KCkpLnRvRXF1YWwoMilcblxuICBnZXRCeVRleHQoJ0NoYW5nZSB0aGUgbnVtYmVycyBpbiBmaXJzdCBjb21wb25lbnQnKS5jbGljaygpXG5cbiAgZXhwZWN0KGdldEJ5VGVzdElkKCdudW1iZXJJbkZpcnN0JykpLnRvSGF2ZVRleHRDb250ZW50KCcxJylcbiAgZXhwZWN0KGdldEJ5VGVzdElkKCdudW1iZXJJbk90aGVyJykpLnRvSGF2ZVRleHRDb250ZW50KCcxJylcbiAgZXhwZWN0KG1vZGVsLmdldEN1cnJlbnQoKSkudG9FcXVhbCgxKVxuXG4gIGFjdCgoKSA9PiB7XG4gICAgbW9kZWwucHJldmlvdXMoKVxuICB9KVxuICBleHBlY3QobW9kZWwuZ2V0Q3VycmVudCgpKS50b0VxdWFsKDApXG4gIGV4cGVjdChnZXRCeVRlc3RJZCgnbnVtYmVySW5GaXJzdCcpKS50b0hhdmVUZXh0Q29udGVudCgnMCcpXG4gIGV4cGVjdChnZXRCeVRlc3RJZCgnbnVtYmVySW5PdGhlcicpKS50b0hhdmVUZXh0Q29udGVudCgnMCcpXG59KVxuXG50ZXN0KCduZXN0ZWQgY2xhc3NlcycsICgpID0+IHtcbiAgY2xhc3MgTWVtYmVyQ2xhc3Mge1xuICAgIF9fY3VycmVudCA9IDJcblxuICAgIGdldCBjdXJyZW50KCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gdGhpcy5fX2N1cnJlbnRcbiAgICB9XG5cbiAgICBzZXQgY3VycmVudCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICB0aGlzLl9fY3VycmVudCA9IHZhbHVlXG4gICAgfVxuICB9XG5cbiAgY2xhc3MgVGVzdENsYXNzIHtcbiAgICBtZW1iZXI6IE1lbWJlckNsYXNzID0gbmV3IE1lbWJlckNsYXNzKClcblxuICAgIHByZXZpb3VzKCk6IHZvaWQge1xuICAgICAgdGhpcy5tZW1iZXIuY3VycmVudC0tXG4gICAgfVxuXG4gICAgZ2V0Q3VycmVudCgpOiBudW1iZXIge1xuICAgICAgcmV0dXJuIHRoaXMubWVtYmVyLmN1cnJlbnRcbiAgICB9XG4gIH1cblxuICBjb25zdCBtb2RlbCA9IG5ldyBUZXN0Q2xhc3MoKVxuXG4gIGNvbnN0IHVzZU51bWJlckNoYW5nZXIgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHVzZU9ic2VydmVyKG1vZGVsKVxuICB9XG5cbiAgZnVuY3Rpb24gQ29tcG9uZW50VXNpbmdNb2RlbCgpIHtcbiAgICBjb25zdCBtZXRob2RzID0gdXNlTnVtYmVyQ2hhbmdlcigpXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gbWV0aG9kcy5wcmV2aW91cygpfT5cbiAgICAgICAgICBDaGFuZ2UgdGhlIG51bWJlcnMgaW4gZmlyc3QgY29tcG9uZW50XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPXsnbnVtYmVySW5GaXJzdCd9PnttZXRob2RzLmdldEN1cnJlbnQoKX08L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGZ1bmN0aW9uIE90aGVyQ29tcG9uZW50VXNpbmdNb2RlbCgpIHtcbiAgICBjb25zdCBtZXRob2RzID0gdXNlTnVtYmVyQ2hhbmdlcigpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBtZXRob2RzLnByZXZpb3VzKCl9PlxuICAgICAgICAgIENoYW5nZSBpbiB0aGUgb3RoZXIgY29tcG9uZW50XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPXsnbnVtYmVySW5PdGhlcid9PnttZXRob2RzLmdldEN1cnJlbnQoKX08L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbXBvbmVudFdpdGhOZXN0ZWRVc2VPZlRoZU1vZGVsT2JqZWN0KCkge1xuICAgIHJldHVybiAoXG4gICAgICA8PlxuICAgICAgICA8Q29tcG9uZW50VXNpbmdNb2RlbCAvPlxuICAgICAgICA8T3RoZXJDb21wb25lbnRVc2luZ01vZGVsIC8+XG4gICAgICA8Lz5cbiAgICApXG4gIH1cblxuICBjb25zdCB7Z2V0QnlUZXN0SWQsIGdldEJ5VGV4dH0gPSByZW5kZXIoXG4gICAgPENvbXBvbmVudFdpdGhOZXN0ZWRVc2VPZlRoZU1vZGVsT2JqZWN0IC8+XG4gIClcblxuICBleHBlY3QoZ2V0QnlUZXN0SWQoJ251bWJlckluRmlyc3QnKSkudG9IYXZlVGV4dENvbnRlbnQoJzInKVxuICBleHBlY3QoZ2V0QnlUZXN0SWQoJ251bWJlckluT3RoZXInKSkudG9IYXZlVGV4dENvbnRlbnQoJzInKVxuICBleHBlY3QobW9kZWwuZ2V0Q3VycmVudCgpKS50b0VxdWFsKDIpXG5cbiAgZ2V0QnlUZXh0KCdDaGFuZ2UgdGhlIG51bWJlcnMgaW4gZmlyc3QgY29tcG9uZW50JykuY2xpY2soKVxuXG4gIGV4cGVjdChnZXRCeVRlc3RJZCgnbnVtYmVySW5GaXJzdCcpKS50b0hhdmVUZXh0Q29udGVudCgnMScpXG4gIGV4cGVjdChnZXRCeVRlc3RJZCgnbnVtYmVySW5PdGhlcicpKS50b0hhdmVUZXh0Q29udGVudCgnMScpXG4gIGV4cGVjdChtb2RlbC5nZXRDdXJyZW50KCkpLnRvRXF1YWwoMSlcblxuICBhY3QoKCkgPT4ge1xuICAgIG1vZGVsLnByZXZpb3VzKClcbiAgfSlcbiAgZXhwZWN0KG1vZGVsLmdldEN1cnJlbnQoKSkudG9FcXVhbCgwKVxuICBleHBlY3QoZ2V0QnlUZXN0SWQoJ251bWJlckluRmlyc3QnKSkudG9IYXZlVGV4dENvbnRlbnQoJzAnKVxuICBleHBlY3QoZ2V0QnlUZXN0SWQoJ251bWJlckluT3RoZXInKSkudG9IYXZlVGV4dENvbnRlbnQoJzAnKVxufSlcblxudGVzdCgnQ2hhbmdpbmcgYSBzdGF0ZSBvZiBvbmUgbW9kZWwgc2hvdWxkIG5vdCByZS1yZW5kZXIgYSByZWFjdCBjb21wb25lbnQgdXNpbmcgYSBkaWZmZXJlbnQgbW9kZWwnLCAoKSA9PiB7XG4gIGNvbnN0IGZpcnN0TW9kZWwgPSB7XG4gICAgZm9vOiAnaGVyZScsXG4gICAgbXV0YXRlTWU6ICgpOiBzdHJpbmcgPT4gKGZpcnN0TW9kZWwuZm9vID0gJ3RoZXJlJylcbiAgfVxuXG4gIGxldCBmaXJzdENvbXBvbmVudFJlcnVuVGltZXMgPSAwXG5cbiAgZnVuY3Rpb24gQ29tcG9uZW50VXNpbmdNb2RlbCgpIHtcbiAgICBmaXJzdENvbXBvbmVudFJlcnVuVGltZXMrK1xuICAgIHVzZU9ic2VydmVyKGZpcnN0TW9kZWwpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD17J2Zvbyd9PntmaXJzdE1vZGVsLmZvb308L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGNvbnN0IG90aGVyTW9kZWwgPSB7XG4gICAgc29tZVZhbHVlOiAnc29tZVN0cmluZycsXG4gICAgY2hhbmdlTWU6IGZ1bmN0aW9uKCk6IHZvaWQge1xuICAgICAgdGhpcy5zb21lVmFsdWUgPSAnb3RoZXJTdHJpbmcnXG4gICAgfSxcbiAgICBnZXRSZXJ1blRpbWVzOiBmdW5jdGlvbigpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuIHRoaXMuc29tZVZhbHVlXG4gICAgfVxuICB9XG5cbiAgbGV0IGRpZmZlcmVudENvbXBvbmVudFJlcnVuVGltZXMgPSAwXG5cbiAgZnVuY3Rpb24gQ29tcG9uZW50VXNpbmdEaWZmZXJlbnRNb2RlbCgpIHtcbiAgICBkaWZmZXJlbnRDb21wb25lbnRSZXJ1blRpbWVzKytcbiAgICB1c2VPYnNlcnZlcihvdGhlck1vZGVsKVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxkaXY+e290aGVyTW9kZWwuZ2V0UmVydW5UaW1lcygpfTwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgY29uc3Qge2dldEJ5VGVzdElkfSA9IHJlbmRlcig8Q29tcG9uZW50VXNpbmdNb2RlbCAvPilcbiAgcmVuZGVyKDxDb21wb25lbnRVc2luZ0RpZmZlcmVudE1vZGVsIC8+KVxuICBleHBlY3QoZGlmZmVyZW50Q29tcG9uZW50UmVydW5UaW1lcykudG9FcXVhbCgxKVxuICBleHBlY3QoZmlyc3RDb21wb25lbnRSZXJ1blRpbWVzKS50b0VxdWFsKDEpXG4gIGV4cGVjdChnZXRCeVRlc3RJZCgnZm9vJykpLnRvSGF2ZVRleHRDb250ZW50KCdoZXJlJylcblxuICBhY3QoKCkgPT4ge1xuICAgIGZpcnN0TW9kZWwubXV0YXRlTWUoKVxuICB9KVxuICBleHBlY3QoZ2V0QnlUZXN0SWQoJ2ZvbycpKS50b0hhdmVUZXh0Q29udGVudCgndGhlcmUnKVxuICBleHBlY3QoZmlyc3RDb21wb25lbnRSZXJ1blRpbWVzKS50b0VxdWFsKDIpXG4gIGV4cGVjdChkaWZmZXJlbnRDb21wb25lbnRSZXJ1blRpbWVzKS50b0VxdWFsKDEpXG5cbiAgYWN0KCgpID0+IHtcbiAgICBvdGhlck1vZGVsLmNoYW5nZU1lKClcbiAgfSlcbiAgZXhwZWN0KGRpZmZlcmVudENvbXBvbmVudFJlcnVuVGltZXMpLnRvRXF1YWwoMilcbiAgZXhwZWN0KGZpcnN0Q29tcG9uZW50UmVydW5UaW1lcykudG9FcXVhbCgyKVxufSlcblxudGVzdCgnaXQgc2hvdWxkIHJlLXJlbmRlciB3aGVuIG51bGwgZmllbGRzIGFyZSBzZXQgdG8gYSB2YWx1ZScsICgpID0+IHtcbiAgY29uc3Qgb2JqZWN0ID0ge2ZpZWxkOiBudWxsfVxuXG4gIGZ1bmN0aW9uIENvbXBvbmVudCgpIHtcbiAgICB1c2VPYnNlcnZlcihvYmplY3QpXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9eydmb28nfT5cbiAgICAgICAge29iamVjdC5maWVsZCA9PT0gbnVsbCA/ICdudWxsJyA6IG9iamVjdC5maWVsZH1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGNvbnN0IHtnZXRCeVRlc3RJZH0gPSByZW5kZXIoPENvbXBvbmVudCAvPilcblxuICBleHBlY3QoZ2V0QnlUZXN0SWQoJ2ZvbycpKS50b0hhdmVUZXh0Q29udGVudCgnbnVsbCcpXG4gIGFjdCgoKSA9PiB7XG4gICAgb2JqZWN0LmZpZWxkID0gJ2JvbydcbiAgfSlcbiAgZXhwZWN0KGdldEJ5VGVzdElkKCdmb28nKSkudG9IYXZlVGV4dENvbnRlbnQoJ2JvbycpXG59KVxuXG50ZXN0KCdpdCBzaG91bGQgcmUtcmVuZGVyIHdoZW4gbnVsbCBmaWVsZHMgYXJlIHNldCB0byBhbiBvYmplY3Qgd2hvc2UgdmFsdWUgY2hhbmdlcycsICgpID0+IHtcbiAgY29uc3Qgb2JqZWN0ID0ge2ZpZWxkOiBudWxsfVxuXG4gIGZ1bmN0aW9uIENvbXBvbmVudCgpIHtcbiAgICB1c2VPYnNlcnZlcihvYmplY3QpXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9eydmb28nfT5cbiAgICAgICAge29iamVjdC5maWVsZCA9PT0gbnVsbCA/ICdudWxsJyA6IG9iamVjdC5maWVsZC5uZXN0ZWQuZGVlcH1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGNvbnN0IHtnZXRCeVRlc3RJZH0gPSByZW5kZXIoPENvbXBvbmVudCAvPilcblxuICBleHBlY3QoZ2V0QnlUZXN0SWQoJ2ZvbycpKS50b0hhdmVUZXh0Q29udGVudCgnbnVsbCcpXG4gIGFjdCgoKSA9PiB7XG4gICAgb2JqZWN0LmZpZWxkID0ge1xuICAgICAgbmVzdGVkOiB7XG4gICAgICAgIGRlZXA6ICd2YWx1ZSdcbiAgICAgIH1cbiAgICB9XG4gIH0pXG4gIGV4cGVjdChnZXRCeVRlc3RJZCgnZm9vJykpLnRvSGF2ZVRleHRDb250ZW50KCd2YWx1ZScpXG4gIGFjdCgoKSA9PiB7XG4gICAgb2JqZWN0LmZpZWxkLm5lc3RlZC5kZWVwID0gJ2ZhdGhvbXMnXG4gIH0pXG4gIGV4cGVjdChnZXRCeVRlc3RJZCgnZm9vJykpLnRvSGF2ZVRleHRDb250ZW50KCdmYXRob21zJylcbn0pXG5cbnRlc3QoJ2l0IHNob3VsZCByZS1yZW5kZXIgd2hlbiBtdWx0aS1sZXZlbCBkZXB0aCBmaWVsZHMgYXJlIHNldCB0byBhbiBvYmplY3Qgd2hvc2UgdmFsdWUgY2hhbmdlcycsICgpID0+IHtcbiAgY29uc3Qgb2JqZWN0ID0ge2ZpZWxkOiBudWxsfVxuXG4gIGZ1bmN0aW9uIENvbXBvbmVudCgpIHtcbiAgICB1c2VPYnNlcnZlcihvYmplY3QpXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9eydmb28nfT5cbiAgICAgICAge29iamVjdC5maWVsZCA9PT0gbnVsbCA/ICdudWxsJyA6IG9iamVjdC5maWVsZC5uZXN0ZWQuZGVlcC52ZXJ5fVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgY29uc3Qge2dldEJ5VGVzdElkfSA9IHJlbmRlcig8Q29tcG9uZW50IC8+KVxuXG4gIGV4cGVjdChnZXRCeVRlc3RJZCgnZm9vJykpLnRvSGF2ZVRleHRDb250ZW50KCdudWxsJylcbiAgYWN0KCgpID0+IHtcbiAgICBvYmplY3QuZmllbGQgPSB7XG4gICAgICBuZXN0ZWQ6IHtcbiAgICAgICAgZGVlcDogJ3ZhbHVlJ1xuICAgICAgfVxuICAgIH1cbiAgfSlcbiAgYWN0KCgpID0+IHtcbiAgICBvYmplY3QuZmllbGQubmVzdGVkID0ge1xuICAgICAgZGVlcDoge1xuICAgICAgICB2ZXJ5OiAnZGVlcGVyJ1xuICAgICAgfVxuICAgIH1cbiAgfSlcblxuICBleHBlY3QoZ2V0QnlUZXN0SWQoJ2ZvbycpKS50b0hhdmVUZXh0Q29udGVudCgnZGVlcGVyJylcbiAgYWN0KCgpID0+IHtcbiAgICBvYmplY3QuZmllbGQubmVzdGVkLmRlZXAudmVyeSA9ICdmYXRob21zJ1xuICB9KVxuICBleHBlY3QoZ2V0QnlUZXN0SWQoJ2ZvbycpKS50b0hhdmVUZXh0Q29udGVudCgnZmF0aG9tcycpXG59KVxuXG50ZXN0KCdpdCBzaG91bGQgcmUtcmVuZGVyIHdoZW4gYXJyYXkgdmFsdWVzIGNoYW5nZScsICgpID0+IHtcbiAgY29uc3Qgb2JqZWN0ID0ge2FycjogWyd6ZXJvJ119XG5cbiAgZnVuY3Rpb24gQ29tcG9uZW50KCkge1xuICAgIHVzZU9ic2VydmVyKG9iamVjdClcbiAgICByZXR1cm4gPGRpdiBkYXRhLXRlc3RpZD17J2Zvbyd9PntvYmplY3QuYXJyLnRvU3RyaW5nKCl9PC9kaXY+XG4gIH1cblxuICBjb25zdCB7Z2V0QnlUZXN0SWR9ID0gcmVuZGVyKDxDb21wb25lbnQgLz4pXG5cbiAgYWN0KCgpID0+IHtcbiAgICBvYmplY3QuYXJyWzBdID0gJ29uZSdcbiAgfSlcbiAgZXhwZWN0KGdldEJ5VGVzdElkKCdmb28nKSkudG9IYXZlVGV4dENvbnRlbnQoJ29uZScpXG4gIGFjdCgoKSA9PiB7XG4gICAgb2JqZWN0LmFyci5wdXNoKCd0d28nKVxuICB9KVxuICBleHBlY3QoZ2V0QnlUZXN0SWQoJ2ZvbycpKS50b0hhdmVUZXh0Q29udGVudCgnb25lLHR3bycpXG59KVxuXG5kZXNjcmliZS5za2lwKCdwZW5kaW5nIGVkZ2UtY2FzZXMnLCAoKSA9PiB7XG4gIHRlc3QoJ2l0IHNob3VsZCByZS1yZW5kZXIgd2hlbiBhcnJheSB2YWx1ZXMgaGF2ZSBvYmplY3RzIHdob3NlIGludGVybmFsIHZhbHVlcyBjaGFuZ2UnLCAoKSA9PiB7XG4gICAgY29uc3Qgb2JqZWN0ID0ge2FycjogW119XG5cbiAgICBmdW5jdGlvbiBDb21wb25lbnQoKSB7XG4gICAgICB1c2VPYnNlcnZlcihvYmplY3QpXG4gICAgICByZXR1cm4gPGRpdiBkYXRhLXRlc3RpZD17J2Zvbyd9PntvYmplY3QuYXJyWzBdLmhlbGxvfTwvZGl2PlxuICAgIH1cblxuICAgIG9iamVjdC5hcnJbMF0gPSB7XG4gICAgICBoZWxsbzogJ3dvcmxkJ1xuICAgIH1cblxuICAgIGNvbnN0IHtnZXRCeVRlc3RJZH0gPSByZW5kZXIoPENvbXBvbmVudCAvPilcblxuICAgIGV4cGVjdChnZXRCeVRlc3RJZCgnZm9vJykpLnRvSGF2ZVRleHRDb250ZW50KCd3b3JsZCcpXG4gICAgb2JqZWN0LmFyclswXS5oZWxsbyA9ICd0aGVyZSdcbiAgICBleHBlY3QoZ2V0QnlUZXN0SWQoJ2ZvbycpKS50b0hhdmVUZXh0Q29udGVudCgndGhlcmUnKVxuICB9KVxuXG4gIHRlc3QoJ2l0IHNob3VsZCByZS1yZW5kZXIgd2hlbiBtdWx0aS1sZXZlbCBkZXB0aCBmaWVsZHMgYXJlIHNldCB0byBhbiBvYmplY3Qgd2hvc2UgdmFsdWUgY2hhbmdlcyAtIG5ldyBmaWVsZCcsICgpID0+IHtcbiAgICBjb25zdCBvYmplY3QgPSB7fVxuXG4gICAgZnVuY3Rpb24gQ29tcG9uZW50KCkge1xuICAgICAgdXNlT2JzZXJ2ZXIob2JqZWN0KVxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD17J2Zvbyd9PlxuICAgICAgICAgIHtvYmplY3QgJiZcbiAgICAgICAgICBvYmplY3RbJ2ZpZWxkJ10gJiZcbiAgICAgICAgICBvYmplY3RbJ2ZpZWxkJ10ubmVzdGVkICYmXG4gICAgICAgICAgb2JqZWN0WydmaWVsZCddLm5lc3RlZC5kZWVwXG4gICAgICAgICAgICA/IG9iamVjdFsnZmllbGQnXS5uZXN0ZWQuZGVlcC52ZXJ5XG4gICAgICAgICAgICA6ICdudWxsJ31cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuXG4gICAgY29uc3Qge2dldEJ5VGVzdElkfSA9IHJlbmRlcig8Q29tcG9uZW50IC8+KVxuXG4gICAgZXhwZWN0KGdldEJ5VGVzdElkKCdmb28nKSkudG9IYXZlVGV4dENvbnRlbnQoJ251bGwnKVxuICAgIGFjdCgoKSA9PiB7XG4gICAgICBvYmplY3RbJ2ZpZWxkJ10gPSB7XG4gICAgICAgIG5lc3RlZDoge1xuICAgICAgICAgIGRlZXA6ICd2YWx1ZSdcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBvYmplY3RbJ2ZpZWxkJ10ubmVzdGVkID0ge1xuICAgICAgICBkZWVwOiB7XG4gICAgICAgICAgdmVyeTogJ2RlZXBlcidcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBleHBlY3QoZ2V0QnlUZXN0SWQoJ2ZvbycpKS50b0hhdmVUZXh0Q29udGVudCgnZGVlcGVyJylcbiAgICBhY3QoKCkgPT4ge1xuICAgICAgb2JqZWN0WydmaWVsZCddLm5lc3RlZC5kZWVwLnZlcnkgPSAnZmF0aG9tcydcbiAgICB9KVxuICAgIGV4cGVjdChnZXRCeVRlc3RJZCgnZm9vJykpLnRvSGF2ZVRleHRDb250ZW50KCdmYXRob21zJylcbiAgfSlcbn0pXG5cbnRlc3QoJ3VubW91bnRpbmcgb25lIGNvbXBvbmVudCBkb2VzIG5vdCBjYXVzZSBvdGhlciBjb21wb25lbnRzIHRvIGJlIHVuc3Vic2NyaWJlZCcsICgpID0+IHtcbiAgY2xhc3MgVGVzdENsYXNzIHtcbiAgICBjdXJyZW50ID0gNVxuXG4gICAgcHJldmlvdXMoKTogdm9pZCB7XG4gICAgICB0aGlzLmN1cnJlbnQtLVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG1vZGVsID0gbmV3IFRlc3RDbGFzcygpXG5cbiAgZnVuY3Rpb24gQ29tcG9uZW50VXNpbmdNb2RlbCgpIHtcbiAgICBjb25zdCBtZXRob2RzID0gdXNlT2JzZXJ2ZXIobW9kZWwpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBtZXRob2RzLnByZXZpb3VzKCl9PlxuICAgICAgICAgIENoYW5nZSB0aGUgbnVtYmVycyBpbiBmaXJzdCBjb21wb25lbnRcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9eydudW1iZXJJbkZpcnN0J30+e21ldGhvZHMuY3VycmVudH08L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGZ1bmN0aW9uIE90aGVyQ29tcG9uZW50VXNpbmdNb2RlbCgpIHtcbiAgICBjb25zdCBtZXRob2RzID0gdXNlT2JzZXJ2ZXIobW9kZWwpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBtZXRob2RzLnByZXZpb3VzKCl9PlxuICAgICAgICAgIENoYW5nZSBpbiB0aGUgb3RoZXIgY29tcG9uZW50XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPXsnbnVtYmVySW5PdGhlcid9PnttZXRob2RzLmN1cnJlbnR9PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBmdW5jdGlvbiBDb21wb25lbnRXaXRoTmVzdGVkVXNlT2ZUaGVNb2RlbE9iamVjdCgpIHtcbiAgICB1c2VPYnNlcnZlcihtb2RlbClcbiAgICByZXR1cm4gKFxuICAgICAgPD5cbiAgICAgICAgPENvbXBvbmVudFVzaW5nTW9kZWwgLz5cbiAgICAgICAge21vZGVsLmN1cnJlbnQgPiAzID8gPE90aGVyQ29tcG9uZW50VXNpbmdNb2RlbCAvPiA6IG51bGx9XG4gICAgICA8Lz5cbiAgICApXG4gIH1cblxuICBjb25zdCB7Z2V0QnlUZXN0SWQsIGdldEJ5VGV4dH0gPSByZW5kZXIoXG4gICAgPENvbXBvbmVudFdpdGhOZXN0ZWRVc2VPZlRoZU1vZGVsT2JqZWN0IC8+XG4gIClcblxuICBleHBlY3QoZ2V0QnlUZXN0SWQoJ251bWJlckluRmlyc3QnKSkudG9IYXZlVGV4dENvbnRlbnQoJzUnKVxuICBleHBlY3QoZ2V0QnlUZXN0SWQoJ251bWJlckluT3RoZXInKSkudG9IYXZlVGV4dENvbnRlbnQoJzUnKVxuICBleHBlY3QobW9kZWwuY3VycmVudCkudG9FcXVhbCg1KVxuXG4gIGdldEJ5VGV4dCgnQ2hhbmdlIHRoZSBudW1iZXJzIGluIGZpcnN0IGNvbXBvbmVudCcpLmNsaWNrKClcblxuICBleHBlY3QoZ2V0QnlUZXN0SWQoJ251bWJlckluRmlyc3QnKSkudG9IYXZlVGV4dENvbnRlbnQoJzQnKVxuICBleHBlY3QoZ2V0QnlUZXN0SWQoJ251bWJlckluT3RoZXInKSkudG9IYXZlVGV4dENvbnRlbnQoJzQnKVxuICBleHBlY3QobW9kZWwuY3VycmVudCkudG9FcXVhbCg0KVxuXG4gIGFjdCgoKSA9PiB7XG4gICAgbW9kZWwucHJldmlvdXMoKVxuICB9KVxuICBleHBlY3QobW9kZWwuY3VycmVudCkudG9FcXVhbCgzKVxuICBleHBlY3QoZ2V0QnlUZXN0SWQoJ251bWJlckluRmlyc3QnKSkudG9IYXZlVGV4dENvbnRlbnQoJzMnKVxuXG4gIGFjdCgoKSA9PiB7XG4gICAgbW9kZWwucHJldmlvdXMoKVxuICB9KVxuICBleHBlY3QobW9kZWwuY3VycmVudCkudG9FcXVhbCgyKVxuICBleHBlY3QoZ2V0QnlUZXN0SWQoJ251bWJlckluRmlyc3QnKSkudG9IYXZlVGV4dENvbnRlbnQoJzInKVxufSlcbiJdfQ==