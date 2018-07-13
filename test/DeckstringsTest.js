/*#if _PLATFORM === "browser"
import { decode, encode, FormatType } from "../dist/browser.mjs";
//#else */
const { decode, encode, FormatType } = require("../dist/index");
const { expect } = require("chai");
//#endif

const CANONICAL_DECKSTRING =
	"AAECAR8GxwPJBLsFmQfZB/gIDI0B2AGoArUDhwSSBe0G6wfbCe0JgQr+DAA=";

const NONCANONICAL_DECKSTRING =
	"AAECAR8GxwPJBLsFmQfZB/gIDJIF2AGoArUDhwSNAe0G6wfbCe0JgQr+DAA=";

const CANONICAL_DEFINITION = {
	cards: [
		[141, 2], // Hunter's Mark
		[216, 2], // Bloodfen Raptor
		[296, 2], // Kill Command
		[437, 2], // Animal Companion
		[455, 1], // Snake Trap
		[519, 2], // Freezing Trap
		[585, 1], // Explosive Trap
		[658, 2], // Leper Gnome
		[699, 1], // Tundra Rhino
		[877, 2], // Arcane Shot
		[921, 1], // Jungle Panther
		[985, 1], // Dire Wolf Alpha
		[1003, 2], // Houndmaster
		[1144, 1], // King Crush
		[1243, 2], // Unleash the Hounds
		[1261, 2], // Savannah Highmane
		[1281, 2], // Scavenging Hyena
		[1662, 2], // Eaglehorn Bow
	], // pairs of [dbfid, count], by ascending dbfId
	heroes: [31], // Rexxar
	format: FormatType.FT_STANDARD, // 1 for Wild, 2 for Standard
};

const NONCANONICAL_DEFINITION = Object.assign({}, CANONICAL_DEFINITION, {
	cards: CANONICAL_DEFINITION.cards.slice(),
	heros: CANONICAL_DEFINITION.heroes.slice(),
});

[
	NONCANONICAL_DEFINITION.cards[0],
	NONCANONICAL_DEFINITION.cards[7],
	NONCANONICAL_DEFINITION.cards[9],
] = [
	NONCANONICAL_DEFINITION.cards[7],
	NONCANONICAL_DEFINITION.cards[0],
	NONCANONICAL_DEFINITION.cards[9],
];

describe("#encode", () => {
	describe("with a canonical deck definition", () => {
		let result;

		before("should encode without an error", () => {
			result = encode(CANONICAL_DEFINITION);
		});

		it("should return a string", () => {
			expect(result).to.be.a("string");
		});

		it("should return the expected deckstring", () => {
			expect(result).to.equal(CANONICAL_DECKSTRING);
		});
	});

	describe("with a non-canonical deck definition", () => {
		let result;

		before("should encode without an error", () => {
			result = encode(NONCANONICAL_DEFINITION);
		});

		it("should return a string", () => {
			expect(result).to.be.a("string");
		});

		it("should return the expected deckstring", () => {
			expect(result).to.equal(CANONICAL_DECKSTRING);
		});
	});

	it("should throw an error with an invalid deck definition", () => {
		expect(() => encode(477)).to.throw();
		expect(() => encode("somestring")).to.throw();
		expect(() => encode([1, 2, 3])).to.throw();
		expect(() =>
			encode(Object.assign({}, CANONICAL_DEFINITION, { heroes: null }))
		).to.throw();
	});

	it("should throw an error when format is not 1 or 2", () => {
		expect(() =>
			encode(Object.assign({}, CANONICAL_DEFINITION, { format: "1" }))
		).to.throw();
		expect(() =>
			encode(Object.assign({}, CANONICAL_DEFINITION, { format: 3 }))
		).to.throw();
		expect(() =>
			encode(Object.assign({}, CANONICAL_DEFINITION, { format: [1] }))
		).to.throw();
	});

	it("should throw an error when heroes is not an array", () => {
		expect(() =>
			encode(Object.assign({}, CANONICAL_DEFINITION, { heroes: 42 }))
		).to.throw();
		expect(() =>
			encode(Object.assign({}, CANONICAL_DEFINITION, { heroes: "[]" }))
		).to.throw();
	});

	it("should throw an error when heroes contains an invalid dbf id", () => {
		expect(() =>
			encode(Object.assign({}, CANONICAL_DEFINITION, { heroes: ["a"] }))
		).to.throw();
		expect(() =>
			encode(
				Object.assign({}, CANONICAL_DEFINITION, { heroes: [42, "a"] })
			)
		).to.throw();
		expect(() =>
			encode(
				Object.assign({}, CANONICAL_DEFINITION, { heroes: [42, "1"] })
			)
		).to.throw();
		expect(() =>
			encode(Object.assign({}, CANONICAL_DEFINITION, { heroes: [-42] }))
		).to.throw();
	});

	it("should throw an error when cards is not an array", () => {
		expect(() =>
			encode(Object.assign({}, CANONICAL_DEFINITION, { cards: 2 }))
		).to.throw();
		expect(() =>
			encode(Object.assign({}, CANONICAL_DEFINITION, { cards: "[]" }))
		).to.throw();
	});

	it("should throw an error when cards contains a non-tuples", () => {
		expect(() =>
			encode(Object.assign({}, CANONICAL_DEFINITION, { cards: [3] }))
		).to.throw();
		expect(() =>
			encode(
				Object.assign({}, CANONICAL_DEFINITION, { cards: [[1, 2], 3] })
			)
		).to.throw();
		expect(() =>
			encode(Object.assign({}, CANONICAL_DEFINITION, { cards: ["a"] }))
		).to.throw();
		expect(() =>
			encode(
				Object.assign({}, CANONICAL_DEFINITION, { cards: [[1, "a"]] })
			)
		).to.throw();
		expect(() =>
			encode(
				Object.assign({}, CANONICAL_DEFINITION, { cards: [["a", 1]] })
			)
		).to.throw();
	});

	it("should throw an error when cards contains an invalid dbf id", () => {
		expect(() =>
			encode(
				Object.assign({}, CANONICAL_DEFINITION, { cards: [[-4, 1]] })
			)
		).to.throw();
		expect(() =>
			encode(
				Object.assign({}, CANONICAL_DEFINITION, { cards: [[NaN, 1]] })
			)
		).to.throw();
		expect(() =>
			encode(
				Object.assign({}, CANONICAL_DEFINITION, {
					cards: [[Infinity, 1]],
				})
			)
		).to.throw();
	});

	it("should throw an error when cards contains an invalid count", () => {
		expect(() =>
			encode(
				Object.assign({}, CANONICAL_DEFINITION, { cards: [[1, -5]] })
			)
		).to.throw();
		expect(() =>
			encode(
				Object.assign({}, CANONICAL_DEFINITION, { cards: [[1, NaN]] })
			)
		).to.throw();
		expect(() =>
			encode(
				Object.assign({}, CANONICAL_DEFINITION, {
					cards: [[1, Infinity]],
				})
			)
		).to.throw();
	});
});

describe("#decode", () => {
	it("should throw an error when the parameter is an empty string", () => {
		expect(() => decode("")).to.throw();
	});

	it("should throw an error when the parameter is an invalid deckstring", () => {
		expect(() => decode("123abc")).to.throw();
	});

	describe("with a canonical deckstring", () => {
		let result;

		before("should decode without an error", () => {
			result = decode(CANONICAL_DECKSTRING);
		});

		it("should return an object", () => {
			expect(result).to.be.a("object");
		});

		it("should return the expected deck definition", () => {
			expect(JSON.stringify(result)).to.equal(
				JSON.stringify(CANONICAL_DEFINITION)
			);
		});

		it("should return a numeric format", () => {
			expect(result.format).to.be.a("number");
		});

		it("should return a list of cards", () => {
			expect(result.cards).to.be.a("array");
		});

		it("should return a list of heroes", () => {
			expect(result.heroes).to.be.a("array");
		});

		it("should return the encoded format", () => {
			expect(result.format).to.equal(CANONICAL_DEFINITION.format);
		});

		it("should contain the encoded hero", () => {
			expect(result.cards).to.have.deep.members(
				CANONICAL_DEFINITION.cards
			);
		});

		it("should contain the encoded cards", () => {
			expect(result.cards).to.have.deep.members(
				CANONICAL_DEFINITION.cards
			);
		});
	});

	describe("with a non-canonical deckstring", () => {
		let result;

		before("should decode without an error", () => {
			result = decode(NONCANONICAL_DECKSTRING);
		});

		it("should return an object", () => {
			expect(result).to.be.a("object");
		});

		it("should return the expected deck definition", () => {
			expect(JSON.stringify(result)).to.equal(
				JSON.stringify(CANONICAL_DEFINITION)
			);
		});
	});
});
