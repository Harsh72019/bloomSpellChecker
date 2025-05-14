// buildDict.js
const fs = require('fs');
const BloomFilter = require('./bloomFilter');

const [,, dictPath, outputPath = 'words.bf'] = process.argv;
if (!dictPath) {
  console.error('Usage: node buildDict.js <dict.txt> [output.bf]');
  process.exit(1);
}

console.log(`Reading dictionary from ${dictPath}...`);
const words = fs.readFileSync(dictPath, 'utf8')
  .split('\n')
  .map(word => word.trim())
  .filter(Boolean);

console.log(`Found ${words.length} words in dictionary`);

const bloom = new BloomFilter(words.length, 0.01);

console.log('Building bloom filter...');
for (const word of words) {
  bloom.insert(word.toLowerCase());
}

console.log(`Saving bloom filter to ${outputPath}...`);
bloom.saveToFile(outputPath);

console.log('\nBloom Filter Statistics:');
console.log(`Words inserted: ${words.length}`);
console.log(`Bit array size: ${bloom.size} bits (${Math.ceil(bloom.size / 8)} bytes)`);
console.log(`Hash functions: ${bloom.hashCount}`);
console.log(`Output file size: ${fs.statSync(outputPath).size} bytes`);

