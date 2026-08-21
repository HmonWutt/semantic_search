interface Node {
  children: Map<string, Node>
  fullText?: string // set on terminal nodes
}

export class Trie {
  private root: Node = { children: new Map() }

  insert(text: string): void {
    let node = this.root
    for (const ch of text.toLowerCase()) {
      let next = node.children.get(ch)
      if (!next) {
        next = { children: new Map() }
        node.children.set(ch, next)
      }
      node = next
    }
    node.fullText = text
  }

  suggest(prefix: string, k = 8): string[] {
    if (!prefix) return []
    let node = this.root
    for (const ch of prefix.toLowerCase()) {
      const next = node.children.get(ch)
      if (!next) return []
      node = next
    }
    const out: string[] = []
    const dfs = (n: Node) => {
      if (out.length >= k) return
      if (n.fullText) out.push(n.fullText)
      for (const child of n.children.values()) {
        if (out.length >= k) return
        dfs(child)
      }
    }
    dfs(node)
    return out
  }
}

export const trie = new Trie()
