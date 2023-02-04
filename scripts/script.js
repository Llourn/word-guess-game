import { RANDOM_WORD_API_KEY } from "./env.js";

/*
The completed application should meet the following criteria:

✅ As a user, I want to start the game by clicking on a button.
✅ As a user, I want to try and guess a word by filling in a number of blanks that match the number of letters in that word.
✅ As a user, I want the game to be timed.
✅ As a user, I want to win the game when I have guessed all the letters in the word.
✅ As a user, I want to lose the game when the timer runs out before I have guessed all the letters.
✅ As a user, I want to see my total wins and losses on the screen.

Specifications
✅ When a user presses a letter key, the user's guess should be captured as a key event.
✅ When a user correctly guesses a letter, the corresponding blank "_" should be replaced by the letter. For example, if the user correctly selects "a", then "a _ _ a _" should appear.
✅ When a user wins or loses a game, a message should appear and the timer should stop.
✅ When a user clicks the start button, the timer should reset.
✅ When a user refreshes or returns to the brower page, the win and loss counts should persist.
*/

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

function init() {
  score = JSON.parse(localStorage.getItem("score"));

  if (!score) {
    score = {
      wins: 0,
      losses: 0,
    };
  }

  updateScoreElements();
}

init();

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
  console.log(data.word);
  return data.word.toLowerCase();
}

async function newGame() {
  wordToGuessElement.textContent = "⚙️ loading new word...";

  currentWordToGuess = await getRandomWord();
  blankedWord = [...replaceWordWithUnderscores(currentWordToGuess)];
  startTimer(5);
  updateWordSpan();
  gameIsActive = true;
}

function startTimer(timeInSeconds) {
  var countDown = timeInSeconds;
  timerElement.textContent = `${countDown}s`;

  timerInterval = setInterval(function () {
    countDown--;
    timerElement.textContent = `${countDown}s`;
    if (countDown < 1) {
      clearInterval(timerInterval);
      timerElement.textContent = "Time's up!";
      showStartButton();
      showGameOverMessage();
      incrementLosses();
      gameIsActive = false;
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
  console.log(score);
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
  startButton.setAttribute("style", "display: unset;");
}

function hideStartButton() {
  startButton.setAttribute("style", "display: none;");
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
  console.log(score);
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
