import { DEFAULT_CHILDREN_KEY } from '../constants'
import { breadthFirst } from '../traverse'
import { BaseOptions, TreeNode } from '../types'
import { ensureArray } from '../utils/array'

/**
 * 交换树中两个节点的位置（只操作第一个匹配的节点）
 * @param tree 原树或森林
 * @param predicate1 定位第一个节点的断言函数
 * @param predicate2 定位第二个节点的断言函数
 * @param options 配置选项
 * @returns 新树（如果未找到节点或无法交换，则返回原树）
 */
export function swap(
    tree: TreeNode | TreeNode[],
    predicate1: (node: TreeNode) => boolean,
    predicate2: (node: TreeNode) => boolean,
    options: BaseOptions = {}
) {
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options
    let node1: TreeNode | null = null
    let node2: TreeNode | null = null
    let nodePath1: TreeNode[] = []
    let nodePath2: TreeNode[] = []

    breadthFirst(
        tree,
        (node, { path }) => {
            if (!node1 && predicate1(node)) {
                node1 = node
                nodePath1 = path
            }
            if (!node2 && predicate2(node)) {
                node2 = node
                nodePath2 = path
            }
            if (node1 && node2) return false
        },
        options
    )

    if (!node1 || !node2) return tree
    if (node1 === node2) return tree

    if (nodePath1.includes(node2)) return tree
    if (nodePath2.includes(node1)) return tree

    function swapNode(nodes: TreeNode[], depth: number): TreeNode[] {
        const result: TreeNode[] = []
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i]
            if (node === node1) {
                result.push(node2!)
                continue
            }
            if (node === node2) {
                result.push(node1!)
                continue
            }
            const children = node[childrenKey]
            if (
                Array.isArray(children) &&
                (node === nodePath1[depth] || node === nodePath2[depth])
            ) {
                result.push({
                    ...node,
                    [childrenKey]: swapNode(children, depth + 1),
                })
            } else {
                result.push(node)
            }
        }

        return result
    }

    const result = swapNode(ensureArray(tree), 0)

    return Array.isArray(tree) ? result : result[0]
}
