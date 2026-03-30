// relation/isSameDepth.ts
import { TreeNode, BaseOptions } from '../types'
import { breadthFirst } from '../traverse'

/**
 * 判断两个节点是否在同一深度（即同一层）
 * @param tree 树或森林
 * @param predicateA 定位第一个节点的断言函数
 * @param predicateB 定位第二个节点的断言函数
 * @param options 配置选项
 * @returns 如果两个节点深度相同则返回 true，否则 false
 */
export function isSameDepth(
    tree: TreeNode | TreeNode[],
    predicateA: (node: TreeNode) => boolean,
    predicateB: (node: TreeNode) => boolean,
    options: BaseOptions = {}
): boolean {
    let depth1 = -1
    let depth2 = -1

    breadthFirst(
        tree,
        (node, { depth }) => {
            if (predicateA(node)) depth1 = depth
            if (predicateB(node)) depth2 = depth
            if (depth1 !== -1 && depth2 !== -1) return false
        },
        options
    )
    if (depth1 === -1 || depth2 === -1) return false
    return depth1 === depth2
}
