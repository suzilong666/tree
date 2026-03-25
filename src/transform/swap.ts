import { TreeNode, BaseOptions } from '../types'
import { DEFAULT_CHILDREN_KEY } from '../constants'
import { findPath } from '../find/findPath'

/**
 * 交换树中两个节点的位置（包括它们的整个子树）
 * @param tree 原树或森林
 * @param predicateA 定位第一个节点的断言函数
 * @param predicateB 定位第二个节点的断言函数
 * @param options 配置选项
 * @returns 新树（如果任一节点不存在或交换无效，则返回原树）
 */
export function swap(
    tree: TreeNode | TreeNode[],
    predicateA: (node: TreeNode) => boolean,
    predicateB: (node: TreeNode) => boolean,
    options: BaseOptions = {}
): TreeNode | TreeNode[] {
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options

    // 1. 获取两个节点的路径
    const pathA = findPath(tree, predicateA, { childrenKey })
    const pathB = findPath(tree, predicateB, { childrenKey })

    if (pathA.length === 0 || pathB.length === 0) {
        return tree // 任一节点不存在
    }

    const nodeA = pathA[pathA.length - 1]
    const nodeB = pathB[pathB.length - 1]

    if (nodeA === nodeB) {
        return tree
    }

    // 2. 检查是否互为祖先-后代
    const isAncestor = (ancestor: TreeNode, descendant: TreeNode): boolean => {
        const stack = [ancestor]
        while (stack.length) {
            const current = stack.pop()!
            if (current === descendant) return true
            const children = current[childrenKey]
            if (Array.isArray(children)) {
                stack.push(...children)
            }
        }
        return false
    }
    if (isAncestor(nodeA, nodeB) || isAncestor(nodeB, nodeA)) {
        return tree
    }

    // 3. 递归构建新树，并在遇到 nodeA 或 nodeB 时交换
    const buildNode = (node: TreeNode): TreeNode => {
        // 如果当前节点是需要交换的节点之一，直接返回另一个节点（但需要递归处理子节点吗？不，因为交换的是整个子树，所以直接返回另一个节点，其子树保持不变）
        if (node === nodeA) {
            // 直接返回 nodeB 的克隆，但 nodeB 可能尚未被构建，我们需要先构建 nodeB 的子树
            // 这里递归调用 buildNode 来构建 nodeB 的子树
            return buildNode(nodeB)
        }
        if (node === nodeB) {
            return buildNode(nodeA)
        }

        // 普通节点：浅拷贝，递归处理子节点
        const newNode = { ...node }
        const children = node[childrenKey]
        if (Array.isArray(children)) {
            newNode[childrenKey] = children.map((child) => buildNode(child))
        } else {
            delete newNode[childrenKey]
        }
        return newNode
    }

    // 4. 处理森林
    if (Array.isArray(tree)) {
        return tree.map((root) => buildNode(root))
    } else {
        return buildNode(tree)
    }
}
