// transform/filter.ts
import { TreeNode, BaseOptions } from '../types'
import { DEFAULT_CHILDREN_KEY } from '../constants'

/**
 * 根据条件过滤树，保留满足条件的节点及其路径上的祖先
 * @param tree 原树或森林
 * @param predicate 断言函数，返回 true 表示保留节点
 * @param options 配置选项
 * @returns 新树（如果输入是数组，返回数组；否则返回单个根节点，若无满足节点则返回 null 或空数组）
 */
export function filter(
    tree: TreeNode | TreeNode[],
    predicate: (node: TreeNode) => boolean,
    options: BaseOptions = {}
): TreeNode | TreeNode[] | null {
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options

    // 递归处理单个子树
    const filterSubtree = (node: TreeNode): TreeNode | null => {
        // 先判断当前节点是否满足条件
        if (!predicate({ ...node })) {
            return null
        }

        const newNode: TreeNode = { ...node }

        // 如果有子节点，递归过滤子节点
        const children = node[childrenKey]
        if (Array.isArray(children)) {
            const newChildren: TreeNode[] = []
            for (const child of children) {
                const filteredChild = filterSubtree(child)
                if (filteredChild) {
                    newChildren.push(filteredChild)
                }
            }
            newNode[childrenKey] = newChildren
        }

        return newNode
    }

    if (Array.isArray(tree)) {
        const result: TreeNode[] = []
        for (const node of tree) {
            const filteredNode = filterSubtree(node)
            if (filteredNode) {
                result.push(filteredNode)
            }
        }
        return result
    } else {
        return filterSubtree(tree)
    }
}
