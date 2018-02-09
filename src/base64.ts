/** @internal */
function atob_binary(encoded: string) {
	/*#if _PLATFORM === "browser"
		return atob(encoded);
	//#else */
	return Buffer.from(encoded, "base64").toString("binary");
	//#endif
}

/** @internal */
function btoa_binary(decoded: string) {
	/*#if _PLATFORM === "browser"
		return btoa(decoded);
	//#else */
	return Buffer.from(decoded.toString(), "binary").toString("base64");
	//#endif
}

export { atob_binary as atob, btoa_binary as btoa };
