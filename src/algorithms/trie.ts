export class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEnd: boolean = false;
  word: string = '';
}

export class Trie {
  private root: TrieNode = new TrieNode();

  insert(word: string): void {
    let node = this.root;
    const lowerWord = word.toLowerCase();

    for (const char of lowerWord) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }

    node.isEnd = true;
    node.word = word;
  }

  search(word: string): boolean {
    let node = this.root;
    const lowerWord = word.toLowerCase();

    for (const char of lowerWord) {
      if (!node.children.has(char)) {
        return false;
      }
      node = node.children.get(char)!;
    }

    return node.isEnd;
  }

  startsWith(prefix: string): string[] {
    let node = this.root;
    const lowerPrefix = prefix.toLowerCase();

    for (const char of lowerPrefix) {
      if (!node.children.has(char)) {
        return [];
      }
      node = node.children.get(char)!;
    }

    const results: string[] = [];
    this.dfs(node, results);
    return results;
  }

  private dfs(node: TrieNode, results: string[]): void {
    if (node.isEnd) {
      results.push(node.word);
    }

    for (const child of node.children.values()) {
      this.dfs(child, results);
    }
  }

  getAllWords(): string[] {
    const results: string[] = [];
    for (const child of this.root.children.values()) {
      this.dfs(child, results);
    }
    return results;
  }
}