/* 
	BitSet is associated with each vertex and is used to store the indices of the vertices that are reachable.
	In other words, all the vertices causally before in the hashgraph.
	When processing in the topologically ordered manner, we set the BitSet of the vertex to the bitwise OR of the BitSet of its dependencies.
	Then, to check if two vertices are causally related, we check if the BitSet of the first vertex contains the index of the second vertex and vice-versa.
	Algorithm for more optimal causality check inspired by https://stackoverflow.com/a/78133041
*/
export class BitSet {
	private data: Uint32Array;

	constructor(size = 1) {
		// Always start with size 32
		this.data = new Uint32Array(size);
	}

	clear(): void {
		this.data = new Uint32Array(this.data.length);
	}

	set(index: number, value: boolean): void {
		// (index / 32) | 0 is equivalent to Math.floor(index / 32)
		const byteIndex = (index / 32) | 0;
		const bitIndex = index % 32;
		// if value is false, and with all 1s except the bit at bitIndex
		if (value) this.data[byteIndex] |= 1 << bitIndex;
		else this.data[byteIndex] &= ~(1 << bitIndex);
	}

	get(index: number): boolean {
		// (index / 32) | 0 is equivalent to Math.floor(index / 32)
		const byteIndex = (index / 32) | 0;
		const bitIndex = index % 32;
		return (this.data[byteIndex] & (1 << bitIndex)) !== 0;
	}

	flip(index: number): void {
		// (index / 32) | 0 is equivalent to Math.floor(index / 32)
		const byteIndex = (index / 32) | 0;
		const bitIndex = index % 32;
		this.data[byteIndex] ^= 1 << bitIndex;
	}

	// AND two bitsets of the same size
	and(other: BitSet): BitSet {
		const result = new BitSet(this.data.length);
		for (let i = 0; i < this.data.length; i++) {
			result.data[i] = this.data[i] & other.data[i];
		}
		return result;
	}

	// OR two bitsets of the same size
	or(other: BitSet): BitSet {
		const result = new BitSet(this.data.length);
		for (let i = 0; i < this.data.length; i++) {
			result.data[i] = this.data[i] | other.data[i];
		}
		return result;
	}

	// XOR two bitsets of the same size
	xor(other: BitSet): BitSet {
		const result = new BitSet(this.data.length);
		for (let i = 0; i < this.data.length; i++) {
			result.data[i] = this.data[i] ^ other.data[i];
		}
		return result;
	}

	not(): BitSet {
		const result = new BitSet(this.data.length * 32);
		for (let i = 0; i < this.data.length; i++) {
			result.data[i] = ~this.data[i];
		}
		return result;
	}

	toString(): string {
		return Array.from(this.data)
			.reverse()
			.map((int) => int.toString(2).padStart(32, "0"))
			.join("");
	}

	findNext(index: number, bit: number): number {
		let byteIndex = (index / 32) | 0;
		let bitIndex = index % 32;
		let mask = 1 << bitIndex;
		while (byteIndex < this.data.length) {
			while (bitIndex < 32) {
				if ((this.data[byteIndex] & mask) === bit)
					return byteIndex * 32 + bitIndex;
				mask <<= 1;
				bitIndex++;
			}
			byteIndex++;
			bitIndex = 0;
			mask = 1;
		}
		return -1;
	}
}
