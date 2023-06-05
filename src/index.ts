import { BufferReader, BufferWriter } from "./buffer";
import { DeckDefinition, DeckCard, SideboardCard } from "../types";
import { DECKSTRING_VERSION, FormatType } from "./constants";

type BaseCard = [number, number, ...any[]];

function verifyDbfId(id: unknown, name?: string): void {
	name = name ? name : "dbf id";
	if (!isPositiveNaturalNumber(id)) {
		throw new Error(`Invalid ${name} ${id} (expected valid dbf id)`);
	}
}

function isPositiveNaturalNumber(n: unknown): boolean {
	if (typeof n !== "number" || !isFinite(n)) {
		return false;
	}
	if (Math.floor(n) !== n) {
		return false;
	}
	return n > 0;
}

function sort_cards<T extends BaseCard>(cards: T[]): T[] {
	return cards.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
}

function trisort_cards<T extends BaseCard>(cards: T[]): [T[], T[], T[]] {
	const single: T[] = [],
		double: T[] = [],
		n: T[] = [];
	for (const tuple of cards) {
		const [card, count] = tuple;
		if (count === 0) {
			continue;
		}
		if (count === 1) {
			single.push(tuple);
		} else if (count === 2) {
			double.push(tuple);
		} else if (isPositiveNaturalNumber(count)) {
			n.push(tuple);
		} else {
			throw new Error(
				`Invalid count ${count} (expected positive natural number)`
			);
		}
	}
	return [single, double, n];
}

export function encode(deck: DeckDefinition): string {
	if (
		typeof deck !== "object" ||
		(deck.format !== FormatType.FT_WILD &&
			deck.format !== FormatType.FT_STANDARD &&
			deck.format !== FormatType.FT_CLASSIC) ||
		!Array.isArray(deck.heroes) ||
		!Array.isArray(deck.cards) ||
		(typeof deck.sideboardCards !== "undefined" &&
			!Array.isArray(deck.sideboardCards))
	) {
		throw new Error("Invalid deck definition");
	}

	const writer = new BufferWriter();

	const format = deck.format;
	const heroes = deck.heroes.slice().sort();
	const cards = sort_cards(deck.cards.slice());
	const sideboard = sort_cards((deck.sideboardCards || []).slice());

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
			verifyDbfId(card), "card";
			writer.varint(card);
			if (count !== 1 && count !== 2) {
				writer.varint(count);
			}
		}
	}

	if (sideboard.length) {
		writer.varint(1);
		for (let list of trisort_cards(sideboard)) {
			writer.varint(list.length);
			for (let tuple of list) {
				const [card, count, owner] = tuple;
				verifyDbfId(card, "sideboard card");
				verifyDbfId(owner, "sideboard card owner");
				writer.varint(card);
				if (count !== 1 && count !== 2) {
					writer.varint(count);
				}
				writer.varint(owner);
			}
		}
	} else {
		writer.varint(0);
	}

	return writer.toString();
}

export function decode(deckstring: string): DeckDefinition {
	const reader = new BufferReader(deckstring);

	if (reader.nextByte() !== 0) {
		throw new Error("Invalid deckstring");
	}

	const version = reader.nextByte();
	if (version !== DECKSTRING_VERSION) {
		throw new Error(`Unsupported deckstring version ${version}`);
	}

	const format = reader.nextVarint();
	if (
		format !== FormatType.FT_WILD &&
		format !== FormatType.FT_STANDARD &&
		format !== FormatType.FT_CLASSIC
	) {
		throw new Error(`Unsupported format ${format} in deckstring`);
	}

	const heroes = new Array(reader.nextVarint());
	for (let i = 0; i < heroes.length; i++) {
		heroes[i] = reader.nextVarint();
	}
	heroes.sort();

	const cards: DeckCard[] = [];
	for (let i = 1; i <= 3; i++) {
		for (let j = 0, c = reader.nextVarint(); j < c; j++) {
			cards.push([
				reader.nextVarint(), // dbf id
				i === 1 || i === 2 ? i : reader.nextVarint(),
			]);
		}
	}
	sort_cards(cards);

	const sideboardCards: SideboardCard[] = [];
	const hasSideboard = reader.nextByte();
	if (hasSideboard == 1) {
		for (let i = 1; i <= 3; i++) {
			for (let j = 0, c = reader.nextVarint(); j < c; j++) {
				sideboardCards.push([
					reader.nextVarint(), // dbf id
					i === 1 || i === 2 ? i : reader.nextVarint(),
					reader.nextVarint(), // sideboard card owner dbf id
				]);
			}
		}
		sort_cards(sideboardCards);
	}

	return {
		cards,
		sideboardCards,
		heroes,
		format,
	};
}

export { FormatType };
