# Branching Story Lab - Development Plan

## Project Overview

You are building a branching story game that runs in the terminal. You write the story and four functions. The console interface is already written for you at the bottom of script.js - you do not need to touch it.

Run the game at any point by:

1. Opening the terminal where your files are located at (check with ls to see script.js in the results)
2. Put this into the terminal

```bash
node script.js
```

3. Hit Enter
4. Your game will run

---

## Part 1: Design Your Story

Do this before writing any code. A story planned in advance is far easier to code than one invented as you go.

### Pick Your World

You can write anything:

- A museum guard on the night shift when an alarm goes off
- A chef who discovers a missing ingredient right before service
- An astronaut dealing with a small malfunction on a space walk
- A journalist who receives a tip about a corrupt official
- A first day at a new job where things quickly go sideways
- A time traveler who lands in the wrong decade
- A passenger who realizes they are on the wrong flight

Pick a setting and a central problem. The player's choices should matter - different paths should lead to genuinely different outcomes.

### Map It on Paper First

Draw your scenes and arrows before touching the keyboard:

- A start scene with at least 2 choices
- At least 8 scenes total (including endings)
- At least 2 distinct endings (`isEnding: true`)
- No dead ends - every non-ending scene must have at least one choice that leads somewhere

A simple map:

```
[start]
   |--- choice A ---> [scene-2a] ---> [scene-3a] ---> [ending: good]
   |--- choice B ---> [scene-2b]
                          |--- choice ---> [scene-3b] ---> [ending: bad]
                          |--- choice ---> [scene-3c] ---> [ending: neutral]
```

---

## Part 2: Write the Story Data

Each scene is an object stored inside `storyNodes`.

### A Regular Scene

```javascript
const storyNodes = {
  start: {
    id: "start",
    text: "Your opening scene goes here. Set the world, the problem, the stakes.",
    choices: [
      { text: "Your first choice", nextId: "scene-two-a" },
      { text: "Your second choice", nextId: "scene-two-b" },
    ],
    isEnding: false,
  },
};
```

### An Ending Scene

```javascript
"ending-good": {
  id: "ending-good",
  text: "The full closing paragraph of what happened.",
  choices: [],
  isEnding: true,
  endingTitle: "A Short Title for This Ending"
}
```

### Rules

- Every scene `id` must exactly match its key in `storyNodes`
- Every `nextId` in a choice must match a real scene id - a typo here will crash the game
- Use kebab-case for all ids: `"dark-corridor"` not `"darkCorridor"`
- Ending scenes must have `choices: []` - an empty array, not a missing property

---

## Part 3: The Four Functions

You implement these four functions. None of them deal with user input - that is handled for you. Each function does exactly one thing.

### getCurrentScene(sceneId)

Returns the scene object for a given id:

```javascript
function getCurrentScene(sceneId) {
  return storyNodes[sceneId];
}
```

Use this in your other functions instead of writing `storyNodes[sceneId]` directly.

### displayScene(sceneId)

Logs the current scene to the console. This function only logs - it does not ask for input or call any other functions.

What to log:

1. A divider line (optional, but helps readability)
2. The scene text
3. If `scene.isEnding` is true: log the `endingTitle`
4. If `scene.isEnding` is false: log each choice as a numbered list (starting at 1)

Example output for a non-ending scene:

```
You wake up in the museum after-hours. The alarm is ringing.

1. Head toward the alarm panel
2. Call your supervisor
```

Example output for an ending:

```
You made it out. The guard found you at dawn.

-- Found at Dawn --
```

The game loop will add the "Quit" option and prompt for input after your function runs. You do not need to handle that here.

### makeChoice(sceneId, choiceNumber)

Handles the player selecting a numbered choice.

What to do:

1. Get the scene using `getCurrentScene(sceneId)`
2. Get the selected choice: `scene.choices[choiceNumber - 1]`
   - `choiceNumber` is 1-based (player sees 1, 2, 3...)
   - Arrays are 0-based (index 0, 1, 2...)
   - So subtract 1: `choices[choiceNumber - 1]`
3. Push `sceneId` into `visitedScenes`
4. Return `selectedChoice.nextId`

The game loop will use the returned id to update `currentSceneId` and call `runGame()` again. You do not need to call `displayScene` here.

### restartGame()

Resets all state back to the beginning.

What to do:

1. Set `currentSceneId` back to `"start"`
2. Clear `visitedScenes`: `visitedScenes.length = 0`

The game loop will call `runGame()` after this function runs. You do not need to call `displayScene` here.

---

## Part 4: How the Pre-Written Game Loop Works

The game loop at the bottom of the file calls your functions in the right order. You do not need to modify it, but understanding it helps:

```
runGame()
  calls displayScene(currentSceneId)      <- your function
  if ending: calls askAfterEnding()
  if not ending: shows "Quit" option, calls askForInput()

askForInput()
  reads a number from the player
  validates it
  if Quit: exits
  if valid: calls makeChoice(currentSceneId, number)  <- your function
            updates currentSceneId with the returned id
            calls runGame() again

askAfterEnding()
  shows "Play Again" and "Quit"
  if Play Again: calls restartGame()      <- your function
                 calls runGame() again
  if Quit: exits
```

Your functions are pure: they read data, update the two state variables, and log to the console. The game loop handles everything else.

---

## Development Strategy

### Phase 1: Write the Story (1-2 hours)

1. Pick your genre and sketch your map on paper
2. Write all scenes in `storyNodes` with real text
3. Check that every `nextId` matches a real scene key

### Phase 2: Test the Story Data (5-10 minutes)

Before implementing any functions, add a temporary line to verify your data loads:

```javascript
console.log(Object.keys(storyNodes));
```

Run `node script.js`. If it crashes before showing anything, you have a syntax error in `storyNodes`. Fix it before continuing. Remove the test line when done.

### Phase 3: Implement the Functions (30-45 minutes)

Build and test one function at a time:

1. Implement `getCurrentScene`. Test it by temporarily adding:

   ```javascript
   console.log(getCurrentScene("start"));
   ```

   Run `node script.js` - you should see your start scene object logged.

2. Implement `displayScene`. The game will now show scene text when you run it, but crash when it tries to read your choice (because `makeChoice` is not done yet). That is fine.

3. Implement `makeChoice`. Now you can make choices and the story should advance.

4. Implement `restartGame`. Test by playing to an ending and choosing "Play Again."

### Phase 4: Test Every Path (15-30 minutes)

Play through every branch in your story map. Every path should reach an ending. No path should crash or lead to a missing scene.

---

## Common Pitfalls

- **Scene id typos crash the game** - If a `nextId` does not match any key in `storyNodes`, `getCurrentScene` returns `undefined` and the next line crashes. Compare ids carefully.
- **choices: [] is required on endings** - If the `choices` property is missing, the game loop crashes when it reads `scene.choices.length`.
- **1-based vs 0-based** - The player picks number 1, but `choices[0]` is the first item. Always use `choiceNumber - 1`.
- **Do not call displayScene from makeChoice or restartGame** - The game loop handles calling `runGame()` (which calls `displayScene`) at the right time. If your functions also call it, scenes will display twice.
