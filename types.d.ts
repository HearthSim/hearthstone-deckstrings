export type FormatType = 1 | 2 | 3;

export type DeckCard = [number, number]; // [dbfId, count]

export type DeckList = DeckCard[]; // keep type for backwards compatibility

export interface DeckDefinition {
	cards: DeckCard[];
	heroes: number[];
	format: FormatType;
}

export function encode(deck: DeckDefinition): string;

export function decode(deckstring: string): DeckDefinition;
