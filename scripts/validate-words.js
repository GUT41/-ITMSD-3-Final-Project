const fs = require('fs');
const path = require('path');

const words = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/words.json'), 'utf-8'));
const placeholder = /^Definition for ".+" - a common English word/;
const genericExample = /^Example with the word ".+"\./;

const issues = words.filter(
  (w) =>
    !w.definition ||
    placeholder.test(w.definition) ||
    !w.example ||
    genericExample.test(w.example) ||
    !w.partOfSpeech ||
    !w.difficulty ||
    !w.category ||
    !Array.isArray(w.tags) ||
    w.tags.length === 0
);

console.log(`Validated ${words.length} words`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.slice(0, 5).map((w) => w.word).join(', '));
  process.exit(1);
}

console.log('All words have complete offline fields.');
process.exit(0);
