const fs = require('fs');
const path = require('path');

const wordsFile = path.join(__dirname, '../data/common-10k.txt');
const wordsText = fs.readFileSync(wordsFile, 'utf-8');
const wordsList = wordsText
  .split('\n')
  .map((w) => w.trim())
  .filter((w) => w.length > 1 && w.length < 30);

console.log(`Loaded ${wordsList.length} words from common-10k.txt`);

function getDifficulty(word, index) {
  if (index < 1000) return 'beginner';
  if (index < 5000) return 'intermediate';
  return 'advanced';
}

function getCategory(word) {
  const categories = ['common', 'action', 'descriptive', 'abstract', 'noun', 'verb', 'adjective'];
  return categories[Math.floor(Math.random() * categories.length)];
}

function getTags(word) {
  const tags = [];
  if (word.length < 4) tags.push('short');
  if (word.length > 10) tags.push('long');
  if (word.endsWith('ing')) tags.push('action');
  if (word.endsWith('ed')) tags.push('past');
  if (word.endsWith('tion')) tags.push('formal');
  if (word.endsWith('ly')) tags.push('adverb');
  tags.push('common');
  return [...new Set(tags)];
}

function getDefinition(word) {
  const defs = {
    the: 'Used when referring to someone or something already mentioned',
    and: 'Used to connect words, phrases, or clauses',
    a: 'The indefinite article used before consonant sounds',
    to: 'Expressing motion or direction toward a point',
    of: 'Belonging to; associated with',
    in: 'Expressing the location or position of something',
    is: 'Third person singular present of be',
    you: 'The person being addressed',
    that: 'Referring to a person or thing already mentioned',
    it: 'Used to refer to an animal or thing previously mentioned',
  };
  return defs[word] || `Definition for "${word}" - a common English word.`;
}

console.log('Converting to structured format...');
const structuredWords = wordsList.slice(0, 10000).map((word, index) => ({
  id: `${word}-${index}`,
  word,
  definition: getDefinition(word),
  partOfSpeech: 'noun',
  pronunciation: '',
  example: `Example with the word "${word}".`,
  difficulty: getDifficulty(word, index),
  category: getCategory(word),
  tags: getTags(word),
  relatedWords: [],
  etymology: '',
}));

console.log('Saving to data/words.json...');
const outputPath = path.join(__dirname, '../data/words.json');
fs.writeFileSync(outputPath, JSON.stringify(structuredWords, null, 2), 'utf-8');

const fileSize = fs.statSync(outputPath).size / 1024;
const beginner = structuredWords.filter((w) => w.difficulty === 'beginner').length;
const intermediate = structuredWords.filter((w) => w.difficulty === 'intermediate').length;
const advanced = structuredWords.filter((w) => w.difficulty === 'advanced').length;

console.log(`\nSUCCESS!\n\nGenerated ${structuredWords.length} words\nSaved to: data/words.json\nFile size: ${fileSize.toFixed(0)}KB\n\nDifficulty Breakdown:\n  Beginner: ${beginner} words\n  Intermediate: ${intermediate} words\n  Advanced: ${advanced} words\n`);
