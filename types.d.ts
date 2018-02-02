export interface DeckDefinition {
	cards: [number, number][]; // [dbfId, count]
	heroes: number[];
	format: 1 | 2;
}

export function encode(deck: DeckDefinition): string;

export function decode(deckstring: string): DeckDefinition;
