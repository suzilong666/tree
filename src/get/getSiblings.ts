// query/getSiblings.ts
import { TreeNode, BaseOptions } from '../types'
import { findPath } from '../find/findPath'
import { DEFAULT_CHILDREN_KEY } from '../constants'

/**
 * 获取指定节点的所有兄弟节点（不包括自身）
 * @param tree 树或森林
 * @param predicate 断言函数，用于定位目标节点（只使用第一个匹配的节点）
 * @param options 配置选项
 * @returns 兄弟节点数组，如果目标不存在或没有兄弟则返回空数组
 */
export function getSiblings(
    tree: TreeNode | TreeNode[],
    predicate: (node: TreeNode) => boolean,
    options: BaseOptions = {}
): TreeNode[] {
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options

    // 获取目标节点的路径
    const path = findPath(tree, predicate, options)
    if (path.length === 0) return [] // 目标不存在

    // 如果路径长度为 1，说明目标是根节点，没有父节点，也就没有兄弟
    if (path.length === 1) return []

    const parent = path[path.length - 2]
    const target = path[path.length - 1]

    const siblings = parent[childrenKey]
    if (!Array.isArray(siblings)) return []

    // 返回所有不等于目标节点的兄弟节点（基于引用比较）
    return siblings.filter((child) => child !== target)
}
