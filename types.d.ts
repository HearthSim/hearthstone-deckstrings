export type FormatType = 1 | 2 | 3;

export type DeckList = [number, number, number?][]; // [dbfId, count, parent?]

export interface DeckDefinition {
	cards: DeckList;
	heroes: number[];
	format: FormatType;
	sideboard?: DeckList;
}

export function encode(deck: DeckDefinition): string;

export function decode(deckstring: string): DeckDefinition;
