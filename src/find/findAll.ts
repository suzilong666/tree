import { TreeNode, FindOptions } from '../types/tree'
import { breadthFirst, depthFirst } from '../traverse'

/**
 * 在树结构中查找所有满足条件的节点
 * @param tree
 * @param callback
 * @param options
 * @returns 满足条件的节点数组，如果未找到则返回空数组
 */
export function findAll(
    tree: TreeNode | TreeNode[],
    callback: (node: TreeNode) => boolean,
    options: FindOptions = {}
): TreeNode[] {
    const traverse = options.strategy === 'bfs' ? breadthFirst : depthFirst
    const result: TreeNode[] = []
    traverse(
        tree,
        (node) => {
            if (callback(node) === true) {
                result.push(node)
            }
        },
        options
    )
    return result
}
