// modify/move.ts
import { TreeNode, BaseOptions } from '../types'
import { remove } from './remove'
import { appendChild } from './appendChild'
import { prependChild } from './prependChild'
import { insertBefore } from './insertBefore'
import { insertAfter } from './insertAfter'
import { find } from '../find'

/**
 * 移动节点到新位置
 * @param tree 原树或森林
 * @param sourcePredicate 断言函数，用于定位要移动的节点（只使用第一个匹配的节点，不能是根节点）
 * @param destinationPredicate 断言函数，用于定位目标位置（根据 position 不同，匹配目标父节点或参考兄弟节点）
 * @param position 移动位置：
 *   - 'append': 作为目标父节点的最后一个子节点
 *   - 'prepend': 作为目标父节点的第一个子节点
 *   - 'before': 插入到目标参考节点之前
 *   - 'after': 插入到目标参考节点之后
 * @param options 配置选项
 * @returns 新树（如果移动无效则返回原树）
 */
export function move(
    tree: TreeNode | TreeNode[],
    sourcePredicate: (node: TreeNode) => boolean,
    destinationPredicate: (node: TreeNode) => boolean,
    position: 'append' | 'prepend' | 'before' | 'after' = 'append',
    options: BaseOptions = {}
): TreeNode | TreeNode[] {
    let sourceNode: TreeNode | null = null
    const removedTree = remove(
        tree,
        (node) => {
            if (sourcePredicate(node)) {
                sourceNode = node
                return true
            }
            return false
        },
        options
    )

    if (sourceNode === null) {
        // 没有找到源节点，返回原树
        return tree
    }
    if (find(sourceNode, destinationPredicate, options)) {
        // 目标位置在源节点的子树中，无法移动，返回原树
        return tree
    }

    let modify
    switch (position) {
        case 'append':
            modify = appendChild
            break
        case 'prepend':
            modify = prependChild
            break
        case 'before':
            modify = insertBefore
            break
        case 'after':
            modify = insertAfter
            break
        default:
            modify = appendChild
    }
    let isMoved = false
    const result = modify(
        removedTree || [],
        (node) => {
            if (destinationPredicate(node)) {
                isMoved = true
                return true
            }
            return false
        },
        sourceNode,
        options
    )

    return isMoved ? result : tree
}
