import { TreeNode, TreeOptions } from '../types/tree'
import { breadthFirst, depthFirst } from '../traverse'

/**
 * 在树结构中查找满足条件的节点
 * @param tree
 * @param callback
 * @param options
 * @returns 满足条件的节点，如果未找到则返回 null
 */
export function find(
    tree: TreeNode | TreeNode[],
    callback: (node: TreeNode) => boolean,
    options: TreeOptions = {}
): TreeNode | null {
    const traverse = options.strategy === 'bfs' ? breadthFirst : depthFirst
    let result = null
    traverse(
        tree,
        (node) => {
            if (callback(node) === true) {
                result = node
                return false
            }
        },
        options
    )
    return result
}
