import { TreeNode, FindOptions } from '../types/tree'
import { breadthFirst, depthFirst } from '../traverse'

/**
 * 在树结构中查找满足条件的节点,并返回从根节点到该节点的路径
 * @param tree
 * @param callback
 * @param options
 * @returns 根节点到该节点的路径，如果未找到则返回空数组
 */
export function findPath(
    tree: TreeNode | TreeNode[],
    callback: (node: TreeNode) => boolean,
    options: FindOptions = {}
): TreeNode[] {
    const traverse = options.strategy === 'bfs' ? breadthFirst : depthFirst
    let result: TreeNode[] = []
    traverse(
        tree,
        (node, { path }) => {
            if (callback(node) === true) {
                result = path
                return false
            }
        },
        options
    )
    return result
}
