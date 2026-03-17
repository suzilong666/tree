// modify/replace.ts
import { TreeNode, BaseOptions } from '../types'
import { DEFAULT_CHILDREN_KEY } from '../constants'

/**
 * 替换指定节点（用新节点完全替换旧节点，旧节点的子节点将被丢弃）
 * @param tree 原树或森林
 * @param predicate 断言函数，用于定位要替换的节点（只使用第一个匹配的节点）
 * @param newNode 新节点
 * @param options 配置选项
 * @returns 新树（如果未找到节点，则返回原树）
 */
export function replace(
    tree: TreeNode | TreeNode[],
    predicate: (node: TreeNode) => boolean,
    newNode: TreeNode,
    options: BaseOptions = {}
): TreeNode | TreeNode[] {
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options
    let replaced = false // 标记是否已替换

    // 递归处理单个节点，返回新节点或原节点
    const replaceInNode = (node: TreeNode): TreeNode => {
        // 如果已经替换过，直接返回原节点（不再检查）
        if (replaced) return node

        // 检查当前节点是否为目标节点
        if (predicate(node)) {
            replaced = true
            return newNode // 用新节点替换
        }

        // 不是目标节点，处理子节点
        const children = node[childrenKey]
        if (!Array.isArray(children)) {
            return node // 无子节点，返回原节点
        }

        const newChildren: TreeNode[] = []
        let changed = false

        for (const child of children) {
            const newChild = replaceInNode(child)
            if (newChild !== child) changed = true
            newChildren.push(newChild)
        }

        if (changed) {
            // 子节点有变化，返回新节点
            return { ...node, [childrenKey]: newChildren }
        }
        return node
    }

    // 处理森林
    if (Array.isArray(tree)) {
        const newForest: TreeNode[] = []
        for (const root of tree) {
            if (replaced) {
                // 已替换目标，后续根节点原样保留
                newForest.push(root)
            } else {
                newForest.push(replaceInNode(root))
            }
        }
        return newForest
    } else {
        // 单棵树
        return replaceInNode(tree)
    }
}
