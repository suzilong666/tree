// relation/isLeaf.ts
import { TreeNode, BaseOptions } from '../types'
import { find } from '../find/find'
import { DEFAULT_CHILDREN_KEY } from '../constants'

/**
 * 判断节点是否为叶子节点（即没有子节点�?
 * @param tree 树或森林
 * @param predicate 定位节点的断言函数
 * @param options 配置选项
 * @returns 是叶子节点则返回 true，否�?false
 */
export function isLeaf(
    tree: TreeNode | TreeNode[],
    predicate: (node: TreeNode) => boolean,
    options: BaseOptions = {}
): boolean {
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options
    const node = find(tree, predicate, options)
    if (!node) return false
    return (
        !node[childrenKey] ||
        (Array.isArray(node[childrenKey]) && node[childrenKey].length === 0)
    )
}
