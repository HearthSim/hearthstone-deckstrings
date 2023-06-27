export type FormatType = 1 | 2 | 3 | 4;

export type DeckCard = [number, number]; // [dbfId, count]
export type DeckList = DeckCard[]; // keep type for backwards compatibility

export type SideboardCard = [number, number, number]; // [dbfId, count, sideboardOwnerDbfId]

export interface DeckDefinition {
	cards: DeckCard[];
	sideboardCards?: SideboardCard[];
	heroes: number[];
	format: FormatType;
}

export function encode(deck: DeckDefinition): string;

export function decode(deckstring: string): Required<DeckDefinition>;
