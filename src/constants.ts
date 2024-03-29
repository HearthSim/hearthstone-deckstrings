import { FormatType as FormatTypeType } from "../types";

export const DECKSTRING_VERSION = 1;

export const FormatType: { [key: string]: FormatTypeType } = {
	FT_WILD: 1,
	FT_STANDARD: 2,
	FT_CLASSIC: 3,
	FT_TWIST: 4,
};
