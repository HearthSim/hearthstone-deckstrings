const {encode, decode} = require("../dist/index");
const {expect} = require("chai");

const EXAMPLE_DECKSTRING = "AAECAR8GxwPJBLsFmQfZB/gIDI0B2AGoArUDhwSSBe0G6wfbCe0JgQr+DAA=";

const EXAMPLE_DEFINITION = {
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
		[1003, 2], // Houndmaster
		[985, 1], // Dire Wolf Alpha
		[1144, 1], // King Crush
		[1243, 2], // Unleash the Hounds
		[1261, 2], // Savannah Highmane
		[1281, 2], // Scavenging Hyena
		[1662, 2], // Eaglehorn Bow
	], // pairs of dbfid and count
	heroes: [31], // Rexxar
	format: 2, // 1 for Wild, 2 for Standard
};

describe("#encode", () => {

	describe("with a valid deck definition", () => {
		let result;

		before("should encode without an error", () => {
			result = encode(EXAMPLE_DEFINITION);
		});

		it("should return the expected deckstring", () => {
			expect(result).to.equal(EXAMPLE_DECKSTRING);
		});
	});

	it("should throw an error with an invalid deck definition", () => {
		expect(() => encode(477)).to.throw();
		expect(() => encode("somestring")).to.throw();
		expect(() => encode([1, 2, 3])).to.throw();
	});
});

describe("#decode", () => {

	it("should throw an error when the parameter is an empty string", () => {
		expect(() => decode("")).to.throw();
	});

	it("should throw an error when the parameter is an invalid deckstring", () => {
		expect(() => decode("123abc")).to.throw();
	});

	describe("with a valid deckstring", () => {
		let result;

		before("should decode without an error", () => {
			result = decode(EXAMPLE_DECKSTRING);
		});

		it("should return an object", () => {
			expect(result).to.be.a("object");
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
			expect(result.format).to.equal(EXAMPLE_DEFINITION.format);
		});

		it("should contain the encoded hero", () => {
			expect(result.cards).to.have.deep.members(EXAMPLE_DEFINITION.cards);
		});

		it("should contain the encoded cards", () => {
			expect(result.cards).to.have.deep.members(EXAMPLE_DEFINITION.cards);
		});
	});
});
