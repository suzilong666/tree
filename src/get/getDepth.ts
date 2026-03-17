// query/getDepth.ts
import { TreeNode, BaseOptions } from '../types'
import { DEFAULT_CHILDREN_KEY } from '../constants'
import { ensureArray } from '../utils/array'

/**
 * 计算树的最大深度（根节点深度为 0）
 * @param tree 树或森林
 * @param options 配置选项
 * @returns 最大深度，如果输入为空数组则返回 0
 */
export function getDepth(
    tree: TreeNode | TreeNode[],
    options: BaseOptions = {}
): number {
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options
    const nodes = ensureArray(tree)

    if (nodes.length === 0) return 0

    let maxDepth = 0

    const traverse = (node: TreeNode, depth: number) => {
        if (depth > maxDepth) maxDepth = depth

        const children = node[childrenKey]
        if (Array.isArray(children)) {
            for (const child of children) {
                traverse(child, depth + 1)
            }
        }
    }

    for (const root of nodes) {
        traverse(root, 0)
    }

    return maxDepth
}
