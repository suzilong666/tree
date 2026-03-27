import { TreeNode, BaseOptions } from '../types'
import { DEFAULT_CHILDREN_KEY } from '../constants'

/**
 * 删除树中第一个匹配的节点及其所有子节点
 * @param tree 原树或森林
 * @param predicate 断言函数，返回 true 表示要删除的节点
 * @param options 配置选项
 * @returns 新树（如果输入是数组，返回数组；否则返回单个节点或 null）
 */
export function remove(
    tree: TreeNode | TreeNode[],
    predicate: (node: TreeNode) => boolean,
    options: BaseOptions = {}
): TreeNode | TreeNode[] | null {
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options
    let removed = false // 是否已经执行删除

    // 递归处理单个节点
    const processNode = (node: TreeNode): TreeNode | null => {
        if (removed) return node // 已删除过，直接返回原节点（不再检查）

        // 当前节点匹配，删除它
        if (predicate(node)) {
            removed = true
            return null
        }

        const children = node[childrenKey]
        if (!Array.isArray(children)) return node // 无子节点，直接返回原节点

        // 处理子节点
        let changed = false
        const newChildren: TreeNode[] = []

        for (let i = 0; i < children.length; i++) {
            const child = children[i]
            const newChild = processNode(child)
            if (newChild !== child) changed = true
            if (newChild !== null) newChildren.push(newChild)
        }

        // 如果子节点发生变化，返回新节点；否则返回原节点
        if (changed) {
            return { ...node, [childrenKey]: newChildren }
        }
        return node
    }

    // 处理森林
    if (Array.isArray(tree)) {
        const result: TreeNode[] = []
        for (let i = 0; i < tree.length; i++) {
            const root = tree[i]
            if (!removed) {
                const newRoot = processNode(root)
                if (newRoot !== null) result.push(newRoot)
            } else {
                result.push(root)
            }
        }
        return removed ? result : tree
    }

    // 单棵树
    const newRoot = processNode(tree)
    return newRoot !== null ? newRoot : null
}
