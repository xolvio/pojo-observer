"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addHash = addHash;

var _hash = _interopRequireDefault(require("./hash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addHash(testClass) {
  testClass['hash'] = function () {
    return (0, _hash.default)(this);
  };

  return testClass;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hZGRIYXNoLnRzIl0sIm5hbWVzIjpbImFkZEhhc2giLCJ0ZXN0Q2xhc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7OztBQUVPLFNBQVNBLE9BQVQsQ0FBb0JDLFNBQXBCLEVBQXFDO0FBQzFDQSxFQUFBQSxTQUFTLENBQUMsTUFBRCxDQUFULEdBQW9CLFlBQVc7QUFDN0IsV0FBTyxtQkFBSyxJQUFMLENBQVA7QUFDRCxHQUZEOztBQUdBLFNBQU9BLFNBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBoYXNoIGZyb20gJy4vaGFzaCdcblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEhhc2g8VD4odGVzdENsYXNzOiBUKTogVCB7XG4gIHRlc3RDbGFzc1snaGFzaCddID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGhhc2godGhpcylcbiAgfVxuICByZXR1cm4gdGVzdENsYXNzXG59XG4iXX0=