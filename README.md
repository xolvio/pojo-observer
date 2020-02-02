# React Domain Hooks

Use React hooks with a domain object. This allows you to separate view logic from interaction logic.

Let's demonstrate how it works.

First we'll create an abstract interaction model that looks like this:

```jsx
export default class GalleryInteraction {
  constructor() {
    this._images = []
    this._selectedImage = 0
  }

  // command
  nextImage() {
    if (this._selectedImage < this.images.length - 1) {
      this._selectedImage++
    }
  }

  // command
  previousImage() {
    if (this._selectedImage > 0) {
      this._selectedImage--
    }
  }

  // command
  addImage(image) {
    this._images.push(image)
  }

  // query
  currentImage() {
    return this._images[this._selectedImage]
  }
}
```

Notice how the model is designed as commands and queries as per the comments. This is a practice known as CQRS which stands for Command Query Responsibility Segregation. Building code using the CQRS principle is common amongst DDD (Domain Driven Design) practitioners as it creates highly decoupled code and ultimately reduces complexity.

This library capitalizes on the CQRS principle and provides a method that converts the raw model objects into a `CQRSWithHash` concept. The output of this method is an object that contains `commands`, `queries` and a `hash` method that tells us when the model has changes. The latter is used in the React hooks so that only changes to the model trigger re-renders.

Let's see this in code:

```jsx
const model = new GalleryInteraction()
const galleryInteraction = toCQRSWithHash({
  model,
  commands: [
    model.nextImage,
    model.previousImage,
    model.addImage,
  ],
  queries: [
    model.currentImage,
  ]
})

export {galleryInteraction}
```

You can put this code in your composite root or container if you're using dependency injection. This will allow you to reference the `galleryInteraction` object later in your React components.

Now let's look at how you can use the domain model inside a React component:

```jsx
import React, {useEffect} from 'react'
import useDomain from '../helpers/useDomain'

// ultra thin component with UI logic only. Note it's up to you to inject the model here. You woudl do so in your composite root/entry point of your app.
export default function GalleryComponent({model}) {
  
  // notice how the userDomain method takes a model and returns an array of queries, commands and history
  const [queries, commands, history] = useDomain(model)

  return (
    <>
      <h5>Component</h5>
      <p>Image = [{queries.currentImage()}]</p> // queries are used to read from the model
      <button onClick={commands.previousImage}>Previous Image</button> // commands are used to act on the model
      <button onClick={commands.nextImage}>Next Image</button> // if a command changes the model, the useDomain hook will trigger a re-render
    </>
  )
}

```

Note that if the values inside the domain object do not change, the `useDomain` hook will not re-render the component. This is achieved by using `setState` with a hash of the model object. You can see this in action by trying to repeatedly click the "Previous Image" button. The `previousImage` command in the `GalleryInteraction` domain model will stop changing the `currentImage` when it gets to 0, and since the values inside the domain model are no longer changing, the `hash` method in the `toCQRSWithHash` output ensures that the React component will not re-render. Sweet!

You can also add as many `useEffect` methods as you like as follows:

```jsx
  // ...

  // You can have effet react to specific queries
  useEffect(() => {
    console.log('effect currentImage()')
    // since you have commands, you no longer need to dispatch events with reducers.
    // You can work with the interaction domain object directly and handle all complexities there
    // commands.doSomething(...)
  }, [queries.currentImage()]) 

  useEffect(() => {
    console.log('effect images')
    // command.doSomethingElse(...)
  }, [queries._images]) // you can also access member variables directly since the command will trigger a rerender, though it's advised you don't do this as it couples your view to your interaction model. It could be useful for debugging. 
  
  // ...
```

Finally, you also have access to a `history` object (thanks to @TillaTheHun0 for this addition):

```jsx
  // ...
  
  <h5>History</h5>
  <ul>
    {history.map(cur => (<li key={cur.id}>{cur.id + ' ' + cur.command}</li>))}
  </ul>
  
  // ...
```

The history object keeps track of all commands that have been fired, which can be useful for testing, tracking, creating undo buffers, or even dumping a re-playable sequence of events for debugging purposes.

## Why do this?

Having an abstract interaction object has many advantages:
 
* It can be used by any view layer like React or Vue, or a speech UI, or even a camera gesture UI.
* The abstraction makes it easier to reason about the interaction independently of its presentation  
* Changes can be made to the interaction logic without touching the interface components
* Allows the practice of the Separation of Concerns and the Single Responsibility Principles
* Makes it easy to perform behaviour driven development and modeling by example

