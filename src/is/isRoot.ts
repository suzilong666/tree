// relation/isRoot.ts
import { TreeNode } from '../types'
import { ensureArray } from '../utils/array'

/**
 * 判断节点是否为根节点（即没有父节点）
 * @param tree 树或森林
 * @param predicate 定位节点的断言函数
 * @returns 是根节点则返回 true，否则 false
 */
export function isRoot(
    tree: TreeNode | TreeNode[],
    predicate: (node: TreeNode) => boolean
): boolean {
    return ensureArray(tree).some(predicate)
}
