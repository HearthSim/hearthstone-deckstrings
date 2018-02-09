import varint from "varint";
import { atob, btoa } from "./base64";

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
	buffer: number[];

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
		const binary = String.fromCharCode(...this.buffer);
		return btoa(binary);
	}
}

/** @internal */
export class BufferReader extends Iterator {
	buffer: Uint8Array;

	constructor(string: any) {
		super();
		const binary = atob(string);
		const buffer = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i++) {
			buffer[i] = binary.charCodeAt(i);
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
