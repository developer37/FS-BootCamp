// Branching Story Lab - Complete Version
// Run with: node script.js
//
// This is the reference implementation.
// Story: "A passenger who realizes they are on the wrong flight" .

// -------------------------------------------------------
// STORY DATA
// -------------------------------------------------------
const storyNodes = {
  start: {
    id: "start",
    text: "The cabin door is still open when the realization hits you: you boarded a flight by mistake. The boarding pass in your pocket points to a different city than the destination you intended, and the plane is already moving away from the gate. You need to figure out the best way to get to your real destination.",
    choices: [
      {
        text: "Check the boarding pass and booking email",
        nextId: "check-board-pass",
      },
      {
        text: "Ask the passenger beside you where this flight is going",
        nextId: "ask-seatmate",
      },
      {
        text: "Alert a flight attendant before the doors close",
        nextId: "tell-attendant",
      },
    ],
    isEnding: false,
  },

  "check-board-pass": {
    id: "check-board-pass",
    text: "The details are right there in black and white. Your boarding pass, booking email, and gate information all point to a flight that is not going where you intended. Somewhere between the announcement, the rush to board, and your own certainty, you got mixed up. The seatmate across the aisle notices you staring at the screen and offers a quick shrug.",
    choices: [
      {
        text: "Ask the flight attendant to confirm the destination",
        nextId: "tell-attendant",
      },
      {
        text: "Use your phone to see whether you can still change flights",
        nextId: "use-phone",
      },
      {
        text: "Stay calm and wait for the safest moment to speak up",
        nextId: "wait-and-think",
      },
    ],
    isEnding: false,
  },

  "ask-seatmate": {
    id: "ask-seatmate",
    text: "You lean over and ask the passenger next to you where the plane is going. They glance at their own pass, then at yours, and confirm that this is not the route you meant to take. That is not the answer you wanted, but it is honest. You are on the wrong flight.",
    choices: [
      { text: "Tell a flight attendant right away", nextId: "tell-attendant" },
      {
        text: "Check your phone and see if the airline app can help",
        nextId: "use-phone",
      },
      {
        text: "Accept the mistake and figure out the next step after landing",
        nextId: "accept-flight-destination",
      },
    ],
    isEnding: false,
  },

  "tell-attendant": {
    id: "tell-attendant",
    text: "You catch the attention of a flight attendant just before the aisle clears. After a quick look at your pass, they confirm it: you boarded the wrong flight. The doors are still open, so there is still a chance to fix this without turning the trip into a bigger disaster.",
    choices: [
      {
        text: "Ask to deplane immediately and return to the right gate",
        nextId: "deplane-now",
      },
      {
        text: "Ask whether there is any same-day route from flight-destination back to intended destination",
        nextId: "reroute-from-flight-destination",
      },
      {
        text: "If the plane is already boarding, stay on and solve it later",
        nextId: "accept-flight-destination",
      },
    ],
    isEnding: false,
  },

  "use-phone": {
    id: "use-phone",
    text: "Your phone still has a weak signal near the window. The airline app confirms the mismatch between your intended destination and the flight you are on. There is a customer-service chat option, a rebooking link, and a tiny countdown before departure. You have just enough time to act, but not enough to overthink.",
    choices: [
      {
        text: "Message the airline and ask for the fastest correction",
        nextId: "reroute-from-flight-destination",
      },
      {
        text: "Compare your pass with nearby passengers and confirm the mistake",
        nextId: "ask-seatmate",
      },
      {
        text: "Go straight to the attendant and admit the mix-up",
        nextId: "deplane-now",
      },
    ],
    isEnding: false,
  },

  "wait-and-think": {
    id: "wait-and-think",
    text: "You take one breath, then another. Panicking will not move the airplane. You review the options in your head: get off now, reroute later, or keep going and deal with the consequences after landing. The plane is still at the gate, and the choice is still yours.",
    choices: [
      { text: "Get off before the doors close", nextId: "deplane-now" },
      {
        text: "Ask the crew about a same-day reroute",
        nextId: "reroute-from-flight-destination",
      },
      {
        text: "Stay on board and accept the mistake",
        nextId: "accept-flight-destination",
      },
    ],
    isEnding: false,
  },

  "deplane-now": {
    id: "deplane-now",
    text: "You speak up immediately. The attendant walks you back to the jet bridge and points you toward the correct gate with a speed that suggests they have seen this before. It is embarrassing, but it is also fixable. You have caught the mistake before the plane left the ground.",
    choices: [
      {
        text: "Head back to the right gate and catch the correct flight",
        nextId: "ending-caught-in-time",
      },
    ],
    isEnding: false,
  },

  "reroute-from-flight-destination": {
    id: "reroute-from-flight-destination",
    text: "The airline agent on the app works faster than you expected. There is a later flight, a connection possibility, and a customer-service path back to your intended destination if you move quickly once you land. The situation is worse than it was a minute ago, yet still under control.",
    choices: [
      {
        text: "Keep the trip and build a new plan from flight-destination",
        nextId: "ending-rebooked",
      },
      {
        text: "Get off now and try to recover the original itinerary",
        nextId: "deplane-now",
      },
    ],
    isEnding: false,
  },

  "accept-flight-destination": {
    id: "accept-flight-destination",
    text: "You decide not to fight the moment. If you are going somewhere else, then that stop will have to become part of the plan. You turn the mistake into a practical problem: how to land, regroup, and get back to your intended destination without making the same error twice.",
    choices: [
      {
        text: "Rebook a return connection as soon as you land",
        nextId: "ending-rebooked",
      },
      {
        text: "Treat the detour as an unplanned trip and continue on",
        nextId: "ending-flight-destination-detour",
      },
    ],
    isEnding: false,
  },

  "ending-caught-in-time": {
    id: "ending-caught-in-time",
    text: "You make it back to the correct gate just in time for boarding. The second flight leaves without you ever having to explain the mix-up to your final destination. The whole mistake becomes a story you can tell later instead of a problem you have to solve all night.",
    choices: [],
    isEnding: true,
    endingTitle: "Caught in Time",
  },

  "ending-rebooked": {
    id: "ending-rebooked",
    text: "The airline gets you on a new route with minimal delay. It is not the smooth trip you expected, but it is a real solution: no lost luggage, no missed connection, and no pretending the wrong flight was the plan all along. You arrive tired, annoyed, and safely rerouted.",
    choices: [],
    isEnding: true,
    endingTitle: "Rebooked and On Track",
  },

  "ending-flight-destination-detour": {
    id: "ending-flight-destination-detour",
    text: "You land with an accidental layover, a sharpened sense of direction, and a much better memory of checking tickets before boarding. It is not the route you planned, but you make the most of it and eventually get where you meant to go.",
    choices: [],
    isEnding: true,
    endingTitle: "Unexpected Flight Destination Detour",
  },
};

// -------------------------------------------------------
// GAME STATE
// -------------------------------------------------------

let currentSceneId = "start";
const visitedScenes = [];

// -------------------------------------------------------
// STUDENT FUNCTIONS
// -------------------------------------------------------

// getCurrentScene(sceneId)
// Returns the scene object for the given id.
function getCurrentScene(sceneId) {
  return storyNodes[sceneId];
}

// displayScene(sceneId)
// Logs the scene text and numbered choices to the console.
// For endings, logs the endingTitle instead of choices.
function displayScene(sceneId) {
  const scene = getCurrentScene(sceneId);

  console.log("\n" + "-".repeat(50));
  console.log("Scenes visited: " + visitedScenes.length);
  console.log("-".repeat(50));

  console.log("\n" + scene.text + "\n");

  if (scene.isEnding) {
    console.log("-- " + scene.endingTitle + " --");
  } else {
    scene.choices.forEach(function (choice, index) {
      console.log(index + 1 + ". " + choice.text);
    });
  }
}

// makeChoice(sceneId, choiceNumber)
// Handles a player selecting one of the numbered choices.
// Returns the nextId of the chosen scene.
function makeChoice(sceneId, choiceNumber) {
  const scene = getCurrentScene(sceneId);
  const selectedChoice = scene.choices[choiceNumber - 1];
  visitedScenes.push(sceneId);
  return selectedChoice.nextId;
}

// restartGame()
// Resets all state back to the beginning.
function restartGame() {
  currentSceneId = "start";
  visitedScenes.length = 0;
}

// -------------------------------------------------------
// GAME LOOP - DO NOT MODIFY
// -------------------------------------------------------

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function runGame() {
  displayScene(currentSceneId);

  const scene = getCurrentScene(currentSceneId);

  if (scene.isEnding) {
    askAfterEnding();
  } else {
    const quitNumber = scene.choices.length + 1;
    console.log(quitNumber + ". Quit");
    askForInput();
  }
}

function askForInput() {
  rl.question("\nEnter your choice: ", function (answer) {
    const choiceNumber = parseInt(answer);
    const scene = getCurrentScene(currentSceneId);
    const quitNumber = scene.choices.length + 1;

    if (isNaN(choiceNumber) || choiceNumber < 1 || choiceNumber > quitNumber) {
      console.log("Please enter a number between 1 and " + quitNumber + ".");
      askForInput();
      return;
    }

    if (choiceNumber === quitNumber) {
      console.log("\nGoodbye.");
      rl.close();
      process.exit(0);
    }

    currentSceneId = makeChoice(currentSceneId, choiceNumber);
    runGame();
  });
}

function askAfterEnding() {
  console.log("\n1. Play Again");
  console.log("2. Quit");

  rl.question("\nEnter your choice: ", function (answer) {
    const choiceNumber = parseInt(answer);

    if (choiceNumber === 1) {
      restartGame();
      runGame();
      return;
    }

    if (choiceNumber === 2) {
      console.log("\nThanks for playing.");
      rl.close();
      process.exit(0);
    }

    console.log("Please enter 1 or 2.");
    askAfterEnding();
  });
}

runGame();
