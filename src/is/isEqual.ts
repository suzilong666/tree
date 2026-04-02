import { DEFAULT_CHILDREN_KEY } from '../constants'
import { BaseOptions, TreeNode } from '../types'

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
