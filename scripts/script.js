import { RANDOM_WORD_API_KEY } from "./env.js";

var wordToGuessElement = document.querySelector("#word-to-guess");
var startButton = document.querySelector("#start-button");
var timerElement = document.querySelector("#timer");
var messageElement = document.querySelector("#result-message");
var lossCountElement = document.querySelector("#loss-count");
var winCountElement = document.querySelector("#win-count");
var resetScoreButton = document.querySelector("#reset-score");
var gameIsActive = false;
var timerInterval;
var currentWordToGuess = "";
var blankedWord = [];
var score;

var successAudio = new Audio("../assets/success.mp3");
var failAudio = new Audio("../assets/fail.mp3");

// Initialize the game on page load.
window.onload = function () {
  score = JSON.parse(localStorage.getItem("score"));

  if (!score) {
    score = {
      wins: 0,
      losses: 0,
    };
  }

  updateScoreElements();
};

async function newGame() {
  wordToGuessElement.textContent = "⚙️ loading new word...";

  currentWordToGuess = await getRandomWord();
  blankedWord = [...replaceWordWithUnderscores(currentWordToGuess)];
  startTimer(10);
  updateWordSpan();
  gameIsActive = true;
}

async function getRandomWord(type = "") {
  var supportedTypes = ["noun", "adjective", "adverb", "verb"];
  var typeParam = "";
  if (supportedTypes.includes(type.toLowerCase())) {
    typeParam = `?type=${type}`.toLowerCase();
  }

  const response = await fetch(
    `https://api.api-ninjas.com/v1/randomword${typeParam}`,
    {
      headers: {
        "X-Api-Key": RANDOM_WORD_API_KEY,
      },
    }
  );

  var data = await response.json();
  // console.log(data.word.toLowerCase());
  return data.word.toLowerCase();
}

function startTimer(timeInSeconds) {
  var countDown = timeInSeconds;
  timerElement.textContent = `${countDown}s`;

  timerInterval = setInterval(function () {
    countDown--;
    timerElement.textContent = `${countDown}s`;
    if (countDown < 1) {
      gameIsActive = false;
      timerElement.textContent = "Time's up!";
      clearInterval(timerInterval);
      failAudio.play();
      showStartButton();
      showGameOverMessage();
      incrementLosses();
    }
  }, 1000);
}

function replaceWordWithUnderscores(word) {
  var blank = "";
  for (let i = 0; i < word.length; i++) {
    blank += "_";
  }
  return blank;
}

function updateWordSpan() {
  wordToGuessElement.textContent = blankedWord.join("");
}

function updateScoreElements() {
  winCountElement.textContent = score.wins;
  lossCountElement.textContent = score.losses;
}

function showGameOverMessage() {
  messageElement.innerHTML = `😵 Game Over! The word was <strong>${currentWordToGuess}</strong>.`;
}

function showSuccessMessage() {
  messageElement.innerHTML = `Congratulations! You win! 🎉`;
}

function checkSuccess() {
  return !blankedWord.includes("_");
}

function showStartButton() {
  startButton.setAttribute("style", "visibility: unset;");
}

function hideStartButton() {
  startButton.setAttribute("style", "visibility: hidden;");
}

function incrementWins() {
  score.wins++;
  updateLocalStorage();
  updateScoreElements();
}

function incrementLosses() {
  score.losses++;
  updateLocalStorage();
  updateScoreElements();
}

function updateLocalStorage() {
  localStorage.setItem("score", JSON.stringify(score));
}

resetScoreButton.addEventListener("click", function () {
  var confirmedReset = confirm("Click OK to clear your score.");
  if (confirmedReset) {
    score = {
      wins: 0,
      losses: 0,
    };

    updateLocalStorage();
    updateScoreElements();
  }
});

window.addEventListener("keydown", function (event) {
  if (gameIsActive) {
    var keypressed = event.key;
    for (let i = 0; i < currentWordToGuess.length; i++) {
      const letter = currentWordToGuess[i];
      if (letter === keypressed) {
        blankedWord[i] = letter;
      }
      if (blankedWord != wordToGuessElement.textContent) {
        updateWordSpan();
      }
      if (checkSuccess()) {
        gameIsActive = false;
        clearInterval(timerInterval);
        successAudio.play();
        showStartButton();
        showSuccessMessage();
        incrementWins();
      }
    }
  }
});

startButton.addEventListener("click", function () {
  hideStartButton();
  newGame();
  startButton.textContent = "Play Again";
  messageElement.textContent = "";
});
