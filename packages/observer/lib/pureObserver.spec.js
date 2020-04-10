"use strict";

var td = _interopRequireWildcard(require("testdouble"));

var _useObserver = require("./useObserver");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

test('it reacts to a change', () => {
  const object = {
    test: 'abc'
  };
  const obj1Callback = td.func();
  (0, _useObserver.pureObserver)(object, obj1Callback);
  object.test = 'def';
  td.verify(obj1Callback());
  object.test = 'there';
  td.verify(obj1Callback(), {
    times: 2
  });
});
test('that it can work with multiple objects, no react', () => {
  const obj1 = {
    foo: 'here',
    mutateMe: () => obj1.foo = 'there'
  };
  const obj2 = {
    bar: 'pete',
    mutateMe: () => obj2.bar = 'paul'
  };
  const obj1Callback = td.func();
  (0, _useObserver.pureObserver)(obj1, obj1Callback);
  const obj2Callback = td.func();
  (0, _useObserver.pureObserver)(obj2, obj2Callback);
  obj1.mutateMe();
  td.verify(obj1Callback());
  td.verify(obj2Callback(), {
    times: 0
  });
  obj2.mutateMe();
  td.verify(obj2Callback());
});
test('it should callback for changes in objects added to arrays', () => {
  const object = {
    arr: []
  };
  const obj1Callback = td.func();
  (0, _useObserver.pureObserver)(object, obj1Callback);
  object.arr[0] = {
    hello: 'world'
  };
  td.verify(obj1Callback());
  object.arr[0].hello = 'there';
  td.verify(obj1Callback(), {
    times: 2
  });
});
test('it should callback for changes in objects added to arrays before observer is attached', () => {
  const object = {
    arr: []
  };
  const obj1Callback = td.func();
  object.arr[0] = {
    hello: 'world'
  };
  (0, _useObserver.pureObserver)(object, obj1Callback);
  object.arr[0].hello = 'there';
  td.verify(obj1Callback());
});
test('it should callback for changes in objects added to arrays before observer is attached', () => {
  const object = {
    arr: []
  };
  const obj1Callback = td.func();
  object.arr[0] = {
    hello: 'world'
  };
  object.arr[1] = {
    yo: 'dude'
  };
  (0, _useObserver.pureObserver)(object, obj1Callback);
  object.arr[1].yo = 'man';
  td.verify(obj1Callback());
});
test('it should observe provided arrays that overwrite internal arrays', () => {
  const arr = [];
  const obj1 = {
    arr: []
  };
  const obj1Callback = td.func();
  obj1.arr = arr;
  (0, _useObserver.pureObserver)(obj1, obj1Callback);
  arr.push('boo');
  td.verify(obj1Callback());
});
test('it should observe provided objects that overwrite internal objects', () => {
  const innerObj = {};
  const obj1 = {
    innerObj: ({} = {})
  };
  const obj1Callback = td.func();
  obj1.innerObj = innerObj;
  (0, _useObserver.pureObserver)(obj1, obj1Callback);
  innerObj['foo'] = 'bar';
  td.verify(obj1Callback());
});
test('it should observe provided arrays that create new internal arrays', () => {
  const arr = [];
  const obj1 = {};
  const obj1Callback = td.func();
  obj1['arr'] = arr;
  (0, _useObserver.pureObserver)(obj1, obj1Callback);
  arr.push('boo');
  td.verify(obj1Callback());
});
test('it should observe provided objects that create new internal objects', () => {
  const innerObj = {};
  const obj1 = {};
  const obj1Callback = td.func();
  obj1['innerObj'] = innerObj;
  (0, _useObserver.pureObserver)(obj1, obj1Callback);
  innerObj['foo'] = 'bar';
  td.verify(obj1Callback());
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wdXJlT2JzZXJ2ZXIuc3BlYy50cyJdLCJuYW1lcyI6WyJ0ZXN0Iiwib2JqZWN0Iiwib2JqMUNhbGxiYWNrIiwidGQiLCJmdW5jIiwidmVyaWZ5IiwidGltZXMiLCJvYmoxIiwiZm9vIiwibXV0YXRlTWUiLCJvYmoyIiwiYmFyIiwib2JqMkNhbGxiYWNrIiwiYXJyIiwiaGVsbG8iLCJ5byIsInB1c2giLCJpbm5lck9iaiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7QUFDQTs7Ozs7O0FBRUFBLElBQUksQ0FBQyx1QkFBRCxFQUEwQixNQUFNO0FBQ2xDLFFBQU1DLE1BQU0sR0FBRztBQUFDRCxJQUFBQSxJQUFJLEVBQUU7QUFBUCxHQUFmO0FBQ0EsUUFBTUUsWUFBWSxHQUFHQyxFQUFFLENBQUNDLElBQUgsRUFBckI7QUFDQSxpQ0FBYUgsTUFBYixFQUFxQkMsWUFBckI7QUFFQUQsRUFBQUEsTUFBTSxDQUFDRCxJQUFQLEdBQWMsS0FBZDtBQUNBRyxFQUFBQSxFQUFFLENBQUNFLE1BQUgsQ0FBVUgsWUFBWSxFQUF0QjtBQUNBRCxFQUFBQSxNQUFNLENBQUNELElBQVAsR0FBYyxPQUFkO0FBQ0FHLEVBQUFBLEVBQUUsQ0FBQ0UsTUFBSCxDQUFVSCxZQUFZLEVBQXRCLEVBQTBCO0FBQUNJLElBQUFBLEtBQUssRUFBRTtBQUFSLEdBQTFCO0FBQ0QsQ0FURyxDQUFKO0FBV0FOLElBQUksQ0FBQyxrREFBRCxFQUFxRCxNQUFNO0FBQzdELFFBQU1PLElBQUksR0FBRztBQUNYQyxJQUFBQSxHQUFHLEVBQUUsTUFETTtBQUVYQyxJQUFBQSxRQUFRLEVBQUUsTUFBT0YsSUFBSSxDQUFDQyxHQUFMLEdBQVc7QUFGakIsR0FBYjtBQUlBLFFBQU1FLElBQUksR0FBRztBQUNYQyxJQUFBQSxHQUFHLEVBQUUsTUFETTtBQUVYRixJQUFBQSxRQUFRLEVBQUUsTUFBT0MsSUFBSSxDQUFDQyxHQUFMLEdBQVc7QUFGakIsR0FBYjtBQUlBLFFBQU1ULFlBQVksR0FBR0MsRUFB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QUFILEVBQXJCO0FBQ0FHLEVBQUFBLElBQUksQ0FBQyxVQUFELENBQUosR0FBbUJVLFFBQW5CO0FBQ0EsaUNBQWFWLElBQWIsRUFBbUJMLFlBQW5CO0FBRUFlLEVBQUFBLFFBQVEsQ0FBQyxLQUFELENBQVIsR0FBa0IsS0FBbEI7QUFFQWQsRUFBQUEsRUFBRSxDQUFDRSxNQUFILENBQVVILFlBQVksRUFBdEI7QUFDRCxDQVZHLENBQUoiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB0ZCBmcm9tICd0ZXN0ZG91YmxlJ1xuaW1wb3J0IHtwdXJlT2JzZXJ2ZXJ9IGZyb20gJy4vdXNlT2JzZXJ2ZXInXG5cbnRlc3QoJ2l0IHJlYWN0cyB0byBhIGNoYW5nZScsICgpID0+IHtcbiAgY29uc3Qgb2JqZWN0ID0ge3Rlc3Q6ICdhYmMnfVxuICBjb25zdCBvYmoxQ2FsbGJhY2sgPSB0ZC5mdW5jKCkgYXMgKCkgPT4gdm9pZFxuICBwdXJlT2JzZXJ2ZXIob2JqZWN0LCBvYmoxQ2FsbGJhY2spXG5cbiAgb2JqZWN0LnRlc3QgPSAnZGVmJ1xuICB0ZC52ZXJpZnkob2JqMUNhbGxiYWNrKCkpXG4gIG9iamVjdC50ZXN0ID0gJ3RoZXJlJ1xuICB0ZC52ZXJpZnkob2JqMUNhbGxiYWNrKCksIHt0aW1lczogMn0pXG59KVxuXG50ZXN0KCd0aGF0IGl0IGNhbiB3b3JrIHdpdGggbXVsdGlwbGUgb2JqZWN0cywgbm8gcmVhY3QnLCAoKSA9PiB7XG4gIGNvbnN0IG9iajEgPSB7XG4gICAgZm9vOiAnaGVyZScsXG4gICAgbXV0YXRlTWU6ICgpID0+IChvYmoxLmZvbyA9ICd0aGVyZScpXG4gIH1cbiAgY29uc3Qgb2JqMiA9IHtcbiAgICBiYXI6ICdwZXRlJyxcbiAgICBtdXRhdGVNZTogKCkgPT4gKG9iajIuYmFyID0gJ3BhdWwnKVxuICB9XG4gIGNvbnN0IG9iajFDYWxsYmFjayA9IHRkLmZ1bmMoKVxuICBwdXJlT2JzZXJ2ZXIob2JqMSwgb2JqMUNhbGxiYWNrKVxuICBjb25zdCBvYmoyQ2FsbGJhY2sgPSB0ZC5mdW5jKClcbiAgcHVyZU9ic2VydmVyKG9iajIsIG9iajJDYWxsYmFjaylcblxuICBvYmoxLm11dGF0ZU1lKClcbiAgdGQudmVyaWZ5KG9iajFDYWxsYmFjaygpKVxuICB0ZC52ZXJpZnkob2JqMkNhbGxiYWNrKCksIHt0aW1lczogMH0pXG4gIG9iajIubXV0YXRlTWUoKVxuICB0ZC52ZXJpZnkob2JqMkNhbGxiYWNrKCkpXG59KVxuXG50ZXN0KCdpdCBzaG91bGQgY2FsbGJhY2sgZm9yIGNoYW5nZXMgaW4gb2JqZWN0cyBhZGRlZCB0byBhcnJheXMnLCAoKSA9PiB7XG4gIGNvbnN0IG9iamVjdCA9IHthcnI6IFtdfVxuICBjb25zdCBvYmoxQ2FsbGJhY2sgPSB0ZC5mdW5jKClcbiAgcHVyZU9ic2VydmVyKG9iamVjdCwgb2JqMUNhbGxiYWNrKVxuICBvYmplY3QuYXJyWzBdID0ge1xuICAgIGhlbGxvOiAnd29ybGQnXG4gIH1cbiAgdGQudmVyaWZ5KG9iajFDYWxsYmFjaygpKVxuXG4gIG9iamVjdC5hcnJbMF0uaGVsbG8gPSAndGhlcmUnXG5cbiAgdGQudmVyaWZ5KG9iajFDYWxsYmFjaygpLCB7dGltZXM6IDJ9KVxufSlcblxudGVzdCgnaXQgc2hvdWxkIGNhbGxiYWNrIGZvciBjaGFuZ2VzIGluIG9iamVjdHMgYWRkZWQgdG8gYXJyYXlzIGJlZm9yZSBvYnNlcnZlciBpcyBhdHRhY2hlZCcsICgpID0+IHtcbiAgY29uc3Qgb2JqZWN0ID0ge2FycjogW119XG4gIGNvbnN0IG9iajFDYWxsYmFjayA9IHRkLmZ1bmMoKVxuICBvYmplY3QuYXJyWzBdID0ge1xuICAgIGhlbGxvOiAnd29ybGQnXG4gIH1cbiAgcHVyZU9ic2VydmVyKG9iamVjdCwgb2JqMUNhbGxiYWNrKVxuXG4gIG9iamVjdC5hcnJbMF0uaGVsbG8gPSAndGhlcmUnXG5cbiAgdGQudmVyaWZ5KG9iajFDYWxsYmFjaygpKVxufSlcblxuXG50ZXN0KCdpdCBzaG91bGQgY2FsbGJhY2sgZm9yIGNoYW5nZXMgaW4gb2JqZWN0cyBhZGRlZCB0byBhcnJheXMgYmVmb3JlIG9ic2VydmVyIGlzIGF0dGFjaGVkJywgKCkgPT4ge1xuICBjb25zdCBvYmplY3QgPSB7YXJyOiBbXX1cbiAgY29uc3Qgb2JqMUNhbGxiYWNrID0gdGQuZnVuYygpXG4gIG9iamVjdC5hcnJbMF0gPSB7XG4gICAgaGVsbG86ICd3b3JsZCdcbiAgfVxuICBvYmplY3QuYXJyWzFdID0ge1xuICAgIHlvOiAnZHVkZSdcbiAgfVxuICBwdXJlT2JzZXJ2ZXIob2JqZWN0LCBvYmoxQ2FsbGJhY2spXG5cbiAgb2JqZWN0LmFyclsxXS55byA9ICdtYW4nXG5cbiAgdGQudmVyaWZ5KG9iajFDYWxsYmFjaygpKVxufSlcblxudGVzdCgnaXQgc2hvdWxkIG9ic2VydmUgcHJvdmlkZWQgYXJyYXlzIHRoYXQgb3ZlcndyaXRlIGludGVybmFsIGFycmF5cycsICAoKSA9PiB7XG4gIGNvbnN0IGFyciA9IFtdXG4gIGNvbnN0IG9iajEgPSB7YXJyOiBbXX1cbiAgY29uc3Qgb2JqMUNhbGxiYWNrID0gdGQuZnVuYygpXG4gIG9iajEuYXJyID0gYXJyXG4gIHB1cmVPYnNlcnZlcihvYmoxLCBvYmoxQ2FsbGJhY2spXG5cbiAgYXJyLnB1c2goJ2JvbycpXG5cbiAgdGQudmVyaWZ5KG9iajFDYWxsYmFjaygpKVxufSlcblxudGVzdCgnaXQgc2hvdWxkIG9ic2VydmUgcHJvdmlkZWQgb2JqZWN0cyB0aGF0IG92ZXJ3cml0ZSBpbnRlcm5hbCBvYmplY3RzJywgICgpID0+IHtcbiAgY29uc3QgaW5uZXJPYmogPSB7fVxuICBjb25zdCBvYmoxID0ge2lubmVyT2JqOiB7fSA9IHt9fVxuICBjb25zdCBvYmoxQ2FsbGJhY2sgPSB0ZC5mdW5jKClcbiAgb2JqMS5pbm5lck9iaiA9IGlubmVyT2JqXG4gIHB1cmVPYnNlcnZlcihvYmoxLCBvYmoxQ2FsbGJhY2spXG5cbiAgaW5uZXJPYmpbJ2ZvbyddID0gJ2JhcidcblxuICB0ZC52ZXJpZnkob2JqMUNhbGxiYWNrKCkpXG59KVxuXG50ZXN0KCdpdCBzaG91bGQgb2JzZXJ2ZSBwcm92aWRlZCBhcnJheXMgdGhhdCBjcmVhdGUgbmV3IGludGVybmFsIGFycmF5cycsICAoKSA9PiB7XG4gIGNvbnN0IGFyciA9IFtdXG4gIGNvbnN0IG9iajEgPSB7fVxuICBjb25zdCBvYmoxQ2FsbGJhY2sgPSB0ZC5mdW5jKClcbiAgb2JqMVsnYXJyJ10gPSBhcnJcbiAgcHVyZU9ic2VydmVyKG9iajEsIG9iajFDYWxsYmFjaylcblxuICBhcnIucHVzaCgnYm9vJylcblxuICB0ZC52ZXJpZnkob2JqMUNhbGxiYWNrKCkpXG59KVxuXG50ZXN0KCdpdCBzaG91bGQgb2JzZXJ2ZSBwcm92aWRlZCBvYmplY3RzIHRoYXQgY3JlYXRlIG5ldyBpbnRlcm5hbCBvYmplY3RzJywgICgpID0+IHtcbiAgY29uc3QgaW5uZXJPYmogPSB7fVxuICBjb25zdCBvYmoxID0ge31cbiAgY29uc3Qgb2JqMUNhbGxiYWNrID0gdGQuZnVuYygpXG4gIG9iajFbJ2lubmVyT2JqJ10gPSBpbm5lck9ialxuICBwdXJlT2JzZXJ2ZXIob2JqMSwgb2JqMUNhbGxiYWNrKVxuXG4gIGlubmVyT2JqWydmb28nXSA9ICdiYXInXG5cbiAgdGQudmVyaWZ5KG9iajFDYWxsYmFjaygpKVxufSlcblxuIl19