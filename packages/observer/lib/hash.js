"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectHash = _interopRequireDefault(require("object-hash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// You may be wondering why have specs for a library we don't own.
// Reasoning here is that we want our hash implementation to fulfil
// all the specs for the rest of the library to work. It so happens
// that the `object-hash` library does that, but if we ever change
// it or choose to implement our own, then it must pass the specs.
var _default = obj => {
  return (0, _objectHash.default)(obj);
};

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9oYXNoLnRzIl0sIm5hbWVzIjpbIm9iaiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtlQUVlQSxHQUFHLElBQUk7QUFDcEIsU0FBTyx5QkFBS0EsR0FBTCxDQUFQO0FBQ0QsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBoYXNoIGZyb20gJ29iamVjdC1oYXNoJ1xuXG4vLyBZb3UgbWF5IGJlIHdvbmRlcmluZyB3aHkgaGF2ZSBzcGVjcyBmb3IgYSBsaWJyYXJ5IHdlIGRvbid0IG93bi5cbi8vIFJlYXNvbmluZyBoZXJlIGlzIHRoYXQgd2Ugd2FudCBvdXIgaGFzaCBpbXBsZW1lbnRhdGlvbiB0byBmdWxmaWxcbi8vIGFsbCB0aGUgc3BlY3MgZm9yIHRoZSByZXN0IG9mIHRoZSBsaWJyYXJ5IHRvIHdvcmsuIEl0IHNvIGhhcHBlbnNcbi8vIHRoYXQgdGhlIGBvYmplY3QtaGFzaGAgbGlicmFyeSBkb2VzIHRoYXQsIGJ1dCBpZiB3ZSBldmVyIGNoYW5nZVxuLy8gaXQgb3IgY2hvb3NlIHRvIGltcGxlbWVudCBvdXIgb3duLCB0aGVuIGl0IG11c3QgcGFzcyB0aGUgc3BlY3MuXG5cbmV4cG9ydCBkZWZhdWx0IG9iaiA9PiB7XG4gIHJldHVybiBoYXNoKG9iailcbn1cbiJdfQ==