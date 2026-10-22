# Branching Story Lab - Assessment Rubric

## Project Overview

Students build a playable branching story game that runs in the Node.js terminal. The student writes the entire story and implements four game engine functions. The console interface is provided as pre-written infrastructure. Run with `node script.js`.

---

## Must Have (Required for Passing):

### Story Design

- [ ] **Original story** - Student has written their own world, characters, and scene text
- [ ] **Minimum 8 scenes** - `storyNodes` contains at least 8 scenes total (including endings)
- [ ] **At least 2 distinct endings** - At least 2 scenes have `isEnding: true`, each with a unique `endingTitle` and different outcome
- [ ] **Real branching** - Player choices lead to meaningfully different paths, not just different text on the same route

### Story Data Structure

- [ ] **Scene object shape** - Each scene has `id`, `text`, `choices`, and `isEnding`
- [ ] **Choice object shape** - Each choice has `text` and `nextId`
- [ ] **Ending scene shape** - Ending scenes have `isEnding: true`, `choices: []`, and `endingTitle`
- [ ] **ID consistency** - Every `id` matches its key in `storyNodes`; every `nextId` points to a real scene

### Game State

- [ ] **currentSceneId** - Declared with `let`, starts at `"start"`, updated by `makeChoice`
- [ ] **visitedScenes** - Declared with `const`, starts as `[]`, updated by `makeChoice` and cleared by `restartGame`

### Game Engine Functions

- [ ] **getCurrentScene(sceneId)** - Returns `storyNodes[sceneId]`
- [ ] **displayScene(sceneId)** - Logs scene text; logs numbered choices for non-endings; logs `endingTitle` for endings; does not call input functions
- [ ] **makeChoice(sceneId, choiceNumber)** - Accesses `scene.choices[choiceNumber - 1]`, pushes `sceneId` to `visitedScenes`, returns `selectedChoice.nextId`
- [ ] **restartGame()** - Sets `currentSceneId` to `"start"`, clears `visitedScenes`; does not call `displayScene`

### Correctness

- [ ] **All paths reach an ending** - Every branch in the story eventually reaches a scene with `isEnding: true`
- [ ] **No crashes** - Playing through any path does not throw a runtime error

### Code Quality

- [ ] **const and let only** - No use of `var`
- [ ] **Descriptive variable names** - No single-letter names except loop indexes

---

## Could Have (Bonus Points):

### Story Depth

- [ ] **More than 2 endings** - Three or more distinct endings with meaningfully different outcomes
- [ ] **More than 8 scenes** - Richer branching with more paths

### Display Polish

- [ ] **Scenes visited counter** - `displayScene` includes a count of how many scenes the player has visited so far
- [ ] **Inventory display** - `displayScene` shows the current inventory (or "nothing" if empty)
- [ ] **Stat display** - `displayScene` shows the current stat value alongside the scene text

### Inventory System

- [ ] **Inventory array** - An `inventory` array is added to game state and displayed each turn by `displayScene`
- [ ] **Picking up items** - Some choices include a `givesItem` property (e.g., `givesItem: "flashlight"`). `makeChoice` checks for this property and pushes the item into the `inventory` array
- [ ] **Item-gated choices** - Some choices include a `requires` property (e.g., `requires: "key"`). `displayScene` only shows a choice if the required item is already in `inventory` (use `Array.filter` or an `if` check inside the loop)
- [ ] **At least 2 items** in the story that can be picked up
- [ ] **At least 1 gated choice** that only appears when the player has the right item
- [ ] **Inventory resets on restart** - `restartGame` clears the inventory array

### Actions and Stat Tracking

- [ ] **Player stat** - A numeric variable tracks something that fits the story (e.g., `energy`, `trust`, `suspicion`, `morale`). Displayed each turn by `displayScene`
- [ ] **Stat changes on choices** - Some choices include a stat change property (e.g., `energyChange: -15`). `makeChoice` reads this and adjusts the stat, clamping it between 0 and 100 with `Math.max(0, Math.min(100, value))`
- [ ] **At least 3 choices** that change the stat
- [ ] **Stat resets on restart** - `restartGame` sets the stat back to its starting value

---

## Submission Requirements

**Due Date:** May 2
**Submission Method:** GitHub repo link posted in the #projects-showcase channel
