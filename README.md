# Word Guess Game

## Description

A word guessing game I'm building with vanilla javacript. After clicking start try guessing letters by pressing keys on your keyboard! Guess within the time limit and you win!

![Screenshot of the live site](./screenshot.png)

## Table of Contents

- [Installation](#installation)
- [License](#license)
- [Wishlist](#wishlist)

## Installation

This app is using an api call from https://api-ninjas.com/api/randomword to generate the random word. If you want to run this app using the API Ninja's random word API you'll need to obtain an api key.

Once you have the API key you can create an env.js file in the assets folder with the contents `export const RANDOM_WORD_API_KEY = "YOUR_API_KEY_HERE";`. Then just run the `index.html` file in your browser.

## License

MIT License Copyright (c) 2023 Lorne Cyr

## Wishlist

- Improve the look of the page.
- Add different difficulty levels.
- Add different profiles for shared computers.
- Let user choose which types of words to include (nouns, adverbs, verbs, adjectives).
