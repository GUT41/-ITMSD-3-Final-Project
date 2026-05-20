/**
 * One-time / maintainer script: fills data/supplemental-definitions.json
 * for common-10k words not covered by Webster + WordNet sources.
 * Run: node scripts/build-supplemental.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const DATA_DIR = path.join(__dirname, '../data');
const WORDS_LIST_FILE = path.join(DATA_DIR, 'common-10k.txt');
const WORDS_FILE = path.join(DATA_DIR, 'words.json');
const SUPPLEMENT_FILE = path.join(DATA_DIR, 'supplemental-definitions.json');
const API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en';

const DELAY_MS = 120;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function fetchDefinition(word) {
  return new Promise((resolve) => {
    https
      .get(`${API_BASE}/${encodeURIComponent(word)}`, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          if (res.statusCode !== 200) return resolve(null);
          try {
            const payload = JSON.parse(body);
            const entry = payload[0];
            const meaning = entry?.meanings?.[0];
            const def = meaning?.definitions?.[0];
            if (!def?.definition) return resolve(null);
            resolve({
              definition: def.definition.trim(),
              partOfSpeech: (meaning.partOfSpeech ?? 'noun').toLowerCase(),
              example: def.example?.trim() ?? '',
              pronunciation: entry.phonetics?.find((p) => p.text)?.text?.trim() ?? '',
              synonyms: (def.synonyms ?? []).slice(0, 8),
            });
          } catch {
            resolve(null);
          }
        });
      })
      .on('error', () => resolve(null));
  });
}

async function main() {
  const wordList = fs
    .readFileSync(WORDS_LIST_FILE, 'utf-8')
    .split('\n')
    .map((w) => w.trim().toLowerCase())
    .filter((w) => w.length > 1 && w.length < 30)
    .slice(0, 10000);

  const existing = fs.existsSync(WORDS_FILE)
    ? new Set(JSON.parse(fs.readFileSync(WORDS_FILE, 'utf-8')).map((w) => w.word))
    : new Set();

  const prior = fs.existsSync(SUPPLEMENT_FILE)
    ? JSON.parse(fs.readFileSync(SUPPLEMENT_FILE, 'utf-8'))
    : {};

  const missing = wordList.filter((w) => !existing.has(w) && !prior[w]);
  console.log(`Fetching ${missing.length} supplemental definitions...`);

  let added = 0;
  for (const word of missing) {
    const result = await fetchDefinition(word);
    if (result) {
      prior[word] = result;
      added++;
      process.stdout.write(`\r  added ${added}/${missing.length}: ${word}          `);
    }
    await sleep(DELAY_MS);
  }

  fs.writeFileSync(SUPPLEMENT_FILE, JSON.stringify(prior, null, 2));
  console.log(`\nSaved ${Object.keys(prior).length} supplemental entries to ${SUPPLEMENT_FILE}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
