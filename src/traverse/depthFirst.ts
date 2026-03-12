// src/traverse/depthFirst.ts
import { TreeNode, TreeOptions } from "../types/tree";
import { DEFAULT_CHILDREN_KEY } from "../constants/index";
import { ensureArray } from "../utils/array";

export function depthFirst<T>(
  tree: TreeNode<T> | TreeNode<T>[],
  callback: (node: TreeNode<T>) => void,
  options: TreeOptions = {},
): void {
  const { childrenKey = DEFAULT_CHILDREN_KEY } = options;
  const nodes = ensureArray(tree);

  for (const node of nodes) {
    callback(node);
    const children = node[childrenKey];
    if (children && Array.isArray(children)) {
      depthFirst(children, callback, options);
    }
  }
}
