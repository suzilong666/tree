// modify/swap.ts
import { TreeNode, BaseOptions } from '../types'
import { DEFAULT_CHILDREN_KEY } from '../constants'
import { findPath } from '../find/findPath'

export function swap(
    tree: TreeNode | TreeNode[],
    predicateA: (node: TreeNode) => boolean,
    predicateB: (node: TreeNode) => boolean,
    options: BaseOptions = {}
): TreeNode | TreeNode[] {
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options

    // 获取路径
    const pathA = findPath(tree, predicateA, { childrenKey })
    const pathB = findPath(tree, predicateB, { childrenKey })
    if (pathA.length === 0 || pathB.length === 0) return tree
    const nodeA = pathA[pathA.length - 1]
    const nodeB = pathB[pathB.length - 1]
    if (nodeA === nodeB) return tree

    // 检查祖先关系
    const isAncestor = (ancestor: TreeNode, descendant: TreeNode): boolean => {
        const stack = [ancestor]
        while (stack.length) {
            const current = stack.pop()!
            if (current === descendant) return true
            const children = current[childrenKey]
            if (Array.isArray(children)) stack.push(...children)
        }
        return false
    }
    if (isAncestor(nodeA, nodeB) || isAncestor(nodeB, nodeA)) return tree

    // 深拷贝
    const cloneMap = new WeakMap<TreeNode, TreeNode>()
    const cloneNode = (node: TreeNode): TreeNode => {
        const cloned = { ...node }
        cloneMap.set(node, cloned)
        const children = node[childrenKey]
        if (Array.isArray(children)) {
            cloned[childrenKey] = children.map((child) => cloneNode(child))
        } else {
            delete cloned[childrenKey]
        }
        return cloned
    }

    const clonedTree = Array.isArray(tree)
        ? tree.map((root) => cloneNode(root))
        : cloneNode(tree)
    const clonedNodeA = cloneMap.get(nodeA)
    const clonedNodeB = cloneMap.get(nodeB)
    if (!clonedNodeA || !clonedNodeB) return tree

    // 处理根节点交换（森林中的两个根）
    if (Array.isArray(tree) && pathA.length === 1 && pathB.length === 1) {
        const forest = clonedTree as TreeNode[]
        const indexA = forest.indexOf(clonedNodeA)
        const indexB = forest.indexOf(clonedNodeB)
        if (indexA !== -1 && indexB !== -1) {
            ;[forest[indexA], forest[indexB]] = [forest[indexB], forest[indexA]]
            return forest
        }
    }

    // 获取父节点
    const getParentInCloned = (nodeInOriginal: TreeNode): TreeNode | null => {
        const path = findPath(tree, (n) => n === nodeInOriginal, {
            childrenKey,
        })
        if (path.length <= 1) return null
        const originalParent = path[path.length - 2]
        return cloneMap.get(originalParent) || null
    }
    const parentA = getParentInCloned(nodeA)
    const parentB = getParentInCloned(nodeB)

    // 同一父节点，直接交换 children 数组位置
    if (parentA === parentB && parentA) {
        const children = parentA[childrenKey] as TreeNode[]
        const indexA = children.indexOf(clonedNodeA)
        const indexB = children.indexOf(clonedNodeB)
        if (indexA !== -1 && indexB !== -1) {
            ;[children[indexA], children[indexB]] = [
                children[indexB],
                children[indexA],
            ]
            return clonedTree
        }
    }

    // 不同父节点
    const getOriginalIndex = (
        parent: TreeNode | null,
        child: TreeNode
    ): number => {
        if (!parent) return -1
        const children = parent[childrenKey]
        if (!Array.isArray(children)) return -1
        return children.indexOf(child)
    }
    const indexA = parentA ? getOriginalIndex(parentA, nodeA) : -1
    const indexB = parentB ? getOriginalIndex(parentB, nodeB) : -1

    const removeFromParent = (parent: TreeNode | null, child: TreeNode) => {
        if (!parent) return
        const children = parent[childrenKey]
        if (!Array.isArray(children)) return
        const idx = children.indexOf(child)
        if (idx !== -1) children.splice(idx, 1)
    }
    removeFromParent(parentA, clonedNodeA)
    removeFromParent(parentB, clonedNodeB)

    const insertAt = (
        parent: TreeNode | null,
        child: TreeNode,
        idx: number
    ) => {
        if (!parent) return
        let children = parent[childrenKey]
        if (!Array.isArray(children)) {
            children = []
            parent[childrenKey] = children
        }
        if (idx >= 0 && idx <= children.length) {
            children.splice(idx, 0, child)
        } else {
            children.push(child)
        }
    }
    insertAt(parentB, clonedNodeA, indexA)
    insertAt(parentA, clonedNodeB, indexB)

    return clonedTree
}
