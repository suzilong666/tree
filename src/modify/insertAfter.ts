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
    let inserted = false // 标记是否已插入，避免重复

    // 递归处理单个节点
    const insertIntoNode = (node: TreeNode): TreeNode => {
        // 如果是目标节点自身，且尚未插入（但这种情况应该由父节点处理，因为需要在其父节点的 children 中插入）
        // 实际上，这里不处理节点自身，只处理其子节点
        const children = node[childrenKey]
        if (!Array.isArray(children)) {
            return node // 没有子节点，无法在其后插入
        }

        const newChildren: TreeNode[] = []
        let changed = false

        for (let i = 0; i < children.length; i++) {
            const child = children[i]
            // 如果已经插入，后续子节点直接添加原样
            if (inserted) {
                newChildren.push(child)
                continue
            }

            // 检查当前子节点是否为目标节点
            if (predicate(child)) {
                // 在目标节点之后插入新节点
                newChildren.push(child, newNode)
                inserted = true
                changed = true
            } else {
                // 不是目标节点，递归处理该子节点（可能其内部包含目标节点）
                const newChild = insertIntoNode(child)
                if (newChild !== child) {
                    changed = true
                }
                newChildren.push(newChild)
            }
        }

        if (changed) {
            return { ...node, [childrenKey]: newChildren }
        }
        return node
    }

    // 处理森林
    if (Array.isArray(tree)) {
        const newForest: TreeNode[] = []
        for (const root of tree) {
            if (inserted) {
                // 已插入，后续根节点原样保留
                newForest.push(root)
            } else {
                const newRoot = insertIntoNode(root)
                newForest.push(newRoot)
            }
        }
        return newForest
    } else {
        // 单棵树
        const result = insertIntoNode(tree)
        // 如果目标是根节点（即 predicate(tree) 为 true），insertIntoNode 不会处理，因为目标不是子节点
        // 这种情况需要额外判断
        if (!inserted && predicate(tree)) {
            // 根节点无法插入兄弟，返回原树（不做修改）
            return tree
        }
        return result
    }
}
