/**
 * Builds data/words.json from common-10k.txt + Webster's compact dictionary (offline).
 * Run: npm run generate-words
 *
 * On first run, downloads data/dictionary_compact.json (~21MB) from Project Gutenberg Webster's.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const DATA_DIR = path.join(__dirname, '../data');
const WORDS_LIST_FILE = path.join(DATA_DIR, 'common-10k.txt');
const WEBSTER_FILE = path.join(DATA_DIR, 'dictionary_compact.json');
const WORDNET_FILE = path.join(DATA_DIR, 'wordnet-merged.json');
const SUPPLEMENT_FILE = path.join(DATA_DIR, 'supplemental-definitions.json');
const OUTPUT_FILE = path.join(DATA_DIR, 'words.json');
const WEBSTER_URL =
  'https://raw.githubusercontent.com/matthewreagan/WebstersEnglishDictionary/master/dictionary_compact.json';
const WORDNET_URL =
  'https://raw.githubusercontent.com/nightblade9/simple-english-dictionary/main/processed/merged.json';

const MAX_WORDS = 10000;
const FUZZY_WEBSTER_MAX_DISTANCE = 2;

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function buildLengthIndex(websterMap) {
  const index = new Map();
  for (const key of websterMap.keys()) {
    const len = key.length;
    if (!index.has(len)) index.set(len, []);
    index.get(len).push(key);
  }
  return index;
}

function findFuzzyWebsterDefinition(word, websterMap, lengthIndex) {
  if (word.length < 4) return null;
  const maxDistance = word.length >= 7 ? FUZZY_WEBSTER_MAX_DISTANCE : 1;
  let bestKey = null;
  let bestDistance = maxDistance + 1;

  for (let len = word.length - maxDistance; len <= word.length + maxDistance; len++) {
    const candidates = lengthIndex.get(len) ?? [];
    for (const candidate of candidates) {
      const distance = levenshtein(word, candidate);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestKey = candidate;
      }
    }
  }

  return bestKey ? websterMap.get(bestKey) : null;
}
const MAX_DEFINITION_LENGTH = 420;
const MAX_EXAMPLE_LENGTH = 220;

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          file.close();
          fs.unlinkSync(dest);
          return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        }
        if (response.statusCode !== 200) {
          reject(new Error(`Download failed: HTTP ${response.statusCode}`));
          return;
        }
        response.pipe(file);
        file.on('finish', () => file.close(resolve));
      })
      .on('error', (err) => {
        fs.unlink(dest, () => reject(err));
      });
  });
}

async function ensureSourceFile(filePath, url, label) {
  if (fs.existsSync(filePath)) {
    console.log(`Using cached ${label}: ${filePath}`);
    return;
  }
  console.log(`Downloading ${label} (one-time)...`);
  await downloadFile(url, filePath);
  console.log(`${label} download complete.`);
}

async function ensureSourceDictionaries() {
  await ensureSourceFile(WEBSTER_FILE, WEBSTER_URL, 'Webster dictionary');
  await ensureSourceFile(WORDNET_FILE, WORDNET_URL, 'WordNet merged dictionary');
}

function loadWebsterMap() {
  const raw = fs.readFileSync(WEBSTER_FILE, 'utf-8');
  const entries = JSON.parse(raw);
  const map = new Map();
  for (const [word, definition] of Object.entries(entries)) {
    map.set(word.toLowerCase().trim(), definition.trim());
  }
  return map;
}

function loadWordNetMap() {
  const raw = fs.readFileSync(WORDNET_FILE, 'utf-8');
  const entries = JSON.parse(raw);
  const map = new Map();
  for (const [word, entry] of Object.entries(entries)) {
    map.set(word.toLowerCase().trim(), entry);
  }
  return map;
}

function parseWordNetEntry(entry, wordNetMap, visited = new Set()) {
  const meanings = entry?.MEANINGS;
  if (Array.isArray(meanings) && meanings.length > 0) {
    const first = meanings.find((m) => Array.isArray(m) && m[1]) ?? meanings[0];
    if (Array.isArray(first) && first[1]) {
      const partOfSpeech = String(first[0] ?? 'noun').toLowerCase();
      const definition = String(first[1]).trim();
      const exampleList = Array.isArray(first[3])
        ? first[3].filter((x) => typeof x === 'string' && x.length > 8)
        : [];
      const example = exampleList[0] ?? '';
      const synonyms = Array.isArray(entry.SYNONYMS)
        ? entry.SYNONYMS.filter((s) => typeof s === 'string').slice(0, 8)
        : [];

      return { definition, partOfSpeech, example, synonyms, rawDefinition: definition };
    }
  }

  const synonyms = Array.isArray(entry?.SYNONYMS) ? entry.SYNONYMS : [];
  for (const synonym of synonyms) {
    const key = String(synonym).toLowerCase();
    if (visited.has(key)) continue;
    visited.add(key);
    const related = wordNetMap.get(key);
    if (!related) continue;
    const parsed = parseWordNetEntry(related, wordNetMap, visited);
    if (parsed) return parsed;
  }

  return null;
}

function getDifficulty(index) {
  if (index < 1000) return 'beginner';
  if (index < 5000) return 'intermediate';
  return 'advanced';
}

function inferPartOfSpeech(word, definition) {
  const def = definition.toLowerCase();
  const patterns = [
    [/^\s*v\.?\s*t\.?/i, 'verb'],
    [/^\s*v\.?\s*i\.?/i, 'verb'],
    [/^\s*v\.?\s*/i, 'verb'],
    [/^\s*n\.?\s*/i, 'noun'],
    [/^\s*adj\.?|^\s*a\.?\s/i, 'adjective'],
    [/^\s*adv\.?\s*/i, 'adverb'],
    [/^\s*prep\.?\s*/i, 'preposition'],
    [/^\s*conj\.?\s*/i, 'conjunction'],
    [/^\s*pron\.?\s*/i, 'pronoun'],
    [/^\s*interj\.?\s*/i, 'interjection'],
  ];
  for (const [regex, pos] of patterns) {
    if (regex.test(def)) return pos;
  }

  if (word.endsWith('ly') && word.length > 3) return 'adverb';
  if (word.endsWith('ing') || word.endsWith('ed')) return 'verb';
  if (word.endsWith('tion') || word.endsWith('ness') || word.endsWith('ment')) return 'noun';
  if (word.endsWith('ous') || word.endsWith('ful') || word.endsWith('ive') || word.endsWith('able')) {
    return 'adjective';
  }
  return 'noun';
}

function categoryFromPartOfSpeech(pos) {
  const map = {
    noun: 'noun',
    verb: 'verb',
    adjective: 'adjective',
    adverb: 'adverb',
    preposition: 'abstract',
    conjunction: 'abstract',
    pronoun: 'common',
    interjection: 'common',
  };
  return map[pos] ?? 'common';
}

function cleanDefinition(definition) {
  let text = definition
    .replace(/^\s*(?:n|v|a|adj|adv|prep|conj|pron|interj)\.?\s*(?:t\.|i\.)?\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length > MAX_DEFINITION_LENGTH) {
    const cut = text.slice(0, MAX_DEFINITION_LENGTH);
    const lastPeriod = cut.lastIndexOf('.');
    text = lastPeriod > 80 ? cut.slice(0, lastPeriod + 1) : `${cut.trim()}…`;
  }
  return text;
}

function buildTags(word, pos, difficulty) {
  const tags = new Set(['common', pos, difficulty]);
  if (word.length < 4) tags.add('short');
  if (word.length > 10) tags.add('long');
  if (word.endsWith('ing')) tags.add('action');
  if (word.endsWith('ly')) tags.add('adverb');
  if (word.endsWith('tion')) tags.add('formal');
  return [...tags];
}

function extractExample(word, definition) {
  const quoted = definition.match(/"([^"]{20,180})"/);
  if (quoted && /[a-z]/i.test(quoted[1]) && quoted[1].trim().split(/\s+/).length >= 4) {
    return quoted[1];
  }

  const sentences = definition
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  const usable = sentences.find((s) => s.toLowerCase().includes(word.toLowerCase()));
  if (usable) {
    return usable.length > MAX_EXAMPLE_LENGTH
      ? `${usable.slice(0, MAX_EXAMPLE_LENGTH - 1).trim()}…`
      : usable;
  }

  const summary = cleanDefinition(definition);
  const firstSentence = summary.split(/(?<=[.!?])\s+/)[0] ?? summary;
  const example = `The word "${word}" means ${firstSentence.charAt(0).toLowerCase()}${firstSentence.slice(1)}`;
  return example.length > MAX_EXAMPLE_LENGTH
    ? `${example.slice(0, MAX_EXAMPLE_LENGTH - 1).trim()}…`
    : example;
}

function findWebsterDefinition(websterMap, word) {
  const key = word.toLowerCase();
  if (websterMap.has(key)) return websterMap.get(key);

  const suffixes = ['ies', 'es', 's', 'ing', 'ed', 'ly'];
  for (const suffix of suffixes) {
    if (!key.endsWith(suffix) || key.length <= suffix.length + 2) continue;
    const stem = key.slice(0, -suffix.length);
    if (websterMap.has(stem)) return websterMap.get(stem);
  }
  return null;
}

function findWordNetEntry(wordNetMap, word) {
  const key = word.toLowerCase();
  if (wordNetMap.has(key)) return wordNetMap.get(key);

  const stems = [];
  if (key.endsWith('ing') && key.length > 4) {
    stems.push(key.slice(0, -3), `${key.slice(0, -3)}e`);
  }
  if (key.endsWith('ed') && key.length > 3) {
    stems.push(key.slice(0, -2), `${key.slice(0, -2)}e`);
  }
  if (key.endsWith('s') && key.length > 2) stems.push(key.slice(0, -1));
  if (key.endsWith('ies') && key.length > 4) stems.push(`${key.slice(0, -3)}y`);

  for (const stem of stems) {
    if (wordNetMap.has(stem)) return wordNetMap.get(stem);
  }
  return null;
}

const OFFLINE_GLOSSARY = require('./supplemental-offline-glossary');

function loadSupplementMap() {
  const map = new Map(Object.entries(OFFLINE_GLOSSARY));
  if (fs.existsSync(SUPPLEMENT_FILE)) {
    const entries = JSON.parse(fs.readFileSync(SUPPLEMENT_FILE, 'utf-8'));
    for (const [word, entry] of Object.entries(entries)) {
      map.set(word, entry);
    }
  }
  return map;
}

function lookupCompound(websterMap, wordNetMap, word) {
  const parts = word.split(/[-_]/).filter((p) => p.length > 2);
  if (parts.length < 2) return null;

  const resolvedParts = parts
    .map((part) => resolveWordData(part, websterMap, wordNetMap, new Map(), null))
    .filter(Boolean);

  if (resolvedParts.length < 2) return null;

  const definition = resolvedParts.map((p) => cleanDefinition(p.rawDefinition)).join(' ');
  const partOfSpeech = resolvedParts[0].partOfSpeech;
  return {
    source: 'compound',
    rawDefinition: definition,
    partOfSpeech,
    example: resolvedParts.find((p) => p.example)?.example ?? '',
    synonyms: [],
  };
}

function resolveWordData(word, websterMap, wordNetMap, supplementMap, websterLengthIndex) {
  const websterDefinition = findWebsterDefinition(websterMap, word);
  if (websterDefinition) {
    return {
      source: 'webster',
      rawDefinition: websterDefinition,
      partOfSpeech: inferPartOfSpeech(word, websterDefinition),
      synonyms: [],
    };
  }

  const wordNetEntry = findWordNetEntry(wordNetMap, word);
  const parsed = wordNetEntry ? parseWordNetEntry(wordNetEntry, wordNetMap) : null;
  if (parsed) {
    return {
      source: 'wordnet',
      rawDefinition: parsed.rawDefinition,
      partOfSpeech: parsed.partOfSpeech,
      example: parsed.example,
      synonyms: parsed.synonyms,
    };
  }

  const fuzzyDefinition = findFuzzyWebsterDefinition(word, websterMap, websterLengthIndex);
  if (fuzzyDefinition) {
    return {
      source: 'webster-fuzzy',
      rawDefinition: fuzzyDefinition,
      partOfSpeech: inferPartOfSpeech(word, fuzzyDefinition),
      synonyms: [],
    };
  }

  const compound = lookupCompound(websterMap, wordNetMap, word);
  if (compound) return compound;

  const supplemental = supplementMap.get(word);
  if (supplemental?.definition) {
    return {
      source: 'supplement',
      rawDefinition: supplemental.definition,
      partOfSpeech: supplemental.partOfSpeech ?? inferPartOfSpeech(word, supplemental.definition),
      example: supplemental.example ?? '',
      synonyms: supplemental.synonyms ?? [],
      pronunciation: supplemental.pronunciation ?? '',
    };
  }

  return null;
}

async function main() {
  await ensureSourceDictionaries();

  const wordsList = fs
    .readFileSync(WORDS_LIST_FILE, 'utf-8')
    .split('\n')
    .map((w) => w.trim().toLowerCase())
    .filter((w) => w.length >= 1 && w.length < 30);

  console.log(`Loaded ${wordsList.length} words from common-10k.txt`);
  const websterMap = loadWebsterMap();
  const websterLengthIndex = buildLengthIndex(websterMap);
  const wordNetMap = loadWordNetMap();
  const supplementMap = loadSupplementMap();
  console.log(`Loaded ${websterMap.size} Webster definitions`);
  console.log(`Loaded ${wordNetMap.size} WordNet entries`);
  console.log(`Loaded ${supplementMap.size} supplemental definitions`);

  const structuredWords = [];
  let skipped = 0;
  let websterCount = 0;
  let wordnetCount = 0;
  let supplementCount = 0;
  let compoundCount = 0;

  for (let index = 0; index < Math.min(wordsList.length, MAX_WORDS); index++) {
    const word = wordsList[index];
    const resolved = resolveWordData(word, websterMap, wordNetMap, supplementMap, websterLengthIndex);
    if (!resolved) {
      skipped++;
      continue;
    }

    if (resolved.source === 'webster') websterCount++;
    else if (resolved.source === 'wordnet') wordnetCount++;
    else if (resolved.source === 'compound') compoundCount++;
    else supplementCount++;

    const partOfSpeech = resolved.partOfSpeech;
    const definition = cleanDefinition(resolved.rawDefinition);
    const difficulty = getDifficulty(index);
    const category = categoryFromPartOfSpeech(partOfSpeech);
    const example =
      resolved.example && resolved.example.length > 12
        ? resolved.example.length > MAX_EXAMPLE_LENGTH
          ? `${resolved.example.slice(0, MAX_EXAMPLE_LENGTH - 1).trim()}…`
          : resolved.example
        : extractExample(word, resolved.rawDefinition);

    structuredWords.push({
      id: `${word}-${index}`,
      word,
      definition,
      partOfSpeech,
      pronunciation: resolved.pronunciation ?? '',
      example,
      difficulty,
      category,
      tags: buildTags(word, partOfSpeech, difficulty),
      relatedWords: [],
      etymology: '',
      synonyms: resolved.synonyms ?? [],
    });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(structuredWords));

  const fileSizeKb = fs.statSync(OUTPUT_FILE).size / 1024;
  const beginner = structuredWords.filter((w) => w.difficulty === 'beginner').length;
  const intermediate = structuredWords.filter((w) => w.difficulty === 'intermediate').length;
  const advanced = structuredWords.filter((w) => w.difficulty === 'advanced').length;

  console.log(`
SUCCESS!

Generated ${structuredWords.length} words (skipped ${skipped} without offline definitions)
Sources: Webster ${websterCount}, WordNet ${wordnetCount}, Compound ${compoundCount}, Supplement ${supplementCount}
Saved to: data/words.json
File size: ${fileSizeKb.toFixed(0)} KB

Difficulty breakdown:
  Beginner: ${beginner}
  Intermediate: ${intermediate}
  Advanced: ${advanced}
`);
}

main().catch((error) => {
  console.error('generate-words failed:', error);
  process.exit(1);
});
