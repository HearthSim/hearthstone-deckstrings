import {
	DeckDefinition,
	DeckList,
	MercenariesTeamDefinition,
	MercenaryDefinition
} from "../types";
import { BufferReader, BufferWriter } from "./buffer";
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
			deck.format !== FormatType.FT_STANDARD &&
			deck.format !== FormatType.FT_CLASSIC) ||
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

	const nextByte = reader.nextByte();
	if (nextByte !== 0) {
		throw new Error("Invalid deckstring " + nextByte);
	}

	const version = reader.nextVarint();
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

export function encodeMercs(deck: MercenariesTeamDefinition): string {
	const writer = new BufferWriter();
	writer.varint(8);
	writer.varint(deck.teamId);
	writer.varint(18);

	const teamNameArray = new TextEncoder().encode(deck.name);
	const bufferSize = teamNameArray.length;
	writer.varint(bufferSize);
	for (let i = 0; i < bufferSize; i++) {
		writer.varint(teamNameArray[i]);
	}

	writer.varint(24);
	writer.varint(deck.type != null ? deck.type : 1);

	writer.varint(34);

	const teamWriter = new BufferWriter();
	writeTeamInfo(teamWriter, deck.mercenaries);

	const mercenaryListBlockSize = teamWriter.buffer.length;
	writer.varint(mercenaryListBlockSize);
	writeTeamInfo(writer, deck.mercenaries);

	writer.varint(40);
	writer.varint(10);

	return writer.toString();
}

function writeTeamInfo(
	teamWriter: BufferWriter,
	team: MercenaryDefinition[]
): void {
	for (let i = 0; i < team.length; i++) {
		const merc = team[i];

		const mercWriter = new BufferWriter();
		writeMercInfo(mercWriter, merc);

		const mercenaryFieldSize = mercWriter.buffer.length;
		teamWriter.varint(10);
		teamWriter.varint(mercenaryFieldSize);
		writeMercInfo(teamWriter, merc);
	}
}

function writeMercInfo(
	mercWriter: BufferWriter,
	merc: MercenaryDefinition
): void {
	mercWriter.varint(8);
	mercWriter.varint(merc.mercenaryId);
	mercWriter.varint(16);
	mercWriter.varint(merc.selectedEquipmentId);
	mercWriter.varint(24);
	mercWriter.varint(merc.selectedArtVariationId);
	mercWriter.varint(32);
	mercWriter.varint(merc.selectedArtVariationPremium);
}

export function decodeMercs(deckstring: string): MercenariesTeamDefinition {
	const reader = new BufferReader(deckstring);

	const hasTeamId = reader.nextByte();
	if (hasTeamId !== 8) {
		throw new Error("Invalid deckstring " + hasTeamId);
	}

	const teamId = reader.nextVarint();

	const hasName = reader.nextByte();
	const teamNameSize = reader.nextByte();
	const teamNameArray = [];
	for (let i = 0; i < teamNameSize; i++) {
		teamNameArray.push(reader.nextByte());
	}
	const teamName = new TextDecoder().decode(new Uint8Array(teamNameArray));

	const hasType = reader.nextByte();
	const type = reader.nextByte();

	const hasMercenaryList = reader.nextByte();
	const mercenaryListBlockSize = reader.nextByte();
	const startListPosition = reader.index;
	const endListPosition = startListPosition + mercenaryListBlockSize;

	const team: MercenaryDefinition[] = [];
	// Read all the heroes
	while (true) {
		if (reader.index >= endListPosition) {
			break;
		}
		const mercenary: MercenaryDefinition = {} as MercenaryDefinition;
		team.push(mercenary);
		const encodingType = reader.nextByte();
		if (encodingType !== 10) {
			throw new Error("non-length delimited encoding not supported yet");
		}
		const fieldsForMerc = reader.nextByte();
		const positionAtStart = reader.index;
		const positionAtEnd = positionAtStart + fieldsForMerc;

		// Read all fields
		while (true) {
			if (reader.index >= positionAtEnd) {
				break;
			}
			const nextInfo = reader.nextByte();
			switch (nextInfo) {
				case 8:
					mercenary.mercenaryId = reader.nextByte();
					continue;
				case 16:
					mercenary.selectedEquipmentId = reader.nextByte();
					continue;
				case 24:
					mercenary.selectedArtVariationId = reader.nextByte();
					continue;
				case 32:
					mercenary.selectedArtVariationPremium = reader.nextByte();
					continue;
				case 40:
					mercenary.sharedTeamMercenaryXp = reader.nextByte();
					continue;
				case 48:
					mercenary.sharedTeamMercenaryIsFullyUpgraded = reader.nextByte();
					continue;
				default:
					// skip, no idea what these are
					continue;
			}
		}
	}

	return {
		teamId: teamId,
		name: teamName,
		type: type,
		mercenaries: team,
	};
}

export { FormatType };

