import { BufferReader, BufferWriter } from "./buffer";
import { DeckDefinition, DeckList } from "../types";
import { DECKSTRING_VERSION, FormatType } from "./constants";

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

function sorted_cards(cards: DeckList) {
	return cards.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
}

function trisort_cards(cards: DeckList): any {
	const single: DeckList = [],
		double: DeckList = [],
		n: DeckList = [];
	for (const tuple of cards) {
		let list;
		const [card, count] = tuple;
		verifyDbfId(card, "card");
		if (count === 0) {
			continue;
		}
		if (count === 1) {
			list = single;
		} else if (count === 2) {
			list = double;
		} else if (isPositiveNaturalNumber(count)) {
			list = n;
		} else {
			throw new Error(
				`Invalid count ${count} (expected positive natural number)`
			);
		}
		list.push(tuple);
	}
	return [single, double, n];
}

export function encode(deck: DeckDefinition): string {
	if (
		typeof deck !== "object" ||
		(deck.format !== FormatType.FT_WILD &&
			deck.format !== FormatType.FT_STANDARD) ||
		!Array.isArray(deck.heroes) ||
		!Array.isArray(deck.cards)
	) {
		throw new Error("Invalid deck definition");
	}

	const writer = new BufferWriter();

	const format = deck.format;
	const heroes = deck.heroes.slice().sort();
	const cards = sorted_cards(deck.cards.slice());

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

	const version = reader.nextVarint();
	if (version !== DECKSTRING_VERSION) {
		throw new Error(`Unsupported deckstring version ${version}`);
	}

	const format = reader.nextVarint();
	if (format !== FormatType.FT_WILD && format !== FormatType.FT_STANDARD) {
		throw new Error(`Unsupported format ${format} in deckstring`);
	}

	const heroes = new Array(reader.nextVarint());
	for (let i = 0; i < heroes.length; i++) {
		heroes[i] = reader.nextVarint();
	}
	heroes.sort();

	const cards: DeckList = [];
	for (let i = 1; i <= 3; i++) {
		for (let j = 0, c = reader.nextVarint(); j < c; j++) {
			cards.push([
				reader.nextVarint(),
				i === 1 || i === 2 ? i : reader.nextVarint(),
			]);
		}
	}
	sorted_cards(cards);

	return {
		cards,
		heroes,
		format,
	};
}

export { FormatType };
