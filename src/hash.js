import hash from 'object-hash'

// You may be wondering why have specs for a library we don't own.
// Reasoning here is that we want our hash implementation to fulfil
// all the specs for the rest of the library to work. It so happens
// that the `object-hash` library does that, but if we ever change
// it or choose to implement our own, then it must pass the specs.

export default hash
