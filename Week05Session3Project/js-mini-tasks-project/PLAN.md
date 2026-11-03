# National Parks Data Lab - Development Plan

## Project Overview

You are a junior data analyst for the National Park Service. Your job is to
organize and analyze park data using JavaScript arrays and objects.

Open `script.js` and work through each task in order. Your results appear
automatically on the page in the browser. Save and refresh to see updates.

If you get stuck on a task, check `project-hints/hints.md` first.
If the hint is not enough, look at `completed-version/script.js`.

---

## The Three Files You Need to Know

| File | What it is | Do you edit it? |
|---|---|---|
| `script.js` | Your work file | Yes - this is the only file you edit |
| `display.js` | Pre-built display functions | No - do not touch this |
| `index.html` | The page that loads everything | No - do not touch this |

---

## Display Functions (provided in display.js)

Three functions are available for you to call from `script.js`:

- `showSection("title")` - adds a section header to the page
- `show("label", value)` - displays any value (string, number, array, object)
- `showTable("label", arrayOfObjects)` - displays an array of objects as a table

Use `console.log()` inside loop bodies (for, for...of, forEach).

---

## What You Are Building

### Part 1: Arrays
Work with a list of park names. Practice creating arrays, accessing items by
index, looping three different ways, and using map(), filter(), and find().

### Part 2: Objects
Model a national park as a JavaScript object. Practice creating objects,
reading and modifying properties, working with nested objects, and adding
methods that use the `this` keyword.

### Part 3: Arrays of Objects
Build a full park inventory where each item in the array is a complete park
object. Practice filtering and mapping across the entire dataset.

### Part 4: Object Manipulation
Explore how copying, references, and `const` behave differently for objects
and arrays than they do for plain numbers and strings.

---

## Where to Start

1. Open `script.js`
2. Read the comment above Task 1
3. Write your code below it
4. Call `show()` to display your result
5. Save and refresh the browser
6. Move to Task 2

Work one task at a time. Do not skip ahead.

---

## When You Get Stuck - Use These in Order

Getting stuck is a normal and important part of learning to code. The frustration
you feel right before something clicks is where the real learning happens. Do not
skip straight to the answer - the struggle is the point.

**Step 1: Re-read the task comment in script.js**
Make sure you understand what is being asked before writing anything.

**Step 2: Look it up yourself first**
Try to find the answer before asking for help. This is the most important skill
you can build as a developer.

Good places to look:
- MDN Web Docs (developer.mozilla.org) - the most complete JavaScript reference.
  Search for the method name, e.g. "MDN Array filter" or "MDN Object assign".
- Codecademy lessons - go back to the relevant lesson from this week.
- Your own notes from class.

**Step 3: Check project-hints/hints.md**
The hints file gives you the syntax pattern for each task without giving away
the full answer. It shows you the shape of the code so you can fill in the
specific details yourself.

**Step 4: Check completed-version/script.js**
Only open the completed version after you have genuinely tried the task and
checked the hints. When you do look at it, do not copy and paste. Read it,
understand why it works, close it, and write your own version from memory.
That is how you actually learn it.

---

## Debugging Tips

- **Page shows nothing** - Check the file is saved and the browser is refreshed.
  Look for a red error message in the DevTools console (F12 / Cmd+Option+I).
- **"show is not defined"** - `display.js` is not loading. Check that both
  script tags are in `index.html` and that `display.js` comes first.
- **undefined instead of a value** - The property name is probably misspelled.
  JavaScript is case-sensitive.
- **Method returns undefined** - You are missing a `return` statement inside
  the function body.
- **TypeError on a chain** - The first part of the chain is returning undefined.
  Log the outer object first to see what is actually there.

---

## Common Pitfalls

**Arrow functions do not have their own 'this'**
Use the `function` keyword for any object method that references `this`.
Arrow functions inherit `this` from the outer scope, which is not the object.

**Forgetting 'this' inside a method**
Inside a method, you cannot access the object's properties by their name alone.
`balance` inside a method is not the same as `this.balance`. Always use `this`.

**map() and filter() must have a return statement**
If you forget `return` inside the callback, the method returns an array of
`undefined` values instead of your transformed values.

**Object assignment copies the reference, not the value**
When you write `const parkB = parkA`, both variables point to the same object.
Changing `parkB.name` also changes `parkA.name`. Use `Object.assign({}, parkA)`
to get a real independent copy.

**const does not mean the object is frozen**
`const` only prevents reassigning the variable itself. You can still change
properties on a `const` object and push items onto a `const` array.

**Index starts at 0**
The first item in an array is always at index 0. Trying to access an index
that does not exist returns `undefined` silently - no error until you try to
use that `undefined` value somewhere.
