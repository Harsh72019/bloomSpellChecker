const fs = require("fs");
const crypto = require("crypto");

class BloomFilter {
  constructor(expectedItems, falsePositiveRate) {
    this.size = this._calculateBitArraySize(expectedItems, falsePositiveRate);
    this.hashCount = this._calculateHashFunctions(this.size, expectedItems);
    this.bitArray = Buffer.alloc(Math.ceil(this.size / 8));
  }

  _calculateBitArraySize(n, p) {
    return Math.ceil((-n * Math.log(p)) / Math.log(2) ** 2);
  }

  _calculateHashFunctions(m, n) {
    return Math.round((m / n) * Math.log(2));
  }

  _hashes(item) {
    const results = [];
    const itemStr = String(item);

    const baseHash = crypto.createHash("sha256").update(itemStr).digest();

    for (let i = 0; i < this.hashCount; i++) {
      const h1 = baseHash.readUInt32BE(i % 28);
      const h2 = baseHash.readUInt32BE((i + 4) % 28);

      const combinedHash = (h1 + i * h2) % this.size;
      results.push(combinedHash);
    }

    return results;
  }

  insert(item) {
    const indexes = this._hashes(item);
    for (const i of indexes) {
      this.bitArray[Math.floor(i / 8)] |= 1 << i % 8;
    }
  }

  contains(item) {
    const indexes = this._hashes(item);
    return indexes.every(
      (i) => (this.bitArray[Math.floor(i / 8)] & (1 << i % 8)) !== 0
    );
  }

  saveToFile(path) {
    const header = Buffer.alloc(12);
    header.write("CCBF", 0, 4); 
    header.writeUInt16BE(1, 4); 
    header.writeUInt16BE(this.hashCount, 6);
    header.writeUInt32BE(this.size, 8);

    fs.writeFileSync(path, Buffer.concat([header, this.bitArray]));
  }

  static loadFromFile(path) {
    const data = fs.readFileSync(path);

    if (data.slice(0, 4).toString() !== "CCBF") {
      throw new Error("Invalid file format - missing CCBF signature");
    }

    const version = data.readUInt16BE(4);
    if (version !== 1) {
      throw new Error(`Unsupported version: ${version}`);
    }

    const hashCount = data.readUInt16BE(6);
    const size = data.readUInt32BE(8);
    const bitArray = data.slice(12);

    const filter = new BloomFilter(1, 0.1); 
    filter.size = size;
    filter.hashCount = hashCount;
    filter.bitArray = bitArray;

    return filter;
  }
}

module.exports = BloomFilter;
