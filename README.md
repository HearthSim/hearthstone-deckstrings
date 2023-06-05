# `deckstrings` for Hearthstone
[![npm](https://img.shields.io/npm/v/deckstrings.svg)](http://npmjs.com/package/deckstrings)

Decode and encode Hearthstone [deckstrings](https://hearthsim.info/docs/deckstrings/).

A mapping between DBF ids and cards can be found at [HearthstoneJSON](https://hearthstonejson.com/).

Any deckstring or deck definition returned by this library will be "canonical": The cards and heroes are sorted by DBF id in ascending order.

## Install

Install the package from npm using your favourite package manager:

```
$ yarn add deckstrings
```

## Usage

```javascript
import { encode, decode, FormatType } from "deckstrings";

const deck = {
	cards: [[1, 2], [2, 2], [3, 2], [4, 1]], // [dbfId, count] pairs
	sideboardCards: [[5, 1, 90749]], // [dbfId, count, sideboardOwnerDbfId] triplets
	heroes: [7], // Garrosh Hellscream
	format: FormatType.FT_WILD, // or FT_STANDARD or FT_CLASSIC
};

const deckstring = encode(deck);
console.log(deckstring); // AAEBAQcBBAMBAgMAAQEF/cQFAAA=

const decoded = decode(deckstring);
console.log(JSON.stringify(deck) === JSON.stringify(decoded)); // true
```
