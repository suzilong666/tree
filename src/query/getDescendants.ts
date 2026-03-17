import { TreeNode, BaseOptions } from '../types'
import { find } from '../find/find' // 假设 find 位于 find 模块
import { DEFAULT_CHILDREN_KEY } from '../constants'

/**
 * 获取指定节点的所有后代节点（不包括自身）
 * @param tree 树或森林
 * @param predicate 断言函数，用于定位目标节点（只使用第一个匹配的节点）
 * @param options 配置选项
 * @returns 后代节点数组，如果目标不存在则返回空数组
 */
export function getDescendants(
    tree: TreeNode | TreeNode[],
    predicate: (node: TreeNode) => boolean,
    options: BaseOptions = {}
): TreeNode[] {
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options

    // 找到目标节点（只取第一个）
    const target = find(tree, predicate, options)
    if (!target) return []

    const descendants: TreeNode[] = []

    // 递归收集后代
    const collect = (node: TreeNode) => {
        const children = node[childrenKey]
        if (Array.isArray(children)) {
            for (const child of children) {
                descendants.push(child)
                collect(child)
            }
        }
    }

    collect(target)
    return descendants
}
