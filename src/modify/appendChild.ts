// modify/appendChild.ts
import { TreeNode, BaseOptions } from '../types'
import { DEFAULT_CHILDREN_KEY } from '../constants'

/**
 * 向指定父节点追加一个子节点（作为最后一个子节点），只操作第一个匹配的父节点
 * @param tree 原树或森林
 * @param predicate 断言函数，用于定位父节点（只使用第一个匹配的节点）
 * @param newNode 要追加的新节点
 * @param options 配置选项
 * @returns 新树（如果未找到父节点，则返回原树）
 */
export function appendChild(
    tree: TreeNode | TreeNode[],
    predicate: (node: TreeNode) => boolean,
    newNode: TreeNode,
    options: BaseOptions = {}
): TreeNode | TreeNode[] {
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options
    let done = false // 标记是否已经处理过第一个匹配的节点

    // 递归处理单个节点
    const appendToNode = (node: TreeNode): TreeNode => {
        // 如果已经处理过，直接返回原节点
        if (done) return node

        // 先判断当前节点是否为目标父节点
        if (predicate(node)) {
            done = true
            // 创建新节点（浅拷贝原节点）
            const newNodeCopy = { ...node }
            // 获取现有子节点（确保是数组）
            const existingChildren = newNodeCopy[childrenKey]
            const childrenArray = Array.isArray(existingChildren)
                ? existingChildren
                : []
            // 将新节点追加到末尾
            newNodeCopy[childrenKey] = [...childrenArray, newNode]
            return newNodeCopy
        }

        // 不是目标节点，递归处理子节点
        const children = node[childrenKey]
        if (Array.isArray(children)) {
            let hasChanges = false
            const newChildren = children.map((child) => {
                const newChild = appendToNode(child)
                if (newChild !== child) hasChanges = true
                return newChild
            })
            if (hasChanges) {
                // 子节点有变化，返回新节点
                return { ...node, [childrenKey]: newChildren }
            }
        }
        return node
    }

    // 处理森林
    if (Array.isArray(tree)) {
        const newForest: TreeNode[] = []
        for (const root of tree) {
            if (done) {
                // 已处理过，后续根节点原样保留
                newForest.push(root)
            } else {
                newForest.push(appendToNode(root))
            }
        }
        return newForest
    } else {
        return appendToNode(tree)
    }
}
