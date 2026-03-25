// relation/isBrother.ts
import { TreeNode, BaseOptions } from '../types'
import { findPath } from '../find/findPath'
import { DEFAULT_CHILDREN_KEY } from '../constants'

/**
 * 判断两个节点是否为兄弟节点（即具有相同的父节点）
 * @param tree 树或森林
 * @param predicateA 定位第一个节点的断言函数
 * @param predicateB 定位第二个节点的断言函数
 * @param options 配置选项
 * @returns 是兄弟则返回 true，否则 false
 */
export function isBrother(
    tree: TreeNode | TreeNode[],
    predicateA: (node: TreeNode) => boolean,
    predicateB: (node: TreeNode) => boolean,
    options: BaseOptions = {}
): boolean {
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options

    // 获取两个节点的路径
    const pathA = findPath(tree, predicateA, { childrenKey })
    const pathB = findPath(tree, predicateB, { childrenKey })

    // 任一节点不存在或为根节点（无父节点）则无法成为兄弟
    if (
        pathA.length === 0 ||
        pathB.length === 0 ||
        pathA.length === 1 ||
        pathB.length === 1
    ) {
        return false
    }

    const nodeA = pathA[pathA.length - 1]
    const nodeB = pathB[pathB.length - 1]

    // 同一个节点不算兄弟
    if (nodeA === nodeB) return false

    // 获取父节点
    const parentA = pathA[pathA.length - 2]
    const parentB = pathB[pathB.length - 2]

    // 父节点相同即为兄弟
    return parentA === parentB
}
