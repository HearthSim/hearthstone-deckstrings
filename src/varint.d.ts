declare module "varint" {
	export var encode: {
		(num: number, out?: ArrayLike<number>, offset?: number): any;
		bytes: number;
	};
	export var decode: {
		(buf: ArrayLike<number>, offset?: number): any;
		bytes: number;
	};
	export function encodingLength(value: number): number;
}
