// relation/isParentOf.ts
import { TreeNode, BaseOptions } from '../types'
import { findPath } from '../find/findPath'

/**
 * 判断 parent 节点是否是 child 节点的直接父节点
 * @param tree 树或森林
 * @param parentPredicate 定位父节点的断言函数
 * @param childPredicate 定位子节点的断言函数
 * @param options 配置选项
 * @returns 是直接父子关系则返回 true，否则返回 false
 */
export function isParentOf(
    tree: TreeNode | TreeNode[],
    parentPredicate: (node: TreeNode) => boolean,
    childPredicate: (node: TreeNode) => boolean,
    options: BaseOptions = {}
): boolean {
    const path = findPath(tree, childPredicate, options)
    if (path.length <= 1) return false
    return parentPredicate(path[path.length - 2])
}
