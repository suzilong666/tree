// relation/isAncestorOf.ts
import { TreeNode, BaseOptions } from '../types'
import { isAncestorOf } from './isAncestorOf'

export function isDescendantOf(
    tree: TreeNode | TreeNode[],
    descendantPredicate: (node: TreeNode) => boolean,
    ancestorPredicate: (node: TreeNode) => boolean,
    options: BaseOptions = {}
): boolean {
    return isAncestorOf(tree, ancestorPredicate, descendantPredicate, options)
}
