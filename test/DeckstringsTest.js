/*#if _PLATFORM === "browser"
import { decode, encode, FormatType } from "../dist/browser.mjs";
//#else */
const { decode, encode, FormatType } = require("../dist/index");
const { expect } = require("chai");
//#endif

const CANONICAL_DECKSTRING =
	"AAECAR8GxwPJBLsFmQfZB/gIDI0B2AGoArUDhwSSBe0G6wfbCe0JgQr+DAAA";

const NONCANONICAL_DECKSTRING =
	"AAECAR8GxwPJBLsFmQfZB/gIDJIF2AGoArUDhwSNAe0G6wfbCe0JgQr+DAAA";

const PRESIDEBOARD_DECKSTRING =
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
	sideboardCards: [],
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

const CLASSIC_DECKSTRING =
	"AAEDAaa4AwTTlQSvlgT6oASPowQN25UE3JUEppYEsJYEtpYEvZYE1JYE3ZYE6aEE8KEE8aEE86EE1KIEAAA=";

const CLASSIC_DEFINITION = {
	cards: [
		[68307, 1],
		[68315, 2],
		[68316, 2],
		[68390, 2],
		[68399, 1],
		[68400, 2],
		[68406, 2],
		[68413, 2],
		[68436, 2],
		[68445, 2],
		[69754, 1],
		[69865, 2],
		[69872, 2],
		[69873, 2],
		[69875, 2],
		[69972, 2],
		[70031, 1],
	], // pairs of [dbfid, count], by ascending dbfId
	sideboardCards: [],
	heroes: [56358], // Elise Starseeker
	format: FormatType.FT_CLASSIC, // 1 for Wild, 2 for Standard
};

const SIDEBOARD_DECKSTRING =
	"AAEBAZCaBgjlsASotgSX7wTvkQXipAX9xAXPxgXGxwUQvp8EobYElrcE+dsEuNwEutwE9vAEhoMFopkF4KQFlMQFu8QFu8cFuJ4Gz54G0Z4GAAED8J8E/cQFuNkE/cQF/+EE/cQFAAA=";

const SIDEBOARD_DEFINITION = {
	cards: [
		[69566, 2],
		[71781, 1],
		[72481, 2],
		[72488, 1],
		[72598, 2],
		[77305, 2],
		[77368, 2],
		[77370, 2],
		[79767, 1],
		[79990, 2],
		[82310, 2],
		[84207, 1],
		[85154, 2],
		[86624, 2],
		[86626, 1],
		[90644, 2],
		[90683, 2],
		[90749, 1],
		[90959, 1],
		[91067, 2],
		[91078, 1],
		[102200, 2],
		[102223, 2],
		[102225, 2],
	],
	sideboardCards: [
		[69616, 1, 90749],
		[76984, 1, 90749],
		[78079, 1, 90749],
	],
	heroes: [101648], // Hedanis
	format: 1,
};

describe("encode", () => {
	describe("with a canonical deck definition", () => {
		let result;

		before("encodes without an error", () => {
			result = encode(CANONICAL_DEFINITION);
		});

		it("returns a string", () => {
			expect(result).to.be.a("string");
		});

		it("returns the expected deckstring", () => {
			expect(result).to.equal(CANONICAL_DECKSTRING);
		});
	});

	describe("with a non-canonical deck definition", () => {
		let result;

		before("encodes without an error", () => {
			result = encode(NONCANONICAL_DEFINITION);
		});

		it("returns a string", () => {
			expect(result).to.be.a("string");
		});

		it("returns the expected deckstring", () => {
			expect(result).to.equal(CANONICAL_DECKSTRING);
		});
	});

	describe("with a classic deck definition", () => {
		let result;

		before("encodes without an error", () => {
			result = encode(CLASSIC_DEFINITION);
		});

		it("returns a string", () => {
			expect(result).to.be.a("string");
		});

		it("returns the expected deckstring", () => {
			expect(result).to.equal(CLASSIC_DECKSTRING);
		});
	});

	describe("with a sideboard deck definition", () => {
		let result;

		before("encodes without an error", () => {
			result = encode(SIDEBOARD_DEFINITION);
		});

		it("returns a string", () => {
			expect(result).to.be.a("string");
		});

		it("returns the expected deckstring", () => {
			expect(result).to.equal(SIDEBOARD_DECKSTRING);
		});
	});

	it("throws an error with an invalid deck definition", () => {
		expect(() => encode(477)).to.throw();
		expect(() => encode("somestring")).to.throw();
		expect(() => encode([1, 2, 3])).to.throw();
		expect(() =>
			encode(Object.assign({}, CANONICAL_DEFINITION, { heroes: null }))
		).to.throw();
	});

	it("throws an error when format is not 1, 2 or 3", () => {
		expect(() =>
			encode(Object.assign({}, CANONICAL_DEFINITION, { format: "1" }))
		).to.throw();
		expect(() =>
			encode(Object.assign({}, CANONICAL_DEFINITION, { format: 4 }))
		).to.throw();
		expect(() =>
			encode(Object.assign({}, CANONICAL_DEFINITION, { format: [1] }))
		).to.throw();
	});

	it("throws an error when heroes is not an array", () => {
		expect(() =>
			encode(Object.assign({}, CANONICAL_DEFINITION, { heroes: 42 }))
		).to.throw();
		expect(() =>
			encode(Object.assign({}, CANONICAL_DEFINITION, { heroes: "[]" }))
		).to.throw();
	});

	it("throws an error when heroes contains an invalid dbf id", () => {
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

	it("throws an error when cards is not an array", () => {
		expect(() =>
			encode(Object.assign({}, CANONICAL_DEFINITION, { cards: 2 }))
		).to.throw();
		expect(() =>
			encode(Object.assign({}, CANONICAL_DEFINITION, { cards: "[]" }))
		).to.throw();
	});

	it("throws an error when cards contains a non-tuples", () => {
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

	it("throws an error when cards contains an invalid dbf id", () => {
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

	it("throws an error when cards contains an invalid count", () => {
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

describe("decode", () => {
	it("throws an error when the parameter is an empty string", () => {
		expect(() => decode("")).to.throw();
	});

	it("throws an error when the parameter is an invalid deckstring", () => {
		expect(() => decode("123abc")).to.throw();
	});

	describe("with a canonical deckstring", () => {
		let result;

		before("decodes without an error", () => {
			result = decode(CANONICAL_DECKSTRING);
		});

		it("returns an object", () => {
			expect(result).to.be.a("object");
		});

		it("returns the expected deck definition", () => {
			expect(JSON.stringify(result)).to.equal(
				JSON.stringify(CANONICAL_DEFINITION)
			);
		});

		it("returns a numeric format", () => {
			expect(result.format).to.be.a("number");
		});

		it("returns a list of cards", () => {
			expect(result.cards).to.be.a("array");
		});

		it("returns a list of heroes", () => {
			expect(result.heroes).to.be.a("array");
		});

		it("returns the encoded format", () => {
			expect(result.format).to.equal(CANONICAL_DEFINITION.format);
		});

		it("contains the encoded hero", () => {
			expect(result.cards).to.have.deep.members(
				CANONICAL_DEFINITION.cards
			);
		});

		it("contains the encoded cards", () => {
			expect(result.cards).to.have.deep.members(
				CANONICAL_DEFINITION.cards
			);
		});
	});

	describe("with a non-canonical deckstring", () => {
		let result;

		before("decodes without an error", () => {
			result = decode(NONCANONICAL_DECKSTRING);
		});

		it("returns an object", () => {
			expect(result).to.be.a("object");
		});

		it("returns the expected deck definition", () => {
			expect(JSON.stringify(result)).to.equal(
				JSON.stringify(CANONICAL_DEFINITION)
			);
		});
	});

	describe("with a pre-sideboard deckstring", () => {
		let result;

		before("decodes without an error", () => {
			result = decode(PRESIDEBOARD_DECKSTRING);
		});

		it("returns an object", () => {
			expect(result).to.be.a("object");
		});

		it("returns the expected deck definition", () => {
			expect(JSON.stringify(result)).to.equal(
				JSON.stringify(CANONICAL_DEFINITION)
			);
		});
	});

	describe("with a classic deckstring", () => {
		let result;

		before("decodes without an error", () => {
			result = decode(CLASSIC_DECKSTRING);
		});

		it("returns an object", () => {
			expect(result).to.be.a("object");
		});

		it("returns the expected deck definition", () => {
			expect(JSON.stringify(result)).to.equal(
				JSON.stringify(CLASSIC_DEFINITION)
			);
		});
	});

	describe("with a sideboard deckstring", () => {
		let result;

		before("decodes without an error", () => {
			result = decode(SIDEBOARD_DECKSTRING);
		});

		it("returns an object", () => {
			expect(result).to.be.a("object");
		});

		it("returns the expected deck definition", () => {
			expect(JSON.stringify(result)).to.equal(
				JSON.stringify(SIDEBOARD_DEFINITION)
			);
		});
	});
});

describe("end-to-end", () => {
	[
		CANONICAL_DECKSTRING,
		CLASSIC_DECKSTRING,
		"AAEDAf0EArOWBLWhBA7hlQTilQTllQTmlQTolQShlgTplgT0oAS9oQTVoQSTogSgowS/owTDowQAAA==",
	].forEach((value, index) => {
		it(`reencodes deckstring #${index + 1}`, () => {
			expect(encode(decode(value))).to.equal(value);
		});
	});

	it("runs the README.md example", () => {
		const deck = {
			cards: [
				[1, 2],
				[2, 2],
				[3, 2],
				[4, 1],
			], // [dbfId, count] pairs
			sideboardCards: [[5, 1, 90749]],
			heroes: [7], // Garrosh Hellscream
			format: FormatType.FT_WILD,
		};

		const deckstring = encode(deck);
		const decoded = decode(deckstring);
		expect(JSON.stringify(decoded)).to.equal(JSON.stringify(deck));
	});
});
