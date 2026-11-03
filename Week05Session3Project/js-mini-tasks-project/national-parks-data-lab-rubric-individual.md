# National Parks Data Lab - Assessment Rubric

## Project Overview

Students build a visual data lab for the National Park Service. Working as
junior data analysts, they complete a series of mini-tasks covering JavaScript
arrays and objects. Results appear on a pre-built dashboard page. Students work
only in script.js - the HTML, CSS, and display functions are provided.

---

## Must Have (Required for Passing):

### Arrays - Creation and Access

- [ ] **Create an array** - Define an array of at least 6 park names as strings
      using array literal notation (square brackets)
- [ ] **Access by index** - Use bracket notation to access the first item (index 0),
      the last item (using .length - 1), and a middle item
- [ ] **Display array results** - Use the provided show() function to display
      array values on the page

### Arrays - Looping

- [ ] **Standard for loop** - Loop through an array using a for loop with an
      index counter variable and console.log() each item
- [ ] **for...of loop** - Loop through an array using a for...of loop and
      console.log() each item
- [ ] **forEach method** - Loop through an array using .forEach() with a
      callback function and console.log() each item

### Arrays - Transformation Methods

- [ ] **map() method** - Use .map() to create a new array by transforming each
      element (e.g., adding " National Park" to each name). Store and display result.
- [ ] **filter() method** - Use .filter() to create a new array containing only
      elements matching a condition. Store and display result.
- [ ] **find() method** - Use .find() to locate the first element matching a
      condition. Store and display result.

### Objects - Creation and Properties

- [ ] **Empty object with dynamic properties** - Create an empty object using {}
      and add at least 5 properties one at a time using dot notation
- [ ] **Object literal** - Create an object using object literal notation with at
      least 4 properties plus a space-key property and a nested object
- [ ] **Dot notation access** - Access at least two object properties using dot
      notation and display results
- [ ] **Bracket notation access** - Access at least two object properties using
      bracket notation, including accessing via a variable as the key
- [ ] **Space-key property** - Create a property with a space in its name and use
      bracket notation (the only way) to access it
- [ ] **Delete a property** - Remove a property using the delete operator and show
      it is gone (undefined) with show()

### Objects - Nested Data and Chaining

- [ ] **Nested object** - Create an object that contains another object as a property
- [ ] **Access nested property - longhand** - Access a nested value using intermediate
      variables (storing the inner object first, then accessing its property)
- [ ] **Access nested property - shorthand** - Access the same value using chained
      dot notation (object.inner.property)

### Objects - Methods

- [ ] **Add a method** - Add a function as a property on an existing object using
      assignment (myObj.methodName = function() { ... })
- [ ] **Call a method** - Call the method and display the result with show()
- [ ] **Use this in a method** - Create an object with a method that uses the this
      keyword to reference at least two of the object's own properties
- [ ] **function keyword for methods** - Methods that use this are written with the
      function keyword, not as arrow functions

### Arrays of Objects - Combined

- [ ] **Array of objects** - Create an array where each element is a park object
      with the same set of properties (at least 5 objects, 6 properties each)
- [ ] **Display as table** - Use showTable() to display the array of objects
- [ ] **Loop through array of objects** - Use .forEach() to log a formatted string
      for each object using console.log()
- [ ] **filter() on array of objects** - Create at least one filtered subset of
      the parks array using a property condition (e.g., entranceFee === 0)
- [ ] **map() on array of objects** - Create an array of strings from the parks
      array using .map() and display the result with show()

### Object Manipulation

- [ ] **Object.assign() copy** - Copy an object using Object.assign({}, source),
      modify a property on the copy, and show both to prove the original is unchanged
- [ ] **Primitive value copy** - Demonstrate that changing a copied primitive does
      not affect the original (numbers, strings)
- [ ] **Object reference behavior** - Demonstrate that assigning an object to a new
      variable gives both variables the same reference (changing one changes both)
- [ ] **Object === comparison** - Show that two separate objects with identical
      contents return false with === and explain why
- [ ] **const mutation** - Show that properties on a const object can be changed
      (mutation is allowed)
- [ ] **const reassignment** - Show a commented-out reassignment attempt with a
      comment explaining the TypeError it would throw
- [ ] **const array mutation** - Show that .push() works on a const array but
      reassignment does not

---

### Could Have (Bonus Points):

### Built-in Object Methods

- [ ] **Object.keys()** - Use Object.keys() to display all property names of an
      object as an array
- [ ] **Object.values()** - Use Object.values() to display all property values
- [ ] **Object.entries()** - Use Object.entries() to display all key-value pairs,
      including accessing entries[0][0] and entries[0][1] by index

### Method Chaining

- [ ] **Chain array methods** - Chain .filter().map() in a single expression and
      show the result is identical to the longhand step-by-step version

### Object Spread

- [ ] **Spread to copy** - Copy an object using { ...original } and modify one
      property on the copy without affecting the original

---

## Code Quality Standards

- [ ] All page output uses show() or showTable() - not alert() or document.write()
- [ ] Loop output uses console.log() inside the loop body
- [ ] Variable names are descriptive (parkName not pn, entranceFee not ef)
- [ ] const is used for values that do not change, let for values that do
- [ ] Comments explain what each task is doing
- [ ] Each task section is labeled with a showSection() call or comment header
- [ ] No var keyword used

---

## Submission Requirements

**Due Date:** Start of next project
**Submission Method:** Copy/paste Github Repo link on #projects-showcase - just submit the files from your project-start without the project start folder
