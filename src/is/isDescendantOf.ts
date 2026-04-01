// relation/isDescendantOf.ts
import { TreeNode, BaseOptions } from '../types'
import { isAncestorOf } from './isAncestorOf'

/**
 * 判断 descendant 节点是否为 ancestor 节点的后代（即 descendant 在 ancestor 的子树中）
 * @param tree 树或森林
 * @param descendantPredicate 定位后代节点的断言函数
 * @param ancestorPredicate 定位祖先节点的断言函数
 * @param options 配置选项
 * @returns 是后代则返回 true，否则返回 false
 */
export function isDescendantOf(
    tree: TreeNode | TreeNode[],
    descendantPredicate: (node: TreeNode) => boolean,
    ancestorPredicate: (node: TreeNode) => boolean,
    options: BaseOptions = {}
): boolean {
    return isAncestorOf(tree, ancestorPredicate, descendantPredicate, options)
}
