# `deckstrings` for Hearthstone
[![Travis](https://img.shields.io/travis/HearthSim/npm-deckstrings/master.svg)](https://travis-ci.org/HearthSim/npm-deckstrings)
[![npm](https://img.shields.io/npm/v/deckstrings.svg)](http://npmjs.com/package/deckstrings)

Decode and encode Hearthstone [deckstrings](https://hearthsim.info/docs/deckstrings/).

Any deckstring or deck definition returned by this library will be canonical.
This means that the cards and heroes are sorted in ascending order by dbf id.

A mapping between dbf ids and cards can be found at [HearthstoneJSON](https://hearthstonejson.com/).

## Install

Install the package from npm using your favourite package manager:

```
$ yarn add deckstrings
```

## Usage

```javascript
import {encode, decode} from "deckstrings";

const deck = {
	cards: [[1, 2], [2, 2], [3, 2], [4, 1]], // [dbfid, count] pairs
	heroes: [7], // Garrosh Hellscream
	format: 1, // 1 for Wild, 2 for Standard
};

const deckstring = encode(deck);
console.log(deckstring); // AAEBAQcBBAMBAgMA

const decoded = decode(deckstring);
console.log(JSON.stringify(deck) === JSON.stringify(decoded)); // true
```
