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

const CANONICAL_SIDEBOARD_DECKSTRING = 
	"AAECAfHhBALLpQX9xAUO9eME/OME/uMEguQEseYEueYE0e0E2fEEl/YE4PYEsvcEtIAFqIEFrqEFAAEDs/cE/cQFtPcE/cQFzKUF/cQFAAA=";

const CANONICAL_SIDEBOARD_DEFINITION = {
	cards: [
		[ 78325, 2 ], 	// Frost Strike
		[ 78332, 2 ], 	// Heart Strike
	    [ 78334, 2 ], 	// Icy Touch
	    [ 78338, 2 ], 	// Horn of Winter
	    [ 78641, 2 ], 	// Noxious Cadaver
	    [ 78649, 2 ], 	// Deathchiller
	    [ 79569, 2 ], 	// Defrost
	    [ 80089, 2 ], 	// Acolyte of Death
	    [ 80663, 2 ], 	// Vicious Bloodworm
	    [ 80736, 2 ], 	// Runeforging
	    [ 80818, 2 ], 	// Body Bagger
	    [ 81972, 2 ], 	// Harbinger of Winter
	    [ 82088, 2 ], 	// Obliterate
	    [ 86190, 2 ], 	// Skeletal Sidekick
	    [ 86731, 1 ], 	// Thassarian
	    [ 90749, 1 ]  	// E.T.C., Band Manager
	], // pairs of [dbfid, count], by ascending dbfId
	heroes: [78065], // The Lich King
	format: FormatType.FT_STANDARD, // 1 for Wild, 2 for Standard
	sideboard: [
		[ 80819, 1, 90749 ], // Gnome Muncher
		[ 80820, 1, 90749 ], // Corpse Bride
		[ 86732, 1, 90749 ]  // Overseer Frigidara
	], // [dbfid, count, parentDbfid] by ascending dbfId
};

const NONCANONICAL_SIDEBOARD_DEFINITION = Object.assign({}, CANONICAL_SIDEBOARD_DEFINITION, {
	cards: CANONICAL_SIDEBOARD_DEFINITION.cards.slice(),
	heroes: CANONICAL_SIDEBOARD_DEFINITION.heroes.slice(),
	sideboard: CANONICAL_SIDEBOARD_DEFINITION.sideboard.slice(),
});

[
	NONCANONICAL_SIDEBOARD_DEFINITION.sideboard[0],
	NONCANONICAL_SIDEBOARD_DEFINITION.sideboard[1],
	NONCANONICAL_SIDEBOARD_DEFINITION.sideboard[2],
] = [
	NONCANONICAL_SIDEBOARD_DEFINITION.sideboard[2],
	NONCANONICAL_SIDEBOARD_DEFINITION.sideboard[1],
	NONCANONICAL_SIDEBOARD_DEFINITION.sideboard[0],
];

const CLASSIC_DECKSTRING =
	"AAEDAaa4AwTTlQSvlgT6oASPowQN25UE3JUEppYEsJYEtpYEvZYE1JYE3ZYE6aEE8KEE8aEE86EE1KIEAA==";

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
	heroes: [56358], // Elise Starseeker
	format: FormatType.FT_CLASSIC, // 1 for Wild, 2 for Standard
};

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

	describe("with a canonical deck definition, including a sideboard", () => {
		let result;

		before("should encode without an error", () => {
			result = encode(CANONICAL_SIDEBOARD_DEFINITION);
		});

		it("should return a string", () => {
			expect(result).to.be.a("string");
		});

		it("should return the expected deckstring", () => {
			expect(result).to.equal(CANONICAL_SIDEBOARD_DECKSTRING);
		});
	});

	describe("with a non-canonical deck definition, including a sideboard", () => {
		let result;

		before("should encode without an error", () => {
			result = encode(NONCANONICAL_SIDEBOARD_DEFINITION);
		});

		it("should return a string", () => {
			expect(result).to.be.a("string");
		});

		it("should return the expected deckstring", () => {
			expect(result).to.equal(CANONICAL_SIDEBOARD_DECKSTRING);
		});
	});

	describe("with a classic deck definition", () => {
		let result;

		before("should encode without an error", () => {
			result = encode(CLASSIC_DEFINITION);
		});

		it("should return a string", () => {
			expect(result).to.be.a("string");
		});

		it("should return the expected deckstring", () => {
			expect(result).to.equal(CLASSIC_DECKSTRING);
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

	it("should throw an error when format is not 1, 2 or 3", () => {
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

	describe("with a canonical deckstring, including a sideboard", () => {
		let result;

		before("should decode without an error", () => {
			result = decode(CANONICAL_SIDEBOARD_DECKSTRING);
		});

		it("should return an object", () => {
			expect(result).to.be.a("object");
		});

		it("should return the expected deck definition", () => {
			expect(JSON.stringify(result)).to.equal(
				JSON.stringify(CANONICAL_SIDEBOARD_DEFINITION)
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

		it("should return a list of sideboard cards", () => {
			expect(result.sideboard).to.be.a("array");
		});

		it("should return the encoded format", () => {
			expect(result.format).to.equal(CANONICAL_SIDEBOARD_DEFINITION.format);
		});

		it("should contain the encoded hero", () => {
			expect(result.heroes).to.have.deep.members(
				CANONICAL_SIDEBOARD_DEFINITION.heroes
			);
		});

		it("should contain the encoded cards", () => {
			expect(result.cards).to.have.deep.members(
				CANONICAL_SIDEBOARD_DEFINITION.cards
			);
		});

		it("should contain the encoded sideboard", () => {
			expect(result.sideboard).to.have.deep.members(
				CANONICAL_SIDEBOARD_DEFINITION.sideboard
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

	describe("with a classic deckstring", () => {
		let result;

		before("should decode without an error", () => {
			result = decode(CLASSIC_DECKSTRING);
		});

		it("should return an object", () => {
			expect(result).to.be.a("object");
		});

		it("should return the expected deck definition", () => {
			expect(JSON.stringify(result)).to.equal(
				JSON.stringify(CLASSIC_DEFINITION)
			);
		});
	});
});
