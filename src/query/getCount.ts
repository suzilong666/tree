import { breadthFirst } from '../traverse'
import { BaseOptions, TreeNode } from '../types'
/**
 * 计算树中的节点总数
 * @param tree 树或森林
 * @param options 配置选项
 * @returns 节点总数，如果输入为空数组则返回 0
 */
export function getCount(
    tree: TreeNode | TreeNode[],
    options: BaseOptions = {}
): number {
    let total = 0
    breadthFirst(
        tree,
        () => {
            total++
        },
        options
    )
    return total
}
