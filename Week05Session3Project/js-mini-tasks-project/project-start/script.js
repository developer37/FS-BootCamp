// National Parks Data Lab - Starter File
// U.S. National Park Service Data Analysis Practice
//
// Work through each task in order.
// Your results appear on the page in the browser.
// Save this file and refresh the browser after each change.
//
// Three display functions are available (defined in display.js):
//
//   showSection("title")            - adds a labeled section header to the page
//   show("label", value)            - displays any value on the page
//   showTable("label", array)       - displays an array of objects as a table
//
// Loop tasks still use console.log() inside the loop body.
// Open DevTools (F12 / Cmd+Option+I) to see console output.

// ============================================================
// PART 1: ARRAYS
// ============================================================

showSection("Part 1: Arrays");

// ---- Task 1: Create an Array ----
// Create a const variable called parkNames.
// Assign it an array of at least 6 U.S. national park names as strings.
// Display the array using show().

// TODO: Create the parkNames array here
const parkNames = [
  "Yellowstone",
  "Yosemite",
  "Grand Canyon",
  "Zion",
  "Great Smoky Mountains",
  "Rocky Mountain",
  "Olympic",
  "Acadia",
];

show("Task 1: Parks Array", parkNames);

// ---- Task 2: Access Elements by Index ----
// Remember: the first element is at index 0.
// Display the first park, the last park, and any park in the middle.
// Hint: use parkNames.length - 1 to get the index of the last item.
// Use show() for each one.

// TODO: show the first park using bracket notation
show("Task 2: First Park", parkNames[0]);

// TODO: show the last park using parkNames.length - 1
show("Task 2: Last Park", parkNames[parkNames.length - 1]);
// TODO: show any park in the middle
show("Task 2: Middle Park", parkNames[parkNames.length / 2 - 1]);
// ---- Task 3: Loop with a Standard for Loop ----
// Write a for loop that goes through every item in parkNames.
// Inside the loop, use console.log() to log: "Park #0: Yellowstone", etc.
// Use the index variable to show the position number and the value.

showSection("Task 3: Standard for Loop (check console)");

// TODO: Write a for loop here
for (let index = 0; index < parkNames.length; index++) {
  const element = parkNames[index];
  console.log("Park #" + index + ": " + element);
}

// ---- Task 4: Loop with for...of ----
// Write a for...of loop that goes through every item in parkNames.
// Use console.log() inside the loop to log each park name.

showSection("Task 4: for...of Loop (check console)");

// TODO: Write a for...of loop here
let index = 0;
for (let parkName of parkNames) {
  console.log("Park #" + index + ": " + parkName);
  index++;
}

// ---- Task 5: Loop with forEach ----
// Call .forEach() on parkNames.
// Pass a function that receives each park name and logs it with console.log().

showSection("Task 5: forEach (check console)");

// TODO: Call parkNames.forEach() here
parkNames.forEach(function (parkName) {
  console.log(parkName);
});
// forEach also provides an optional second parameter for the index.
parkNames.forEach(function (parkName, index) {
  console.log(index + ": " + parkName);
});

// ---- Task 6: Use map() to Transform the Array ----
// Use .map() to create a new array called officialNames.
// Each item should be the park name with " National Park" added to the end.
// Example: "Yellowstone" becomes "Yellowstone National Park"
// Show both the original and the new array. The original should not change.

// TODO: Create officialNames using .map()
const officialNames = parkNames.map(function (parkName) {
  return parkName + " National Park";
});
//Using arrow 
const officialNames2 = parkNames.map((e) => e + " National Park");
// TODO: show("Task 6: Original parkNames (unchanged)", parkNames)
show("Task 6: Original parkNames (unchanged)", parkNames);
// TODO: show("Task 6: officialNames from map()", officialNames)
show("Task 6a: officialNames from map()", officialNames);
show("Task 6a: officialNames from map()", officialNames2);

// ---- Task 7: Use filter() to Narrow Down ----
// Use .filter() to create a new array called longParkNames.
// Include only park names that are longer than 7 characters.
// Show the new array.

// TODO: Create longParkNames using .filter()
const longParkNames = parkNames.filter((e) => e.length > 7);

// TODO: show("Task 7: Names longer than 7 characters", longParkNames)
show("Task 7: Names longer than 7 characters", longParkNames);
// ---- Task 8: Use find() to Locate One Item ----
// Use .find() on parkNames to get the first park name that starts with "G".
// Store the result in a variable called firstGPark.
// Show the result.
// Note: find() returns a single value, not an array.

// TODO: Use .find() here
const firstGPark = parkNames.find((e) => e[0] === "G");
// TODO: show("Task 8: First park starting with G", firstGPark)
show("Task 8a: First park starting with B", firstGPark);
//Using find() and charAt()
const firstGPark2 = parkNames.find((e) => e.charAt(0) === "G");
show("Task 8b: First park starting with B", firstGPark2);
// ============================================================
// PART 2: OBJECTS
// ============================================================

showSection("Part 2: Objects");

// ---- Task 9: Create an Empty Object and Add Properties ----
// Create a const variable called myPark assigned to an empty object {}.
// Then, on separate lines, add these properties one at a time:
//   name, state, established (a year), entranceFee (a number), isWilderness (true)
// Show myPark after adding all the properties.

// TODO: Create myPark as an empty object
const myPark = {};

// TODO: Add name, state, established, entranceFee, isWilderness properties
myPark.name = "Biscayne";
myPark.state = "Florida";
myPark.established = 1921;
myPark.entranceFee = 10;
myPark.isWilderness = false;

// TODO: show("Task 9: myPark (built property by property)", myPark)
show("Task 9: myPark (built property by property)", myPark);
// ---- Task 10: Create an Object with Literal Notation ----
// Create a const variable called otherPark using object literal notation.
// Define these properties inside the curly braces:
//   name, state, established, entranceFee
// Also add a property with a space in its name: "managed by" set to "National Park Service"
// Also add a nested object called location with properties: region and latitude
// Show otherPark after creating it.

// TODO: Create otherPark with object literal notation here
const otherPark = {
  name: "Rocky Mountain",
  state: "Colorado",
  established: 1821,
  entranceFee: 10,
  "managed by": "National Park Service",
  location: {
    region: "Southwest",
    latitude: 36.1,
  },
};

// TODO: show("Task 10: otherPark (object literal)", otherPark)
show("Task 10: otherPark (object literal)", otherPark);
// ---- Task 11: Dot Notation Access ----
// Show the name and the established year from otherPark using dot notation.

// TODO: show("Task 11: otherPark.name", otherPark.name)
show("Task 11a: otherPark.name", otherPark.name);
// TODO: show("Task 11: otherPark.established", otherPark.established)
show("Task 11b: otherPark.established", otherPark.established);
// ---- Task 12: Bracket Notation Access ----
// Show the state and the entranceFee from otherPark using bracket notation.
// Then create a variable called propertyToAccess set to the string "name"
// and use that variable inside bracket notation to access the property.

// TODO: show("Task 12: otherPark[\"state\"]", otherPark["state"])
show('Task 12a: otherPark["state"]', otherPark["state"]);
// TODO: show("Task 12: otherPark[\"entranceFee\"]", otherPark["entranceFee"])
show('Task 12b: otherPark["entranceFee"]', otherPark["entranceFee"]);
// TODO: Create propertyToAccess and use it inside bracket notation
const propertyToAccess = "name";
show(
  "Task 12c: Access using a variable as the key",
  otherPark[propertyToAccess],
);

// ---- Task 13: Access a Property with a Space in the Name ----
// Dot notation causes a SyntaxError for property names that contain a space.
// Use bracket notation to show the value of the "managed by" property.

// TODO: show("Task 13: otherPark[\"managed by\"]", otherPark["managed by"])
show('Task 13: otherPark["managed by"]', otherPark["managed by"]);
// ---- Task 14: Delete a Property ----
// Use the delete keyword to remove the entranceFee property from otherPark.
// Show the value of otherPark.entranceFee before and after deletion.
// Show the full otherPark object after deletion to confirm it is gone.

// TODO: show the value of entranceFee BEFORE delete
show("Task 14a: otherPark.entranceFee", otherPark.entranceFee);
// TODO: delete otherPark.entranceFee
delete otherPark.entranceFee;

// TODO: show the value of entranceFee AFTER delete (should be undefined)
show("Task 14b: Full list props in otherPark", otherPark);
// TODO: show the full otherPark object

// ---- Task 15: Access Nested Objects ----
// Access the region value inside otherPark.location.
// First do it the longhand way (using an intermediate variable),
// then do it the shorthand way (chained dot notation).
// Show both results.

// TODO: Longhand - store otherPark.location in a variable, then access region from it
const longHand = otherPark.location;

// TODO: show the region value from your intermediate variable
show("Task 15a: otherPark.location", longHand.region);
// TODO: show("Task 15 shorthand", otherPark.location.region)
show("Task 15b shorthand", otherPark.location.region);
// ---- Task 16: Add a Method to an Object ----
// Add a method called getDescription to myPark.
// The method should return a sentence like:
//   "Yellowstone was established in 1872 in Wyoming"
// Call the method and show the result.

// TODO: Add a getDescription method to myPark
// Hint: myPark.getDescription = function() { ... }
myPark.getDescription = function () {
  return (
    this.name + " was established in " + this.established + " in " + this.state
  );
};
// TODO: show("Task 16: myPark.getDescription()", myPark.getDescription())
show("Task 16: myPark.getDescription()", myPark.getDescription());
// ---- Task 17: Use 'this' Inside a Method ----
// Create a new const variable called featuredPark using object literal notation.
// Give it: name, state, established, annualVisitors, and two methods:
//   getLabel    - returns "[name] National Park ([state])"
//   getAge      - returns how many years since it was established (use 2026)
// Inside both methods, use the 'this' keyword.
// Show both method results.
//
// Important: use the 'function' keyword, not an arrow function.
// Arrow functions do not have their own 'this'.

// TODO: Create featuredPark with getLabel and getAge methods using 'this'
const featuredPark = {
  name: "Grand Canyon",
  state: "Arizona",
  established: 1830,
  annualVisitors: 200000,
  getLabel: function () {
    return this.name + " National Park " + this.state;
  },
  getAge: function () {
    return "years established " + (2026 - this.established);
  },
};
// TODO: show("Task 17: featuredPark.getLabel()", featuredPark.getLabel())
show("Task 17a: featuredPark.getLabel()", featuredPark.getLabel());
// TODO: show("Task 17: featuredPark.getAge()", featuredPark.getAge())
show("Task 17b: featuredPark..getAge()", featuredPark.getAge());
// ============================================================
// PART 3: ARRAYS OF OBJECTS
// ============================================================

showSection("Part 3: Arrays of Objects");

// ---- Task 18: Create an Array of Park Objects ----
// Create a const variable called parks.
// Assign it an array of at least 5 park objects.
// Each object should have: name, state, established, areaSqMiles, annualVisitors, entranceFee
// Display the array as a table using showTable().

// TODO: Create the parks array of park objects
const parks = [
  {
    name: "Yellowstone",
    state: "Wyoming",
    established: 1872,
    areaSqMiles: 3468,
    annualVisitors: 4900000,
    entranceFee: 35,
  },
  {
    name: "Yosemite",
    state: "California",
    established: 1890,
    areaSqMiles: 1169,
    annualVisitors: 3300000,
    entranceFee: 35,
  },
  {
    name: "Grand Canyon",
    state: "Arizona",
    established: 1919,
    areaSqMiles: 1904,
    annualVisitors: 4700000,
    entranceFee: 35,
  },
  {
    name: "Zion",
    state: "Utah",
    established: 1919,
    areaSqMiles: 229,
    annualVisitors: 4700000,
    entranceFee: 35,
  },
  {
    name: "Great Smoky Mountains",
    state: "Tennessee",
    established: 1934,
    areaSqMiles: 816,
    annualVisitors: 12100000,
    entranceFee: 0,
  },
  {
    name: "Rocky Mountain",
    state: "Colorado",
    established: 1915,
    areaSqMiles: 415,
    annualVisitors: 4400000,
    entranceFee: 35,
  },
  {
    name: "Olympic",
    state: "Washington",
    established: 1938,
    areaSqMiles: 1442,
    annualVisitors: 2700000,
    entranceFee: 35,
  },
  {
    name: "Acadia",
    state: "Maine",
    established: 1919,
    areaSqMiles: 76,
    annualVisitors: 3900000,
    entranceFee: 35,
  },
];
// TODO: showTable("Task 18: Parks Inventory", parks)
showTable("Task 18: Parks Inventory", parks);
// ---- Task 19: Loop Through the Array of Objects ----
// Use .forEach() to loop through parks.
// For each park, use console.log() to log a sentence like:
//   "Yellowstone (Wyoming) - Est. 1872"

showSection("Task 19: Loop through Parks (check console)");

// TODO: Loop through parks with .forEach() and console.log each one
parks.forEach((park) =>
  console.log(park.name + " (" + park.state + ") - Est. " + park.established),
);
// ---- Task 20: Filter the Parks Array ----
// Use .filter() twice:
//   1. Create freeParks - parks where entranceFee === 0
//   2. Create busyParks - parks where annualVisitors > 4000000
// Show both results as tables using showTable().

// TODO: Create freeParks using .filter()
const freeParks = parks.filter((e) => e.entranceFee === 0);
// TODO: showTable("Task 20: Free parks", freeParks)
showTable("Task 20a: Free parks", freeParks);
// TODO: Create busyParks using .filter()
const busyParks = parks.filter((e) => e.annualVisitors > 4000000);
// TODO: showTable("Task 20: Busy parks (4M+ visitors)", busyParks)
showTable("Task 20b: Busy parks (4M+ visitors)", busyParks);

// ---- Task 21: Map the Parks Array to Labels ----
// Use .map() to create a new array called parkLabels.
// Each item should be a string in the format:
//   "Yellowstone - Wyoming (1872)"
// Show the result using show().

// TODO: Create parkLabels using .map()
parkLabels = parks.map(
  (park) => park.name + " (" + park.state + ") - Est. " + park.established,
);
// TODO: show("Task 21: Park labels from map()", parkLabels)
show("Task 21: Park labels from map()", parkLabels);

// ============================================================
// PART 4: OBJECT MANIPULATION
// ============================================================

showSection("Part 4: Object Manipulation");

// ---- Task 22: Copy an Object with Object.assign() ----
// Create a const variable called basePark with at least 4 properties.
// Use Object.assign() to create a copy called updatedPark.
//   Syntax: Object.assign({}, sourceObject)
// Change one property on updatedPark.
// Show both objects to confirm the original was not affected.

// TODO: Create basePark
const basePark = {
  name: "Acadia",
  state: "Maine",
  established: 1919,
  areaSqMiles: 76,
};

// TODO: Copy it into updatedPark using Object.assign({}, basePark)
const updatedPark = Object.assign({}, basePark);
// TODO: Change one property on updatedPark
updatedPark.areaSqMiles = 70;
// TODO: show("Task 22: Original basePark (unchanged)", basePark)
show("Task 22a: Original basePark (unchanged)", basePark);
// TODO: show("Task 22: updatedPark with changed property", updatedPark)
show("Task 22b: updatedPark with changed property", updatedPark);
// ---- Task 23: Reference vs Value ----
// Part A: Primitive copy by value
//   Create a let variable called originalFee set to 35.
let originalFee = 35;
//   Assign it to a new let variable called saleFee.
let saleFee = originalFee;
saleFee = 0;
//   Change saleFee to 0.
//   Show both - originalFee should still be 35.

//
// Part B: Object copy by reference
//   Create a const called parkA with name and entranceFee properties.
const parkA = { name: basePark.name, entranceFee: basePark.entranceFee };
//   Assign parkA to a new const called parkB (plain = assignment, no Object.assign).
const parkB = parkA;
//   Change entranceFee on parkB.
parkB.entranceFee = 0;
//   Show both - what do you notice about parkA?
//
// Part C: Object equality
//   Create park1 and park2 with identical properties but as separate objects.
park1 = {
  name: "Acadia",
  state: "Maine",
  established: 1919,
  areaSqMiles: 76,
};
park2 = {
  name: "Acadia",
  state: "Maine",
  established: 1919,
  areaSqMiles: 76,
};

//   Show park1 === park2 - what does it return and why?

// TODO: Part A - primitive copy demo
show("Task 23a: originalFee ", originalFee);
show("Task 23a: saleFee ", saleFee);
// TODO: Part B - object reference demo
show("Task 23b: parkA ", parkA);
show("Task 23b: parkB ", parkB);
// TODO: Part C - object equality demo
show("Task 23c: park1 === park2 ", park1 === park2);
show("Task 23c: park1 === park2 ", parkA === parkB);
// ---- Task 24: const with Objects and Arrays ----
// Part A: Create a const object called myFavoritePark with a name property.
//   Change the name property to something different.
//   Show that the change worked.
const myFavoritePark = { name: "Acadia" };
myFavoritePark.name = "Grand Teton"; // This works - mutation of a property

//
// Part B: Write the line that would try to reassign myFavoritePark to a new object.
//   Comment it out so the file still runs.
//   Add a comment explaining what error it would throw.
const newObject = myFavoritePark;
//
// Part C: Create a const array called parkList with two park names.
//   Push a third park name onto it using .push().
//   Show that the new item is there.
const parkList = ["Rocky Mountain", "Biscayne"];
parkList.push("Acadia");
// TODO: Part A - mutating a const object

// TODO: show("Task 24 Part A: myFavoritePark after property change", myFavoritePark)
show("Task 24 Part A: myFavoritePark after mutating .name", myFavoritePark);

// TODO: Part B - commented-out reassignment with error explanation
show("Task 24 Part B: newObject  after mutating .name", newObject);

// TODO: Part C - mutating a const array

// TODO: show("Task 24 Part C: parkList after .push()", parkList)
show("Task 24 Part C: parkList after .push()", parkList);
// ============================================================
// BONUS: Additional Concepts
// ============================================================

showSection("Bonus: Additional Concepts");

// ---- Bonus A: Object.keys(), Object.values(), Object.entries() ----

const samplePark = {
  name: "Acadia",
  state: "Maine",
  established: 1919,
  entranceFee: 35,
};

// Object.keys() returns an array of all property names.
const propertyNames = Object.keys(samplePark);
show("Bonus A: Object.keys()", propertyNames);

// Object.values() returns an array of all property values.
const propertyValues = Object.values(samplePark);
show("Bonus A: Object.values()", propertyValues);

// Object.entries() returns an array of [key, value] pairs.
const propertyPairs = Object.entries(samplePark);
show("Bonus A: Object.entries()", propertyPairs);

// Accessing a specific entry by index - entries returns an array of arrays.
show("Bonus A: entries[0] (first key-value pair)", propertyPairs[0]);
show("Bonus A: entries[0][0] (first key)", propertyPairs[0][0]);
show("Bonus A: entries[0][1] (first value)", propertyPairs[0][1]);

// Object.entries() is useful for looping through all properties.
console.log("--- Bonus A: Looping with Object.entries() ---");
Object.entries(samplePark).forEach(function (entry) {
  const key = entry[0];
  const value = entry[1];
  console.log(key + ": " + value);
});

// ---- Bonus B: Chaining Array Methods ----

// Each array method returns a new array, so you can immediately call
// another method on the result.

// Longhand - store each step.
const historicParks = parks.filter(function (park) {
  return park.established < 1920;
});
const historicParkLabels = historicParks.map(function (park) {
  return park.name + " (" + park.established + ")";
});
show("Bonus B: Historic parks - longhand", historicParkLabels);

// Shorthand - chained. Same result.
const chainedResult = parks
  .filter(function (park) {
    return park.established < 1920;
  })
  .map(function (park) {
    return park.name + " (" + park.established + ")";
  });
show("Bonus B: Historic parks - chained (same result)", chainedResult);

// ---- Bonus C: Spread Operator to Copy ----

const originalPark = {
  name: "Zion",
  state: "Utah",
  established: 1919,
  entranceFee: 35,
};

// The spread operator copies all properties into a new object.
const discountedPark = { ...originalPark, entranceFee: 0 };

show("Bonus C: Original park (unchanged)", originalPark);
show("Bonus C: Discounted copy", discountedPark);
