import * as varint from "varint";
import * as atob from "atob";
import * as btoa from "btoa";

/** @internal */
export class Iterator {
	index: number;

	constructor() {
		this.index = 0;
	}

	public next(repeat = 1): void {
		this.index += repeat;
	}
}

/** @internal */
export class BufferWriter extends Iterator {
	buffer: any;

	constructor() {
		super();
		this.buffer = [];
	}

	public null(): void {
		this.buffer[this.index] = 0;
		this.next();
	}

	public varint(value: number): void {
		varint.encode(value, this.buffer, this.index);
		this.next(varint.encode.bytes);
	}

	public toString() {
		const buffer = String.fromCharCode(...this.buffer);
		return btoa(buffer);
	}
}

/** @internal */
export class BufferReader extends Iterator {
	buffer: any;

	constructor(string: any) {
		super();
		const binary = atob(string);
		const buffer = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i++) {
			buffer[i] = binary.charCodeAt(i)
		}
		this.buffer = buffer;
	}

	public nextByte(): number {
		const value = this.buffer[this.index];
		this.next();
		return value;
	}

	public nextVarint(): number {
		const value = varint.decode(this.buffer, this.index);
		this.next(varint.decode.bytes);
		return value;
	}
}
