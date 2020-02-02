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

This library capitalizes on the CQRS principle and gives you three options to bind the React hooks to your interaction model. We'll look into binding options later but for now let's look at how you use the model above in your React component using the `useDomain` hook.

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

Note that if the values inside the domain object do not change, the `useDomain` hook will not re-render the component. This is achieved by using `setState` with a `hash` of the model object (See binding below). You can see this in action by trying to repeatedly click the "Previous Image" button. The `previousImage` command in the `GalleryInteraction` domain model will stop changing the `currentImage` when it gets to 0, and since the values inside the domain model are no longer changing, the `hash` method on the model ensures that the React component will not re-render. Sweet!

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


## Binding Options
There are three ways to bind your model to the `useDomain` hook, each of which comes with its own pros and cons, so it depends on your architecture which one you'd like to use.
 
 
### Option 1: Using Decorators
1. import the  `@command`, `@query`, and `@hashable` decorators from this module
1. Decorate the class of the model with the `@hashable` decorator. This adds a `hash` method to the class (see below for more info)
1. Decorate your command methods with the `@command` decorator and your query methods with the `@query` decorator
1. Configure your project to use decorators. See the Babel instructions below

```jsx
import {command, query, hashable} from 'react-domain-hooks'

@hashable
class GalleryInteraction {

  @command
  nextImage() {
    // implementation omitted for brevity
  }

  @command
  previousImage() {
    // implementation omitted for brevity
  }

  @command
  addImage(image) {
    // implementation omitted for brevity
  }

  @query
  currentImage() {
    // implementation omitted for brevity
  }
}
```

Pros: (1) Has the most readable syntax of all the options and (2) requires the least boiler plate code
Cons: (1) You are polluting the interaction domain abstraction and (2) you have to configure Babel

### Option 2: Using a Decoupled Explicit Syntax

which converts the raw model objects into an object that contains `commands`, `queries` and a `hash` method. The commands and queries are delegated to the underlying model and the hash method is used to know when the model has changed (see below for more info)

1. import the `toCQRSWithHash` method 
1. explicitly provide the method with the list of command and queries
1. export the returned object as your domain model
1. optionally put this code in your composite root or container if you're using dependency injection


```jsx
import toCQRSWithHash from 'toCQRSWithHash'
import GalleryInteraction from './GalleryInteraction'

// NOTE the GalleryInteraction class would not have any decoratos and would be POJO (Plain Old Javascript Object)
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

Pros: (1) Keeps the interaction domain clean and (2) does not require any special build tooling
Cons: Requires boilerplate code every time you want to add a command/query to your domain model

### Option 2: Using a Localized Explicit Syntax
This is a combination of option 1 and 2 where you are explicit but you do so in the same file as the class making slightly more bearable.

```jsx
import toCQRSWithHash from 'toCQRSWithHash'

class GalleryInteraction {

  nextImage() {
    // implementation omitted for brevity
  }

  previousImage() {
    // implementation omitted for brevity
  }

  addImage(image) {
    // implementation omitted for brevity
  }

  currentImage() {
    // implementation omitted for brevity
  }
}

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

#### About Hashing
Both the decorator based option as well as the explicit options adds a `hash` method to the model, which computes a unique hash value for a given object based on its values. That is, the same values for a given instance will always return the same hash. This allows the `useDomain` React hook to only re-render when necessary.

#### Babel Decorators Configuration 
For this library, the following steps were taken. Your mileage may vary.

These npm modules were added:
```ecmascript 6
  "@babel/plugin-proposal-class-properties"
  "@babel/plugin-syntax-decorators"
```

They were added to the `babel.config.js` file:
```jsx
  plugins: [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "legacy": true }],
  ]
```

## Why do this?

Having an abstract interaction object has many advantages:
 
* It can be used by any view layer like React or Vue, or a speech UI, or even a camera gesture UI.
* The abstraction makes it easier to reason about the interaction independently of its presentation  
* Changes can be made to the interaction logic without touching the interface components
* Allows the practice of the Separation of Concerns and the Single Responsibility Principles
* Makes it easy to perform behaviour driven development and modeling by example

