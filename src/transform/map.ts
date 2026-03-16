// transform/map.ts
import { TreeNode, BaseOptions } from '../types'
import { DEFAULT_CHILDREN_KEY } from '../constants'

/**
 * 对树进行映射，生成一棵新树
 * @param tree 原树或森林
 * @param callback 映射函数，接收原节点，返回新节点数据
 * @param options 配置选项
 * @returns 新树（如果输入是数组，返回数组；否则返回单个根节点）
 */
export function map(
    tree: TreeNode | TreeNode[],
    callback: (node: TreeNode) => TreeNode,
    options: BaseOptions = {}
): TreeNode | TreeNode[] {
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options

    const mapSubtree = (node: TreeNode): TreeNode => {
        // 先映射当前节点（前序）
        const newNode = callback({ ...node })
        // 防御性检查：确保返回值是对象
        if (typeof newNode !== 'object' || newNode === null) {
            throw new Error(
                `callback must return an object (TreeNode), but got ${typeof newNode} for node with id "${node.id}".`
            )
        }
        const children = node[childrenKey]
        if (Array.isArray(children)) {
            newNode[childrenKey] = children.map((child) => mapSubtree(child))
        }
        return newNode
    }

    if (Array.isArray(tree)) {
        return tree.map((root) => mapSubtree(root))
    } else {
        return mapSubtree(tree)
    }
}
