# Bloom Filter Spell Checker

A lightweight and efficient spell checker implementation using Bloom filters for Node.js. This project demonstrates probabilistic data structures for fast membership testing with minimal memory requirements.

## 📖 Overview

This spell checker uses a Bloom filter to determine if a word is likely in a dictionary. Bloom filters are space-efficient probabilistic data structures that can tell you:
- "No, the element is definitely not in the set" (100% accurate)
- "Yes, the element is probably in the set" (small chance of false positives)

The benefit is extremely low memory usage compared to storing the full dictionary.

## 🚀 Features

- Memory-efficient dictionary storage using Bloom filters
- Fast lookups with O(k) time complexity where k is the number of hash functions
- Configurable false positive rate
- Persistent filter storage
- Simple CLI interface

## 📦 Installation

1. Clone this repository:
   ```
   git clone https://github.com/Harsh72019/bloomSpellChecker.git
   cd bloomSpellChecker
   ```

2. Make sure you have Node.js installed (version 12.x or higher recommended)

3. No additional dependencies are required as this project uses only built-in Node.js modules.

## 🔧 Usage

### Creating a Dictionary

1. Prepare a text file with dictionary words, one per line:
   ```
   hello
   world
   programming
   javascript
   ```

2. Build the Bloom filter:
   ```
   node buildDict.js dict.txt [output.bf]
   ```
   
   If you don't specify an output file, it defaults to `words.bf`.

### Checking Words

Check words against your dictionary:
```
node ccSpellCheck.js word1 word2 word3 ...
```

Example:
```
node ccSpellCheck.js hello hoi world
```

Output:
```
Loading bloom filter from words.bf...
Loaded bloom filter with 192 bits and 7 hash functions

Checking words:

Results:
- "hello": probably correct ✓
- "hoi": possibly misspelled ✗
- "world": probably correct ✓

These words are possibly misspelled:
 - hoi
```

## 🔍 How It Works

![Bloom Filter Diagram](https://example.com/bloom-filter-diagram.png)

1. **Dictionary Creation**
   - Calculate optimal bit array size based on expected items and desired false positive rate
   - Calculate optimal number of hash functions
   - For each word, compute k hash values and set corresponding bits
   - Save the filter to a binary file

2. **Word Checking**
   - Load the Bloom filter from file
   - For each input word, compute the same k hash values
   - If ALL bits at those positions are 1, the word is probably correct
   - If ANY bit is 0, the word is definitely misspelled

## 📁 File Structure

```
├── bloomFilter.js - The core Bloom filter implementation
├── buildDict.js   - Dictionary builder utility 
├── ccSpellCheck.js - Word checking utility
├── dict.txt       - Example dictionary file
└── words.bf       - Generated Bloom filter (binary)
```

## 🧮 Technical Details

### Bloom Filter File Format

The `words.bf` file uses a simple binary format:

| Bytes | Content | Description |
|-------|---------|-------------|
| 0-3   | 'CCBF'  | Magic number/signature |
| 4-5   | 1       | Version number (16-bit) |
| 6-7   | k       | Number of hash functions (16-bit) |
| 8-11  | m       | Bit array size (32-bit) |
| 12+   | data    | Bit array data |

### Memory Usage

A Bloom filter for a dictionary of 100,000 words with a 1% false positive rate requires only about 120 KB of memory, compared to several megabytes for storing the full dictionary.

### False Positive Rate

The false positive rate is configurable when creating the filter. A lower rate requires more memory but reduces the chance of incorrectly marking a misspelled word as correct.

## ⚙️ Advanced Configuration

When creating a new Bloom filter, you can adjust the false positive rate:

```javascript
// For a very strict 0.1% false positive rate
const bloom = new BloomFilter(words.length, 0.001);

// For a more lenient 5% false positive rate (saves memory)
const bloom = new BloomFilter(words.length, 0.05);
```

## 📝 License

MIT License - feel free to use, modify, and distribute this code.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📊 Performance Benchmarks

| Dictionary Size | False Positive Rate | Memory Usage | Build Time | Lookup Time |
|-----------------|---------------------|--------------|------------|-------------|
| 1,000 words     | 1%                  | ~1.2 KB      | <10ms      | <0.1ms      |
| 10,000 words    | 1%                  | ~12 KB       | ~50ms      | <0.1ms      |
| 100,000 words   | 1%                  | ~120 KB      | ~500ms     | <0.1ms      |
| 1,000,000 words | 1%                  | ~1.2 MB      | ~5s        | <0.1ms      |
