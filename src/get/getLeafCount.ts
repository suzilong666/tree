// query/getLeafCount.ts
import { TreeNode, BaseOptions } from '../types'
import { DEFAULT_CHILDREN_KEY } from '../constants'
import { isEmpty } from '../utils/array'
import { breadthFirst } from '../traverse'

/**
 * 计算树中的叶子节点数量（叶子节点定义为没有子节点的节点）
 * @param tree 树或森林
 * @param options 配置选项
 * @returns 叶子节点总数，如果输入为空数组则返回 0
 */
export function getLeafCount(
    tree: TreeNode | TreeNode[],
    options: BaseOptions = {}
): number {
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options
    let leafCount = 0
    breadthFirst(
        tree,
        (node) => {
            if (isEmpty(node[childrenKey])) {
                leafCount++
            }
        },
        { childrenKey }
    )
    return leafCount
}
