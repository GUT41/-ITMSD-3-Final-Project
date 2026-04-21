import { Trie } from '../src/algorithms/trie';

describe('Trie', () => {
  let trie: Trie;

  beforeEach(() => {
    trie = new Trie();
  });

  test('insert and search', () => {
    trie.insert('apple');
    expect(trie.search('apple')).toBe(true);
    expect(trie.search('app')).toBe(false);
  });

  test('prefix search', () => {
    trie.insert('apple');
    trie.insert('application');
    trie.insert('apply');
    const results = trie.startsWith('app');
    expect(results.length).toBe(3);
  });

  test('empty prefix', () => {
    trie.insert('hello');
    expect(trie.startsWith('xyz').length).toBe(0);
  });

  test('get all words', () => {
    trie.insert('a');
    trie.insert('b');
    expect(trie.getAllWords().length).toBe(2);
  });
});