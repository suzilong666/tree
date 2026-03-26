// modify/insertAfter.ts
import { TreeNode, BaseOptions } from '../types'
import { DEFAULT_CHILDREN_KEY } from '../constants'

/**
 * 在指定节点之后插入一个新节点（作为兄弟节点）
 * @param tree 原树或森林
 * @param predicate 断言函数，用于定位目标节点（只使用第一个匹配的节点）
 * @param newNode 要插入的新节点
 * @param options 配置选项
 * @returns 新树（如果未找到目标节点或目标是根节点，则返回原树）
 */
export function insertAfter(
    tree: TreeNode | TreeNode[],
    predicate: (node: TreeNode) => boolean,
    newNode: TreeNode,
    options: BaseOptions = {}
): TreeNode | TreeNode[] {
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options
    let isAppend = false // 标记是否已经处理过第一个匹配的节点

    function recursion(node: TreeNode): TreeNode {
        if (isAppend) return node // 已经处理过第一个匹配的节点，后续不再修改

        const children = Array.isArray(node[childrenKey])
            ? node[childrenKey]
            : []

        const index = children.findIndex(predicate)
        if (index !== -1) {
            isAppend = true
            return {
                ...node,
                [childrenKey]: [
                    ...children.slice(0, index + 1),
                    newNode,
                    ...children.slice(index + 1),
                ],
            }
        }

        if (children.length > 0) {
            return {
                ...node,
                [childrenKey]: children.map(recursion),
            }
        }

        return { ...node }
    }

    let result: TreeNode | TreeNode[]

    if (Array.isArray(tree)) {
        result = tree.map((root) => recursion(root))
    } else {
        result = recursion(tree)
    }

    if (!isAppend) {
        // 如果没有找到匹配的父节点，返回原树
        return tree
    }

    return result
}
