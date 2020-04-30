![](https://github.com/xolvio/pojo-observer/workflows/CI/badge.svg) [![Maintainability](https://api.codeclimate.com/v1/badges/608e9ae53feef2fa019d/maintainability)](https://codeclimate.com/github/xolvio/pojo-observer/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/608e9ae53feef2fa019d/test_coverage)](https://codeclimate.com/github/xolvio/pojo-observer/test_coverage) ![npm](https://img.shields.io/npm/v/pojo-observer) ![NPM](https://img.shields.io/npm/l/pojo-observer)


# POJO Observer

## What?
A minimalist object observer that works with React hooks. 

## Why?
Because you you can separate _presentation_ logic from _interaction_ logic.

## How?
Create a POJO subject (_Plain Old Javascript Object - POTO if using Typescript?_), and have your React component update whenever that subject changes through an `useObserver` hook.

## Example 
Say you have this Gallery component. An ultra thin UI component with _presentation_ logic only:

```jsx
import useObserver from 'pojo-observer'
 
// It's up to you how the inject the subject. Perhaps use depedency injection + a composite root  
export default function GalleryUI({gallery}) {

  // Place the hook at the top of your component just like any other React hook
  useObserver(gallery)
  
  return (
    <>
      <h5>Component</h5>
      // Changes in the gallery object will be updated here whenever the subject changes
      <p>Image = [{gallery.currentImage()}]</p>
      // act directly on the subject
      <button onClick={gallery.previousImage}>Previous Image</button> 
      <button onClick={gallery.nextImage}>Next Image</button>
    </>
  )
}
```

And this POJO:
```jsx
export default class Gallery {
  constructor() {
    this._images = []
    this._selectedImage = 0
  }

  nextImage() {
    if (this._selectedImage < this.images.length - 1) {
      this._selectedImage++
    }
  }

  previousImage() {
    if (this._selectedImage > 0) {
      this._selectedImage--
    }
  }

  addImage(image) {
    this._images.push(image)
  }

  currentImage() {
    return this._images[this._selectedImage]
  }
}
```

And now any time a value inside the POJO changes, the `useObserver` hook will re-render the component. Sweet!

If the values inside the POJO do not change, the `useObserver` hook will not re-render the component. Sweet!

This is achieved internally by using `setState` with a `hash` of the POJO. You can see this in action by trying to repeatedly click the "Previous Image" button. The `previousImage` command in the `Gallery` will stop changing the `currentImage` when it gets to 0, and since the values inside the POJO are no longer changing, the `hash` method on the object ensures that the React component will not re-render.

Bonus: You can test the heck out of the interaction now without having to mess with any UI testing libraries.

### Asynchrony 
Now let's assume we have some async function on that object happening. 

```jsx
  // ... truncated for brevity 
  constructor() {   
    // ... truncated for brevity
    
    setInterval(this.nextImage, 1000)
    
    // ... truncated for brevity
```
Yes yes, never put a setInterval in a constructor. But say you have an external event that updates the model, well, the React component will update. Sweet!

### Using Other Hooks
You can also add as many other hooks like `useEffect` as you like as follows:

```jsx
  // ...

  // You can have effet react to specific queries
  useEffect(() => {
    console.log('effect currentImage()')
    // since you have commands, you no longer need to dispatch events with reducers.
    // You can work with the POJO directly and handle all complexities there
    // gallery.doSomething(...)
  }, [gallery.currentImage()]) 

  useEffect(() => {
    console.log('effect images')
    // gallery.doSomethingElse(...)
  }, [gallery._images]) // you can also access member variables directly since the command will trigger a rerender, though it's advised you don't do this as it couples your view to your POJO. It could be useful for debugging. 
  
  // ...
```

## How about nested objects, arrays, and arrays of objects?
They work :)

Check out the [`pureObserver.spec.tsx`](./src/pureObserver.spec.tsx) file for the cases we've thought of, and please report any issues you find as a test if possible and we'll work on it.

## How is this different to [Redux](https://redux.js.org), [Flux](https://facebook.github.io/flux) and [MobX](https://mobx.js.org)
This library and all the ones mentioned above are ultimately implementations of the [Observer Pattern](https://en.wikipedia.org/wiki/Observer_pattern). (Redux is more of a state management library but it also has an observer when using the Connect method). 

This library is a _minimal_ observer pattern implementation that takes in a POJO as a subject, instruments it, and performs callbacks when the subject has changed. It's not opinionated at all and allows you to use it however you see fit, like choosing the event library to add (or not). 

It's also tiny at around ~4k minified.

## Motivation
At [Xolv.io](https://www.xolv.io) we are big fans of BDD (Behaviour Driven Development), DDD (Domain Driven Design) and the Clean Architecture, and we love to make things as simple as possible. 

While working with clients and seeing how complex UI's have become, the question of "is it possible to do DDD in the UI?" kept coming up. We've had great success at helping clients do BDD, DDD, and Clean Architecture in the back-end in order to reduce complexity, increase quality, and improve speed and maintainability (_shameless plug for [our consulting services here](https://www.xolv.io/#services)_), so we wanted to see how to do this in the front-end.

The following inferences were made:

* Part of the BDD approach is bring people together to collaboratively come up with specifications that articulate the problem/solution domain as rules and examples
* Part of the DDD approach is to model the problem/solution domain using aggregates and services that enforce the said rules and carry out business logic required for said scenarios
* Part of the Clean Architecture approach is having concentric-rings layers where the inner layers contain the domain model and use-cases, and the outer layers contain the interfaces and frameworks.

In the world of front-ends, the above inferences result in the following implications:

From BDD:
* Bring designers, developers and testers together to discover and reason about a UI with a particular focus on user *interactions*, and record the outcomes as either domain or component specifications (_shameless plug, for [our XSpecs tool here](https://www.xspecs.io)_)
* Use the behaviour defined in the specifications as examples to drive out the design of the system with a strong focus on automated testing

From DDD
* Create a domain model from the specifications. In particular, the focus here is on the *interaction* domain
* Use aggregates and value objects to encapsulate an abstract interaction model
* Use domain events to communicate between different interaction aggregates
* Use services to orchestrate across interaction aggregates and remote systems 
* Use repositories to talk to back-ends

From Clean Architecture
* UI layer - components that show provided values and invoke actions onto a controller
* Controller layer - Takes actions and translates them into something the use-case interactor can deal with  
* Use-case Interactor layer - This is basically either an aggregate root or a service from DDD

_Side notes:_
* _It may make sense to have the UI layer and the Controller live in the same file, even though they are different layers, as long as the separation of concerns is applied._
* _It may not make sense to have a controller at all in some cases and to have the UI layer connect directly to an interaction domain object_

But in order to do any of the above, one has to completely decouple the presentation layer from the layers beneath. And while it's possible to do so with the right coding practices, we found there was a lot of boilerplate in binding data to the UI. If we could somehow just focus on the interaction modeling and then plug a UI on top that requires minimal boilerplate code and is highly decoupled, that would allow us to move fast and to have highly testable code. Moreover, it would not lock us in to any framework. 

This is why this library was dreamt up.

## Why do this?
Having an abstract interaction object has many advantages:
 
* The interaction layer is abstract can be used by any view layer like React or Vue, or a speech UI, or even a camera gesture UI. (Though you'd have to bind it yourself as we only support React hooks here)
* The abstraction makes it easier to reason about the interaction independently of its presentation  
* Changes can be made to the interaction logic without touching the interface components
* Allows the practice of the Separation of Concerns and the Single Responsibility Principles
* Makes it easy to perform behaviour driven development and modeling by example
