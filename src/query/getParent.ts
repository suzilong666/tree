// query/getParent.ts
import { TreeNode, BaseOptions } from '../types'
import { findPath } from '../find/findPath'

/**
 * 获取指定节点的父节点
 * @param tree 树或森林
 * @param predicate 断言函数，用于定位目标节点
 * @param options 配置选项
 * @returns 父节点，如果目标不存在或是根节点则返回 null
 */
export function getParent(
    tree: TreeNode | TreeNode[],
    predicate: (node: TreeNode) => boolean,
    options: BaseOptions = {}
): TreeNode | null {
    const path = findPath(tree, predicate, options)
    if (path.length < 2) return null // 不存在或根节点
    return path[path.length - 2]
}
