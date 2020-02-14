# POJO Observer

## What?
A minimalist object observer that works with React hooks. 

## Why?
Because you you can separate _presentation_ logic from _interaction_ logic.

## How?
Create a POJO (Plain Old Javascript Object, or POTO I guess if using Typescript), and have your React component update whenever that POJO changes through an `observe` hook.

## Example 
Say you have this Gallery component:

```jsx
import observe from 'pojo-observer'

// Ultra thin UI component with presntation logic only. 
// Note it's up to you to inject the POJO here
export default function GalleryUI({gallery}) {

  // use the observe hook at the top of your component just like you use any other React hook
  observe(gallery)
  
  return (
    <>
      <h5>Component</h5>
      <p>Image = [{gallery.currentImage()}]</p>
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

And now any time a value inside the POJO changes, the `observe` hook will re-render the component. Sweet!

If the values inside the POJO do not change, the `observe` hook will not re-render the component. Sweet!

This is achieved internally by using `setState` with a `hash` of the POJO. You can see this in action by trying to repeatedly click the "Previous Image" button. The `previousImage` command in the `Gallery` will stop changing the `currentImage` when it gets to 0, and since the values inside the POJO are no longer changing, the `hash` method on the object ensures that the React component will not re-render.

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

Check out the `observe.spec.tsx` file for details of the cases we've thought of. Can't promise that every single edge case is there, so please report any issues and we'll work on them.

## How is this different to [Redux](https://redux.js.org), [Flux](https://facebook.github.io/flux) and [MobX](https://mobx.js.org)

This library and all the ones mentioned above are ultimately implementations of the [Observer Pattern](https://en.wikipedia.org/wiki/Observer_pattern). (Redux is more of a state management library but it also has an observer when using the Connect method). 

This library is a _minimal_ observer pattern implementation that takes in a POJO as a subject, instruments to observe it, and performs callbacks when the subject has changed. It's not opinionated at all and allows you to use it however you see fit, like choosing the event library to add (or not).

It's also tiny at around ~4k minified. 

## Why do this?

Having an abstract interaction object has many advantages:
 
* The interaction layer is abstract can be used by any view layer like React or Vue, or a speech UI, or even a camera gesture UI. (Though you'd have to bind it yourself as we only support React hooks here)
* The abstraction makes it easier to reason about the interaction independently of its presentation  
* Changes can be made to the interaction logic without touching the interface components
* Allows the practice of the Separation of Concerns and the Single Responsibility Principles
* Makes it easy to perform behaviour driven development and modeling by example
