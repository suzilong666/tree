import { DEFAULT_CHILDREN_KEY } from '../constants'
import { find } from '../find/find'
import { BaseOptions, TreeNode } from '../types'

/**
 * 获取指定节点的所有子节点
 * @param tree 树或森林
 * @param predicate 断言函数，用于定位目标节点
 * @param options 配置选项
 * @returns 子节点数组，如果目标不存在或没有子节点则返回空数组
 */
export function getChildren(
    tree: TreeNode | TreeNode[],
    predicate: (node: TreeNode) => boolean,
    options: BaseOptions = {}
): TreeNode[] {
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options
    const node = find(tree, predicate, options)
    if (!node) return []
    const children = node[childrenKey]
    // 确保返回的是数组，且是原数组的副本（保证不可变性）
    return Array.isArray(children) ? [...children] : []
}
