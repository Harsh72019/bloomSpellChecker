const BloomFilter = require('./bloomFilter');
const [,, ...words] = process.argv;

if (!words.length) {
  console.error('Usage: node ccSpellCheck.js word1 word2 ...');
  process.exit(1);
}

try {
  console.log('Loading bloom filter from words.bf...');
  const bloom = BloomFilter.loadFromFile('words.bf');
  console.log(`Loaded bloom filter with ${bloom.size} bits and ${bloom.hashCount} hash functions`);

  console.log('\nChecking words:');
  const results = words.map(word => {
    const normalizedWord = word.toLowerCase().trim();
    const isCorrect = bloom.contains(normalizedWord);
    return { word, isCorrect };
  });

  const misspelled = results.filter(r => !r.isCorrect).map(r => r.word);
  
  console.log('\nResults:');
  results.forEach(({ word, isCorrect }) => {
    console.log(`- "${word}": ${isCorrect ? 'probably correct ✓' : 'definitely misspelled ✗'}`);
  });
  
  if (misspelled.length === 0) {
    console.log('\nAll words are probably correct.');
  } else {
    console.log('\nThese words are possibly misspelled:');
    misspelled.forEach(word => console.log(` - ${word}`));
  }
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}