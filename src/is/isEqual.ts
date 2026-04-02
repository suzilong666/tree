import { DEFAULT_CHILDREN_KEY } from '../constants'
import { BaseOptions, TreeNode } from '../types'

/**
 * 比较两棵树是否相等（通过自定义比较函数）
 * @param tree1 第一棵树或森林
 * @param tree2 第二棵树或森林
 * @param compare 节点比较函数，接收两个节点参数，返回 boolean 值表示是否相等
 * @param options 配置选项
 * @returns 如果两棵树结构相同且所有对应节点都满足比较函数则返回 true，否则 false
 */
export function isEqual(
    tree1: TreeNode | TreeNode[],
    tree2: TreeNode | TreeNode[],
    compare: (node1: TreeNode, node2: TreeNode) => boolean,
    options: BaseOptions = {}
): boolean {
    if (Array.isArray(tree1) !== Array.isArray(tree2)) return false
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options
    function compareFn(node1: TreeNode, node2: TreeNode) {
        if (!compare(node1, node2)) return false

        const children1 = node1[childrenKey]
        const children2 = node2[childrenKey]

        if (Array.isArray(children1) !== Array.isArray(children2)) return false

        if (Array.isArray(children1) && Array.isArray(children2)) {
            if (children1.length !== children2.length) return false

            for (let i = 0; i < children1.length; i++) {
                if (!compareFn(children1[i], children2[i])) return false
            }
        }

        return true
    }

    if (Array.isArray(tree1) && Array.isArray(tree2)) {
        for (let i = 0; i < tree1.length; i++) {
            if (!compareFn(tree1[i], tree2[i])) return false
        }
        return true
    }
    return compareFn(tree1 as TreeNode, tree2 as TreeNode)
}
