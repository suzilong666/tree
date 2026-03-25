// transform/map.ts
import { TreeNode, BaseOptions, Context } from '../types'
import { DEFAULT_CHILDREN_KEY } from '../constants'

/**
 * 对树进行映射，生成一棵新树
 * @param tree 原树或森林
 * @param callback 映射函数，接收原节点和上下文信息，返回新节点数据
 * @param options 配置选项
 * @returns 新树（如果输入是数组，返回数组；否则返回单个根节点）
 */
export function map(
    tree: TreeNode | TreeNode[],
    callback: (node: TreeNode, context: Context) => TreeNode,
    options: BaseOptions = {}
): TreeNode | TreeNode[] {
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options

    const mapSubtree = (node: TreeNode, context: Context): TreeNode => {
        // 调用回调，传入当前节点及其上下文
        const newNode = callback({ ...node }, context)
        // 防御性检查：确保返回值是对象
        if (typeof newNode !== 'object' || newNode === null) {
            throw new Error(
                `callback must return an object (TreeNode), but got ${typeof newNode} for node with id "${node.id}".`
            )
        }

        const children = node[childrenKey]
        if (Array.isArray(children)) {
            // 递归映射子节点，构造子节点的上下文
            newNode[childrenKey] = children.map((child, index) => {
                const childContext: Context = {
                    index,
                    depth: context.depth + 1,
                    parent: node, // 原始父节点
                    path: [...context.path, child], // 从根到当前子节点的路径（包含子节点）
                }
                return mapSubtree(child, childContext)
            })
        }

        return newNode
    }

    // 处理根节点（单个或森林）
    if (Array.isArray(tree)) {
        // 森林：每个根节点在数组中的位置即为索引
        return tree.map((root, index) => {
            const context: Context = {
                index,
                depth: 0,
                parent: null,
                path: [root],
            }
            return mapSubtree(root, context)
        })
    } else {
        // 单根节点：索引为 0
        const context: Context = {
            index: 0,
            depth: 0,
            parent: null,
            path: [tree],
        }
        return mapSubtree(tree, context)
    }
}
