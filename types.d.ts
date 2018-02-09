export type DeckList = [number, number][]; // [dbfId, count]

export interface DeckDefinition {
	cards: DeckList;
	heroes: number[];
	format: 1 | 2;
}

export function encode(deck: DeckDefinition): string;

export function decode(deckstring: string): DeckDefinition;
