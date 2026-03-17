// modify/move.ts
import { TreeNode, BaseOptions } from '../types'
import { DEFAULT_CHILDREN_KEY } from '../constants'
import { findPath } from '../find/findPath'

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
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options

    // 1. 获取源节点路径
    const sourcePath = findPath(tree, sourcePredicate, options)
    if (sourcePath.length === 0) return tree // 源节点不存在
    const sourceNode = sourcePath[sourcePath.length - 1]
    const sourceIsRoot = sourcePath.length === 1
    if (sourceIsRoot) return tree // 不能移动根节点

    // 2. 获取目标位置路径
    const destPath = findPath(tree, destinationPredicate, options)
    if (destPath.length === 0) return tree // 目标位置不存在

    // 根据 position 确定目标父节点和目标参考节点
    let targetParent: TreeNode | null = null
    let targetRef: TreeNode | null = null // 仅用于 before/after

    if (position === 'append' || position === 'prepend') {
        // 目标位置是父节点
        targetParent = destPath[destPath.length - 1]
    } else {
        // before/after 目标位置是参考节点
        targetRef = destPath[destPath.length - 1]
        if (destPath.length === 1) return tree // 参考节点是根节点，无法在其前后插入兄弟
        targetParent = destPath[destPath.length - 2]
    }

    if (!targetParent) return tree // 防御

    // 3. 检查是否将节点移动到自己或自己的后代中
    const isSourceAncestor = destPath.some((node) => node === sourceNode)
    if (isSourceAncestor) return tree // 不能移动到自身或后代

    // 4. 检查目标父节点是否与源父节点相同，并且参考节点是否会导致位置不变（例如将节点移动到自身之前/之后）
    // 这些情况可以允许，但需要处理（实际上相当于调整顺序），但如果不允许移动到自己后面或前面，可以忽略。
    // 我们允许移动，因为调整顺序也是合法的。

    // 5. 构建新树
    // 递归构建新树，遇到源节点跳过，遇到目标位置时插入源节点
    let moved = false

    const buildNode = (node: TreeNode): TreeNode | null => {
        // 如果是源节点，直接跳过（因为要移除）
        if (node === sourceNode) return null

        // 判断当前节点是否为目标父节点
        const isTargetParent = node === targetParent

        // 处理子节点
        const children = node[childrenKey]
        let newChildren: TreeNode[] = []

        if (Array.isArray(children)) {
            for (let i = 0; i < children.length; i++) {
                const child = children[i]

                // 如果已经移动完成，直接处理剩余子节点
                if (moved) {
                    const newChild = buildNode(child)
                    if (newChild !== null) newChildren.push(newChild)
                    continue
                }

                // 根据 position 和是否为参考节点来决定插入时机
                if (position === 'append' || position === 'prepend') {
                    // 对于 append/prepend，插入是在处理完所有子节点之前或之后进行的
                    // 我们将在最后处理
                    const newChild = buildNode(child)
                    if (newChild !== null) newChildren.push(newChild)
                } else {
                    // before/after 需要在遇到参考节点时插入
                    if (child === targetRef) {
                        if (position === 'before') {
                            // 在参考节点之前插入源节点
                            newChildren.push(sourceNode)
                            moved = true
                            const newChild = buildNode(child)
                            if (newChild !== null) newChildren.push(newChild)
                        } else {
                            // after: 先处理参考节点，再插入源节点
                            const newChild = buildNode(child)
                            if (newChild !== null) newChildren.push(newChild)
                            newChildren.push(sourceNode)
                            moved = true
                        }
                    } else {
                        const newChild = buildNode(child)
                        if (newChild !== null) newChildren.push(newChild)
                    }
                }
            }

            // 对于 append/prepend，需要在子节点列表处理完毕后统一插入
            if (!moved && isTargetParent) {
                if (position === 'append') {
                    newChildren.push(sourceNode)
                    moved = true
                } else if (position === 'prepend') {
                    newChildren.unshift(sourceNode)
                    moved = true
                }
            }
        } else {
            // 当前节点没有子节点数组，如果是目标父节点且需要插入
            if (!moved && isTargetParent) {
                if (position === 'append' || position === 'prepend') {
                    newChildren = [sourceNode]
                    moved = true
                }
            }
        }

        // 如果有子节点变化，返回新节点
        if (
            children !== newChildren &&
            (Array.isArray(children) || newChildren.length > 0)
        ) {
            return { ...node, [childrenKey]: newChildren }
        }
        return node
    }

    // 处理森林
    if (Array.isArray(tree)) {
        const newForest: TreeNode[] = []
        for (const root of tree) {
            if (moved) {
                // 已经移动完成，剩余根节点直接添加
                newForest.push(root)
            } else {
                const newRoot = buildNode(root)
                if (newRoot !== null) newForest.push(newRoot)
            }
        }
        return newForest
    } else {
        const result = buildNode(tree)
        return result !== null ? result : tree // 如果根节点被移除（不应该发生），返回原树
    }
}
