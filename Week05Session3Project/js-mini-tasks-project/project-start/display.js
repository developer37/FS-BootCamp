// display.js
// Pre-built display functions for the National Parks Data Lab.
// ============================================================
// You do not need to read, edit, or understand this file.
//
// Use these three functions from your script.js:
//
//   showSection("Part 1: Arrays")        - adds a labeled divider to the page
//   show("label", value)                  - displays any value on the page
//   showTable("label", arrayOfObjects)    - displays an array of objects as a table
//
// All functions also send output to the browser console.
// Save script.js and refresh the browser to see updated output.
// ============================================================

function showSection(title) {
  console.log("\n=== " + title + " ===");

  const output = document.getElementById("output");
  const header = document.createElement("h2");
  header.className = "section-header";
  header.textContent = title;
  output.appendChild(header);
}

function show(label, value) {
  console.log(label + ":", value);

  const output = document.getElementById("output");
  const card = document.createElement("div");
  card.className = "result-card";

  const labelElement = document.createElement("div");
  labelElement.className = "result-label";
  labelElement.textContent = label;

  const valueElement = document.createElement("pre");
  valueElement.className = "result-value";

  if (value === undefined) {
    valueElement.textContent = "undefined";
    valueElement.classList.add("result-undefined");
  } else if (value === null) {
    valueElement.textContent = "null";
  } else if (typeof value === "object") {
    valueElement.textContent = JSON.stringify(value, null, 2);
  } else {
    valueElement.textContent = String(value);
  }

  card.appendChild(labelElement);
  card.appendChild(valueElement);
  output.appendChild(card);
}

function showTable(label, arrayOfObjects) {
  console.log(label + ":", arrayOfObjects);

  const output = document.getElementById("output");
  const card = document.createElement("div");
  card.className = "result-card result-card-table";

  const labelElement = document.createElement("div");
  labelElement.className = "result-label";
  labelElement.textContent = label;
  card.appendChild(labelElement);

  if (!Array.isArray(arrayOfObjects) || arrayOfObjects.length === 0) {
    const empty = document.createElement("p");
    empty.className = "result-empty";
    empty.textContent = "(empty array)";
    card.appendChild(empty);
    output.appendChild(card);
    return;
  }

  const keys = Object.keys(arrayOfObjects[0]);
  const table = document.createElement("table");
  table.className = "result-table";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  keys.forEach(function(key) {
    const th = document.createElement("th");
    th.textContent = key;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  arrayOfObjects.forEach(function(item) {
    const row = document.createElement("tr");
    keys.forEach(function(key) {
      const td = document.createElement("td");
      const cellValue = item[key];
      td.textContent = (cellValue === undefined) ? "" : String(cellValue);
      row.appendChild(td);
    });
    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  card.appendChild(table);
  output.appendChild(card);
}
