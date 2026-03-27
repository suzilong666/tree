// relation/isBrother.ts
import { TreeNode, BaseOptions } from '../types'
import { getParent } from '../query/getParent'

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
    let find1, find2
    const parent1 = getParent(
        tree,
        (node) => {
            if (predicateA(node)) {
                find1 = node
                return true
            }
            return false
        },
        options
    )
    const parent2 = getParent(
        tree,
        (node) => {
            if (predicateB(node)) {
                find2 = node
                return true
            }
            return false
        },
        options
    )
    if (find1 === find2) return false // 同一节点不视为兄弟
    if (!parent1 || !parent2) return false // 其中一个节点不存在或是根节点
    return parent1 === parent2
}
