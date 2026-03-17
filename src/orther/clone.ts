// utils/clone.ts
import { TreeNode, BaseOptions } from '../types'
import { DEFAULT_CHILDREN_KEY } from '../constants'

/**
 * 深拷贝一棵树或森林
 * @param tree 原树或森林
 * @param options 配置选项
 * @returns 新树（如果输入是数组，返回数组；否则返回单个根节点）
 */
export function clone(
    tree: TreeNode | TreeNode[],
    options: BaseOptions = {}
): TreeNode | TreeNode[] {
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options

    const cloneNode = (node: TreeNode): TreeNode => {
        // 创建新对象，拷贝所有自有可枚举属性
        const newNode: TreeNode = { ...node }
        // 处理子节点
        const children = node[childrenKey]
        if (Array.isArray(children)) {
            newNode[childrenKey] = children.map((child) => cloneNode(child))
        } else {
            // 如果原节点没有 children 字段或非数组，则新节点也不应有该字段（保持结构一致）
            delete newNode[childrenKey]
        }
        return newNode
    }

    if (Array.isArray(tree)) {
        return tree.map((root) => cloneNode(root))
    } else {
        return cloneNode(tree)
    }
}
