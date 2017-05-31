import {BufferReader, BufferWriter} from "./buffer";

export interface DeckDefinition {
	cards: number[];
	heroes: number[];
	format: 1 | 2;
}

const DECKSTRING_VERSION = 1;

function verifyDbfId(id: any, name?: string): void {
	name = name ? name : "dbf id";
	if (!isPositiveNaturalNumber(id)) {
		throw new Error(`Invalid ${name} ${id} (expected valid dbf id)`);
	}
}

function isPositiveNaturalNumber(n: any): boolean {
	if (typeof n !== "number" || !isFinite(n)) {
		return false;
	}
	if (Math.floor(n) !== n) {
		return false;
	}
	return n > 0;
}

function trisort_cards(cards): any {
	const single = [], double = [], n = [];
	for (const tuple of cards) {
		let list;
		const [card, count] = tuple;
		verifyDbfId(card, "card");
		if (count === 0) {
			continue;
		}
		if (count === 1) {
			list = single;
		}
		else if (count === 2) {
			list = double;
		}
		else if (isPositiveNaturalNumber(count)) {
			list = n;
		}
		else {
			throw new Error(`Invalid count ${count} (expected positive natural number)`);
		}
		list.push(tuple);
	}
	return [
		single,
		double,
		n,
	];
}

export function encode(deck: DeckDefinition): string {
	if (
		typeof deck !== "object" ||
		(deck.format !== 1 && deck.format !== 2) ||
		!Array.isArray(deck.heroes) ||
		!Array.isArray(deck.cards)
	) {
		throw new Error("Invalid deck definition");
	}

	const writer = new BufferWriter();

	const format = deck.format;
	const heroes = deck.heroes;
	const cards = deck.cards;

	writer.null();
	writer.varint(DECKSTRING_VERSION);
	writer.varint(format);
	writer.varint(heroes.length);
	for (let hero of heroes) {
		verifyDbfId(hero, "hero");
		writer.varint(hero);
	}

	for (let list of trisort_cards(cards)) {
		writer.varint(list.length);
		for (let tuple of list) {
			const [card, count] = tuple;
			writer.varint(card);
			if (count !== 1 && count !== 2) {
				writer.varint(count);
			}
		}
	}

	return writer.toString();
}

export function decode(deckstring: string): DeckDefinition {
	const reader = new BufferReader(deckstring);

	if (reader.nextByte() !== 0) {
		throw new Error("Invalid deckstring");
	}

	if (reader.nextVarint() !== DECKSTRING_VERSION) {
		throw new Error(`Unsupported deckstring version {$version}`);
	}

	const format = reader.nextVarint();
	if (format !== 1 && format !== 2) {
		throw new Error(`Unsupported format ${format} in deckstring`);
	}

	const heroes = new Array(reader.nextVarint());
	for (let i = 0; i < heroes.length; i++) {
		heroes[i] = reader.nextVarint();
	}

	const cards = [];
	for (let i = 1; i <= 3; i++) {
		for (let j = 0, c = reader.nextVarint(); j < c; j++) {
			cards.push([reader.nextVarint(), (i === 1 || i === 2) ? i : reader.nextVarint()]);
		}
	}

	return {
		cards,
		heroes,
		format,
	};
}
