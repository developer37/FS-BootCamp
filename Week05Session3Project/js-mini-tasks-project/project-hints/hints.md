# National Parks Data Lab - Hints

Use this file when you are stuck on a task.
Each hint gives you the syntax pattern and a nudge in the right direction
without showing you the full answer.

If a hint is not enough, check PLAN.md for a more detailed explanation.
If you are still stuck after that, look at the completed-version folder.

---

## How to Display Results

Three functions are available from display.js. Use them like this:

```javascript
showSection("Part 1: Arrays");          // adds a header to the page
show("My label", someValue);            // shows any value on the page
showTable("My label", arrayOfObjects);  // shows an array of objects as a table
```

Use `console.log()` inside loops (for, for...of, forEach) since each iteration
would create a separate card on the page, which gets noisy.

---

## PART 1: ARRAYS

---

### Task 1: Create an Array

An array uses square brackets. Values inside are separated by commas.

```javascript
const myArray = ["value1", "value2", "value3"];
show("My Array", myArray);
```

Your array should be called `parkNames` and hold at least 6 park names as strings.

---

### Task 2: Access Elements by Index

Bracket notation with a number gives you one item from the array.
Index 0 is the first item.

```javascript
show("First", myArray[0]);
show("Last", myArray[myArray.length - 1]);
show("Third", myArray[2]);
```

---

### Task 3: Standard for Loop

The for loop has three parts inside the parentheses, separated by semicolons:
start, condition, increment.

```javascript
for (let i = 0; i < myArray.length; i++) {
  console.log("Item #" + i + ": " + myArray[i]);
}
```

Use `console.log()` inside the loop, not `show()`.

---

### Task 4: for...of Loop

for...of gives you each value directly. You do not get the index number.

```javascript
for (const item of myArray) {
  console.log(item);
}
```

Use `console.log()` inside the loop.

---

### Task 5: forEach

forEach is an array method. Pass it a function as the argument.
That function runs once for each item in the array.

```javascript
myArray.forEach(function(item) {
  console.log(item);
});
```

Use `console.log()` inside the callback.

---

### Task 6: map()

map() creates a brand new array. Whatever you return from the function
becomes the new item at that position. Do not forget the `return` keyword.

```javascript
const newArray = myArray.map(function(item) {
  return item + " suffix";
});
show("New Array", newArray);
```

Store the result in `officialNames`. Add `" National Park"` to each name.

---

### Task 7: filter()

filter() keeps only the items where your function returns `true`.

```javascript
const filtered = myArray.filter(function(item) {
  return item.length > 7;
});
show("Filtered", filtered);
```

Store the result in `longParkNames`. Use `.length` to check the string length.

---

### Task 8: find()

find() returns the first item where your function returns `true`.
It returns a single value, not an array.

```javascript
const found = myArray.find(function(item) {
  return item[0] === "G";
});
show("Found", found);
```

Store the result in `firstGPark`. What does it return if nothing matches?

---

## PART 2: OBJECTS

---

### Task 9: Empty Object with Dynamic Properties

Start with `{}` and then add properties using dot notation on separate lines.

```javascript
const myObject = {};
myObject.propertyName = "value";
myObject.anotherProperty = 42;
show("My Object", myObject);
```

Add five properties to `myPark`: name, state, established, entranceFee, isWilderness.

---

### Task 10: Object Literal Notation

Object literal notation defines everything inside the curly braces at once.
Each property is a key-value pair separated by a colon.
Pairs are separated by commas.

```javascript
const myObject = {
  propertyOne: "value",
  propertyTwo: 42,
  "property with space": true,
  nested: {
    innerProperty: "innerValue"
  }
};
show("My Object", myObject);
```

Your object needs: name, state, established, entranceFee, `"managed by"`,
and a nested `location` object with region and latitude.

---

### Task 11: Dot Notation Access

Object name, then a dot, then the property name. No quotes needed.

```javascript
show("Name", myObject.propertyOne);
```

---

### Task 12: Bracket Notation Access

Same result as dot notation, but the property name goes in quotes
inside square brackets.

```javascript
show("State", myObject["state"]);
```

Bonus - bracket notation also works with a variable as the key:
```javascript
const key = "name";
show("Via variable", myObject[key]); // same as myObject["name"]
```

---

### Task 13: Space-Key Property

If a property name has a space in it, dot notation causes a SyntaxError.
Bracket notation with a string is the only option.

```javascript
// This would cause a SyntaxError - do not uncomment it:
// console.log(myObject.managed by);

// This works:
show("Managed by", myObject["managed by"]);
```

---

### Task 14: Delete a Property

Use the `delete` keyword followed by the property you want to remove.

```javascript
show("Before", myObject.entranceFee);
delete myObject.entranceFee;
show("After (undefined)", myObject.entranceFee);
show("Full object", myObject);
```

---

### Task 15: Nested Object Access

To reach a value inside a nested object, chain the dot notation.
Each dot goes one level deeper.

```javascript
// Longhand - store the inner object first
const innerObject = myObject.location;
show("Inner object", innerObject);
const regionValue = innerObject.region;
show("Region", regionValue);

// Shorthand - same result, no intermediate variable
show("Chained", myObject.location.region);
```

---

### Task 16: Add a Method to an Object

Assign a function to a property on the object. That makes it a method.
Call it using the object name, dot, method name, and parentheses.

```javascript
myObject.doSomething = function() {
  return "a result string";
};

show("Result", myObject.doSomething());
```

Your method should return a sentence describing the park.

---

### Task 17: Use 'this' Inside a Method

Inside a method, `this` refers to the object the method belongs to.
Use `this.propertyName` instead of the object variable name directly.

```javascript
const myObject = {
  name: "example",
  greet: function() {
    return "Hello from " + this.name;
  }
};
show("Greeting", myObject.greet());
```

Use the `function` keyword - not an arrow function.
Arrow functions do not have their own `this`.

---

## PART 3: ARRAYS OF OBJECTS

---

### Task 18: Array of Objects

An array can hold objects as its items. Use the same property names
for every object so your loops and filters are predictable.

```javascript
const items = [
  { name: "One",   state: "Utah",      established: 1919 },
  { name: "Two",   state: "Wyoming",   established: 1872 }
];
showTable("Inventory", items);
```

Each park object needs: name, state, established, areaSqMiles, annualVisitors, entranceFee.
Use `showTable()` to display it.

---

### Task 19: Loop Through Array of Objects

When you loop through an array of objects, the loop variable is one
complete object on each pass. Access its properties with dot notation.

```javascript
items.forEach(function(item) {
  console.log(item.name + " (" + item.state + ")");
});
```

Format: `"Yellowstone (Wyoming) - Est. 1872"`

---

### Task 20: filter() on Array of Objects

filter() works the same way on arrays of objects as on arrays of strings.
The loop variable is the full object, so access the property with dot notation.

```javascript
const results = items.filter(function(item) {
  return item.entranceFee === 0;
});
showTable("Free Parks", results);
```

Create two filtered arrays: `freeParks` and `busyParks`.
Use `showTable()` for both.

---

### Task 21: map() on Array of Objects

map() transforms each park object into a simple string.
Access properties on the object to build your return value.

```javascript
const labels = items.map(function(item) {
  return item.name + " - " + item.state;
});
show("Labels", labels);
```

Return a string in the format: `"Yellowstone - Wyoming (1872)"`

---

## PART 4: OBJECT MANIPULATION

---

### Task 22: Object.assign()

`Object.assign()` copies properties from one object into another.
Pass an empty object `{}` as the first argument to create a brand new copy.

```javascript
const source = { name: "Yosemite", entranceFee: 35 };
const copy = Object.assign({}, source);
copy.entranceFee = 0;
show("Original", source);    // entranceFee still 35
show("Copy", copy);          // entranceFee is 0
```

---

### Task 23: Reference vs Value

**Primitives** (number, string, boolean) are copied by value.
Changing the copy does not affect the original.

```javascript
let originalFee = 35;
let saleFee = originalFee;
saleFee = 0;
show("Original fee", originalFee); // still 35
```

**Objects and arrays** are copied by reference.
Both variables point to the same object in memory.

```javascript
const parkA = { entranceFee: 35 };
const parkB = parkA;       // NOT a copy - same object
parkB.entranceFee = 0;
show("parkA fee", parkA.entranceFee); // also 0 - same object
```

For Part C: `===` checks if two variables point to the same object in memory,
not whether their contents are equal.

```javascript
const x = { name: "Arches" };
const y = { name: "Arches" };
show("x === y", x === y); // false - different objects in memory
```

---

### Task 24: const with Objects and Arrays

`const` prevents **reassignment** (pointing the variable at something else).
It does NOT prevent **mutation** (changing the contents of an object or array).

```javascript
const myObj = { name: "Yellowstone" };
myObj.name = "Yosemite";  // allowed - mutation
// myObj = { name: "Zion" }; // NOT allowed - reassignment, TypeError

const myArr = ["Yellowstone", "Yosemite"];
myArr.push("Zion");       // allowed - mutation
// myArr = ["Grand Canyon"]; // NOT allowed - reassignment, TypeError
```

For Part B, write the reassignment as a commented-out line and explain
the error in a comment next to it.
