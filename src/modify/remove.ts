// modify/remove.ts
import { TreeNode, BaseOptions } from '../types'
import { DEFAULT_CHILDREN_KEY } from '../constants'

/**
 * 删除指定节点（及其所有子节点）
 * @param tree 原树或森林
 * @param predicate 断言函数，用于定位要删除的节点（只使用第一个匹配的节点）
 * @param options 配置选项
 * @returns 新树（如果未找到节点，则返回原树）
 */
export function remove(
    tree: TreeNode | TreeNode[],
    predicate: (node: TreeNode) => boolean,
    options: BaseOptions = {}
): TreeNode | TreeNode[] {
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options
    let removed = false // 标记是否已删除

    // 递归处理单个节点，返回新节点或 null（表示该节点被删除）
    const removeFromNode = (node: TreeNode): TreeNode | null => {
        // 如果已经删除过，直接返回原节点（不再检查）
        if (removed) return node

        // 检查当前节点是否为目标节点
        if (predicate(node)) {
            removed = true
            return null // 删除该节点
        }

        // 不是目标节点，处理子节点
        const children = node[childrenKey]
        if (!Array.isArray(children)) {
            return node // 无子节点，返回原节点
        }

        const newChildren: TreeNode[] = []
        let changed = false

        for (const child of children) {
            const newChild = removeFromNode(child)
            if (newChild === null) {
                // 子节点被删除，标记变化
                changed = true
                // 不加入 newChildren（即跳过）
            } else {
                newChildren.push(newChild)
                if (newChild !== child) changed = true
            }
        }

        if (changed) {
            // 子节点有变化，返回新节点（children 可能为空数组）
            return { ...node, [childrenKey]: newChildren }
        }
        return node
    }

    // 处理森林
    if (Array.isArray(tree)) {
        const newForest: TreeNode[] = []
        for (const root of tree) {
            if (removed) {
                // 已删除目标，后续根节点原样保留
                newForest.push(root)
            } else {
                const newRoot = removeFromNode(root)
                if (newRoot !== null) {
                    newForest.push(newRoot)
                }
                // 如果 newRoot 为 null，说明该根节点就是目标，不加入新森林
            }
        }
        return newForest
    } else {
        // 单棵树
        const result = removeFromNode(tree)
        return result !== null ? result : [] // 如果根节点被删除，返回空数组（表示空森林）
    }
}
