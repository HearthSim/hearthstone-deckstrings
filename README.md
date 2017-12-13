# `deckstrings` for Hearthstone
[![Travis](https://img.shields.io/travis/HearthSim/npm-deckstrings/master.svg)](https://travis-ci.org/HearthSim/npm-deckstrings)
[![npm](https://img.shields.io/npm/v/deckstrings.svg)](http://npmjs.com/package/deckstrings)

Decode and encode Hearthstone [deckstrings](https://hearthsim.info/docs/deckstrings/).

## Install

Install the package from npm using your favourite package manager:

```
$ yarn add deckstrings
```

## Usage

```javascript
import {encode, decode} from "deckstrings";

const deck = {
	cards: [[1, 3], [2, 3], [3, 3], [4, 3]], // [dbfid, count] pairs
	heroes: [7], // Garrosh Hellscream
	format: 1, // 1 for Wild, 2 for Standard
};

const deckstring = encode(deck);
console.log(deckstring); // AAEBAQcAAAQBAwIDAwMEAw==

const decoded = decode(deckstring);
console.log(JSON.stringify(deck) === JSON.stringify(decoded)); // true
```
