export type FormatType = 1 | 2 | 3;

export type DeckList = [number, number][]; // [dbfId, count]

export interface DeckDefinition {
	cards: DeckList;
	heroes: number[];
	format: FormatType;
}

export interface MercenariesTeamDefinition {
	teamId: number;
	name: string;
	type: number;
	mercenaries: MercenaryDefinition[];
}

export interface MercenaryDefinition {
	mercenaryId: number;
	selectedEquipmentId: number;
	selectedArtVariationId: number;
	selectedArtVariationPremium: number;
	sharedTeamMercenaryXp: number;
	sharedTeamMercenaryIsFullyUpgraded: number;
}

export function encode(deck: DeckDefinition): string;

export function decode(deckstring: string): DeckDefinition;
