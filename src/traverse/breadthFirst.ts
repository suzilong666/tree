import { TreeNode, TreeOptions } from "../types/tree";
import { DEFAULT_CHILDREN_KEY } from "../constants/index";
import { ensureArray } from "../utils/array";

export function breadthFirst<T>(
  tree: TreeNode<T> | TreeNode<T>[],
  callback: (node: TreeNode<T>) => void,
  options: TreeOptions = {},
): void {}
