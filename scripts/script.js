import { RANDOM_WORD_API_KEY } from "./env.js";

/*
The completed application should meet the following criteria:

✅ As a user, I want to start the game by clicking on a button.
✅ As a user, I want to try and guess a word by filling in a number of blanks that match the number of letters in that word.
✅ As a user, I want the game to be timed.
As a user, I want to win the game when I have guessed all the letters in the word.
As a user, I want to lose the game when the timer runs out before I have guessed all the letters.
As a user, I want to see my total wins and losses on the screen.

Specifications
✅ When a user presses a letter key, the user's guess should be captured as a key event.
✅ When a user correctly guesses a letter, the corresponding blank "_" should be replaced by the letter. For example, if the user correctly selects "a", then "a _ _ a _" should appear.
When a user wins or loses a game, a message should appear and the timer should stop.
When a user clicks the start button, the timer should reset.
When a user refreshes or returns to the brower page, the win and loss counts should persist.
*/

var wordSpan = document.querySelector("#word-to-guess");
var startButton = document.querySelector("#start-button");
var timerSpan = document.querySelector("#timer");
var gameIsActive = false;
var timerInterval;
var currentWordToGuess = "";
var blankedWord = [];

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

async function newWord() {
  wordSpan.textContent = "⚙️ loading new word...";

  currentWordToGuess = await getRandomWord();
  blankedWord = [...replaceWithUnderscores(currentWordToGuess)];
  startTimer(5);
  updateWordSpan();
  gameIsActive = true;
}

function startTimer(timeInSeconds) {
  var countDown = timeInSeconds;
  timerSpan.textContent = `${countDown}s`;

  timerInterval = setInterval(function () {
    countDown--;
    timerSpan.textContent = `${countDown}s`;
    if (countDown < 1) {
      clearInterval(timerInterval);
      timerSpan.textContent = "Game over";
      showStartButton();
      gameIsActive = false;
    }
  }, 1000);
}

function replaceWithUnderscores(word) {
  var blank = "";
  for (let i = 0; i < word.length; i++) {
    blank += "_";
  }
  return blank;
}

function updateWordSpan() {
  wordSpan.textContent = blankedWord.join("");
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

window.addEventListener("keydown", function (event) {
  if (gameIsActive) {
    var keypressed = event.key;
    for (let i = 0; i < currentWordToGuess.length; i++) {
      const letter = currentWordToGuess[i];
      if (letter === keypressed) {
        blankedWord[i] = letter;
      }
      if (blankedWord != wordSpan.textContent) {
        updateWordSpan();
      }
      if (checkSuccess()) {
        clearInterval(timerInterval);
        showStartButton();
      }
    }
  }
});

startButton.addEventListener("click", function () {
  hideStartButton();
  newWord();
});
