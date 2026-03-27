// relation/isAncestorOf.ts
import { TreeNode, BaseOptions } from '../types'
import { findPath } from '../find/findPath'

/**
 * 判断 ancestor 节点是否是 descendant 节点的祖先（即 ancestor 在 descendant 的路径上）
 * @param tree 树或森林
 * @param ancestorPredicate 定位祖先节点的断言函数
 * @param descendantPredicate 定位后代节点的断言函数
 * @param options 配置选项
 * @returns 是祖先关系则返回 true，否则 false
 */
export function isAncestorOf(
    tree: TreeNode | TreeNode[],
    ancestorPredicate: (node: TreeNode) => boolean,
    descendantPredicate: (node: TreeNode) => boolean,
    options: BaseOptions = {}
): boolean {
    const descendantPath = findPath(tree, descendantPredicate, options)
    return descendantPath.slice(0, -1).some(ancestorPredicate)
}
