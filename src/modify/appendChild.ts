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
    let isAppend = false // 标记是否已经处理过第一个匹配的节点

    function recursion(node: TreeNode): TreeNode {
        if (isAppend) return node // 已经处理过第一个匹配的节点，后续不再修改

        const children = Array.isArray(node[childrenKey])
            ? node[childrenKey]
            : []

        if (predicate(node)) {
            isAppend = true
            return {
                ...node,
                [childrenKey]: [...children, newNode],
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
