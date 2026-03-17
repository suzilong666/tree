// query/getAncestors.ts
import { TreeNode, BaseOptions } from '../types'
import { findPath } from '../find/findPath' // 假设 findPath 位于 find 模块

/**
 * 获取指定节点的所有祖先节点（从根到父节点，不包括自身）
 * @param tree 树或森林
 * @param predicate 断言函数，用于定位目标节点
 * @param options 配置选项
 * @returns 祖先节点数组，如果目标不存在则返回空数组
 */
export function getAncestors(
    tree: TreeNode | TreeNode[],
    predicate: (node: TreeNode) => boolean,
    options: BaseOptions = {}
): TreeNode[] {
    const path = findPath(tree, predicate, options)
    // path 包含从根到目标节点的所有节点，去掉最后一个（目标自身）即为祖先
    return path.slice(0, -1)
}
