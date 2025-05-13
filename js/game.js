// Game state
let gameState = {
  selectedPet: null,
  hunger: 100,
  happiness: 100,
  maxHunger: 100,
  maxHappiness: 100,
  stage: 0,
  animationInterval: null,
  isAlive: true,
  evolutionPoints: 0,
  waterRequestActive: false,
  waterRequestTimer: null,
  hasWon: false,
};

// DOM Elements
const selectionScreen = document.getElementById("selectionScreen");
const petOptions = document.querySelectorAll(".pet-option");
const gameScreen = document.getElementById("gameScreen");
const petDescription = document.getElementById("petDescription");
const hungerMeter = document.getElementById("hungerMeter");
const happinessMeter = document.getElementById("happinessMeter");
const hungerValue = document.getElementById("hungerValue");
const happinessValue = document.getElementById("happinessValue");
const petGame = document.getElementById("petGame");
const feedBtn = document.getElementById("feedBtn");
const playBtn = document.getElementById("playBtn");
const feedTray = document.getElementById("feedTray");
const playTray = document.getElementById("playTray");
const closeFeedTray = document.getElementById("closeFeedTray");
const closePlayTray = document.getElementById("closePlayTray");
const gameOverModal = document.getElementById("gameOverModal");
const modalTitle = document.getElementById("modalTitle");
const speechBubble = document.getElementById("speechBubble");
const waterRequest = document.getElementById("waterRequest");
const wateringCan = document.getElementById("wateringCan");

// Game timers
let hungerTimer;
let happinessTimer;
let evolutionTimer;
let waterRequestTimer;

// Show pet description on hover
function showDescription(petId) {
  petDescription.textContent = PETS[petId].description;
}

// Select pet and start game
function selectPet(petId) {
  gameState.selectedPet = petId;
  selectionScreen.style.display = "none";
  gameScreen.style.display = "flex";

  // Clear any existing animation
  if (gameState.animationInterval) {
    clearInterval(gameState.animationInterval);
  }

  // Set up animation for pet first stage
  gameState.animationInterval = setInterval(() => {
    const currentStage = PETS[petId].stages.stage1;
    const currentFrame = petGame.innerHTML.includes(currentStage[0]) ? 1 : 0;
    petGame.innerHTML = `<img src="${currentStage[currentFrame]}" alt="${PETS[petId].name}">`;
  }, 500);

  startGame();
}

// Start game logic
function startGame() {
  resetMeters();

  // Set up timers
  hungerTimer = setInterval(decreaseHunger, 3000);
  happinessTimer = setInterval(decreaseHappiness, 3000);
  evolutionTimer = setInterval(checkEvolution, 5000);
  waterRequestTimer = setInterval(requestWater, Math.random() * 15000 + 15000); // Between 15-30 seconds

  // Set up event listeners
  setupEventListeners();
}

// Reset meters to full
function resetMeters() {
  gameState.hunger = 100;
  gameState.happiness = 100;
  gameState.maxHunger = 100;
  gameState.maxHappiness = 100;
  gameState.stage = 1;
  gameState.isAlive = true;
  gameState.evolutionPoints = 0;
  gameState.hasWon = false;

  updateMeters();
}

// Update visual meters
function updateMeters() {
  // Clamp values
  gameState.hunger = Math.max(0, Math.min(gameState.maxHunger, gameState.hunger));
  gameState.happiness = Math.max(0, Math.min(gameState.maxHappiness, gameState.happiness));

  // Update meter widths
  hungerMeter.style.width = (gameState.hunger / gameState.maxHunger) * 100 + "%";
  happinessMeter.style.width = (gameState.happiness / gameState.maxHappiness) * 100 + "%";

  // Update text values
  hungerValue.textContent = Math.round(gameState.hunger) + "/" + gameState.maxHunger;
  happinessValue.textContent = Math.round(gameState.happiness) + "/" + gameState.maxHappiness;

  // Update meter colors
  const hungerPercent = (gameState.hunger / gameState.maxHunger) * 100;
  const happinessPercent = (gameState.happiness / gameState.maxHappiness) * 100;

  if (hungerPercent > 60) {
    hungerMeter.style.backgroundColor = "var(--meter-green)";
  } else if (hungerPercent > 30) {
    hungerMeter.style.backgroundColor = "var(--meter-yellow)";
  } else {
    hungerMeter.style.backgroundColor = "var(--meter-red)";
  }

  if (happinessPercent > 60) {
    happinessMeter.style.backgroundColor = "var(--meter-green)";
  } else if (happinessPercent > 30) {
    happinessMeter.style.backgroundColor = "var(--meter-yellow)";
  } else {
    happinessMeter.style.backgroundColor = "var(--meter-red)";
  }

  // Check if pet is dead
  if (gameState.hunger <= 0 || gameState.happiness <= 0) {
    petDied();
  }
}

// Decrease hunger over time
function decreaseHunger() {
  if (!gameState.isAlive) return;
  gameState.hunger -= 5;
  updateMeters();
}

// Decrease happiness over time
function decreaseHappiness() {
  if (!gameState.isAlive) return;
  gameState.happiness -= 5;
  updateMeters();
}

// Check for evolution
function checkEvolution() {
  if (!gameState.isAlive || gameState.hasWon) return;

  gameState.evolutionPoints++;

  // Evolution thresholds
  if (gameState.evolutionPoints >= 5 && gameState.stage === 1) {
    evolvePet(2);
  } else if (gameState.evolutionPoints >= 12 && gameState.stage === 2) {
    evolvePet(3);
    winGame();
  }
}

// Evolve pet to next stage
function evolvePet(newStage) {
  gameState.stage = newStage;
  const selected = gameState.selectedPet;
  petGame.classList.add("evolving");

  // Show evolution message
  showSpeechBubble(
    newStage === 3
      ? `${PETS[selected].name} is all grown up!`
      : `${PETS[selected].name} is evolving!`
  );

  // Increase meter maximums
  gameState.maxHunger += 50;
  gameState.maxHappiness += 50;

  // Add some bonus to current values
  gameState.hunger += 25;
  gameState.happiness += 25;

  // Update pet appearance
  setTimeout(() => {
    // Clear existing animation interval if it exists
    if (gameState.animationInterval) {
      clearInterval(gameState.animationInterval);
    }

    // Set up animation for new stage
    const stageName = `stage${newStage}`;
    gameState.animationInterval = setInterval(() => {
      const currentStage = PETS[selected].stages[stageName];
      const currentFrame = petGame.innerHTML.includes(currentStage[0]) ? 1 : 0;
      petGame.innerHTML = `<img src="${currentStage[currentFrame]}" alt="${
        PETS[gameState.selectedPet].name
      }">`;
    }, 500);

    petGame.classList.remove("evolving");
    updateMeters();
  }, 1000);
}

// Randomly request water
function requestWater() {
  if (!gameState.isAlive || gameState.waterRequestActive) return;

  gameState.waterRequestActive = true;
  waterRequest.style.display = "block";
  wateringCan.style.display = "flex";

  // Set timer for response
  gameState.waterRequestTimer = setTimeout(() => {
    if (gameState.waterRequestActive) {
      // Player didn't water in time
      gameState.happiness -= 20;
      gameState.hunger -= 20;
      updateMeters();
      showSpeechBubble("I'm so thirsty! 😢");
      resetWaterRequest();
    }
  }, 3000);
}

// Reset water request
function resetWaterRequest() {
  gameState.waterRequestActive = false;
  waterRequest.style.display = "none";
  wateringCan.style.display = "none";
  clearTimeout(gameState.waterRequestTimer);
}

// Water the pet
function waterPet() {
  if (!gameState.waterRequestActive) return;

  resetWaterRequest();
  gameState.happiness += 20;
  gameState.hunger += 20;
  showSpeechBubble("Thank you! 💧");
  updateMeters();
  petGame.classList.add("shine");
  setTimeout(() => petGame.classList.remove("shine"), 500);
}

// Show speech bubble with message
function showSpeechBubble(message) {
  speechBubble.textContent = message;
  speechBubble.style.display = "block";

  setTimeout(() => {
    speechBubble.style.display = "none";
  }, 2000);
}

// Pet died
function petDied() {
  if (!gameState.isAlive) return;

  gameState.isAlive = false;
  const deadImage = PETS[gameState.selectedPet].stages.dead;
  petGame.innerHTML = `<img src="${deadImage}" alt="Dead ${PETS[gameState.selectedPet].name}">`;

  clearAllTimers();

  // Show game over message
  setTimeout(() => {
    modalTitle.textContent = `${PETS[gameState.selectedPet].name} has died!`;
    gameOverModal.style.display = "flex";
    // Hide the keep playing button on game over
    document.querySelector(".keepPlaying-btn").style.display = "none";
  }, 1000);
}

// Player won the game
function winGame() {
  if (gameState.hasWon) return;

  gameState.hasWon = true;
  clearAllTimers();

  // Show win message
  setTimeout(() => {
    modalTitle.textContent = "Your pet is all grown up! You Win! 🎉";
    gameOverModal.style.display = "flex";
    document.querySelector(".keepPlaying-btn").style.display = "block";
  }, 5000);
}

// Clear all game timers
function clearAllTimers() {
  clearInterval(hungerTimer);
  clearInterval(happinessTimer);
  clearInterval(evolutionTimer);
  clearInterval(waterRequestTimer);
  clearTimeout(gameState.waterRequestTimer);
  if (gameState.animationInterval) {
    clearInterval(gameState.animationInterval);
  }
}

// Keep playing
function keepPlaying() {
  gameOverModal.style.display = "none";
}

// Start over
function startOver() {
  gameOverModal.style.display = "none";
  gameScreen.style.display = "none";
  selectionScreen.style.display = "flex";
  clearAllTimers();
}

// Setup all event listeners
function setupEventListeners() {
  // Pet selection
  petOptions.forEach((option) => {
    const petId = option.getAttribute("data-pet");

    // Hover events
    option.addEventListener("mouseover", () => showDescription(petId));
    option.addEventListener("mouseout", () => {
      petDescription.textContent = "Hover over a pet to see its details";
    });

    // Select button click
    const selectBtn = option.querySelector(".select-btn");
    selectBtn.addEventListener("click", () => selectPet(petId));
  });

  // Feed button
  feedBtn.addEventListener("click", () => {
    feedTray.style.display = "flex";
    playTray.style.display = "none";
  });

  // Play button
  playBtn.addEventListener("click", () => {
    playTray.style.display = "flex";
    feedTray.style.display = "none";
  });

  // Close trays
  closeFeedTray.addEventListener("click", () => {
    feedTray.style.display = "none";
  });

  closePlayTray.addEventListener("click", () => {
    playTray.style.display = "none";
  });

  // Watering can
  wateringCan.addEventListener("click", waterPet);

  // Setup click events for items
  setupItemClicks();
}

// Setup click interactions for items
function setupItemClicks() {
  const items = document.querySelectorAll(".item");

  items.forEach((item) => {
    item.addEventListener("click", handleItemClick);

    // Add cursor pointer style
    item.style.cursor = "pointer";
  });
}

function handleItemClick(e) {
  if (!gameState.isAlive) return;

  const itemId = this.getAttribute("data-item");
  const selected = gameState.selectedPet;
  let addAmount;

  if (this.classList.contains("food")) {
    addAmount = FOODS[itemId].value;

    // Check if pet likes this item
    if (PETS[selected].favFoods.includes(itemId)) {
      addAmount *= 2; // Double addAmount if pet likes this food
      showSpeechBubble("Yummy! 😋");
    } else {
      showSpeechBubble("Meh, it's okay.");
    }

    gameState.hunger += addAmount;
    feedTray.style.display = "none";
  } else {
    addAmount = TOYS[itemId].value;

    if (PETS[selected].favToys.includes(itemId)) {
      addAmount *= 2;
      showSpeechBubble("So fun! 🥰");
    } else {
      showSpeechBubble("That's alright.");
    }

    gameState.happiness += addAmount;
    playTray.style.display = "none";
  }

  // Visual feedback
  petGame.classList.add("shine");
  setTimeout(() => petGame.classList.remove("shine"), 500);

  updateMeters();
}

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
});
