import { TreeNode } from '../../types'
import { isParentOf } from '../isParentOf'

// 辅助函数：创建一个简单的树结构用于测试
const createTestTree = (): TreeNode => ({
    id: 'root',
    children: [
        {
            id: 'child1',
            children: [{ id: 'grandchild1' }],
        },
        {
            id: 'child2',
            children: [{ id: 'grandchild2' }],
        },
    ],
})

// 森林（多个根节点）
const createForest = (): TreeNode[] => [
    { id: 'tree1', children: [{ id: 'tree1-child1' }] },
    { id: 'tree2', children: [{ id: 'tree2-child1' }] },
]

describe('isParentOf', () => {
    // ========== 基础功能 ==========
    describe('basic direct parent-child relationship', () => {
        test('returns true when parent is direct parent of child', () => {
            const tree = createTestTree()
            const isParentRoot = (node: TreeNode) => node.id === 'root'
            const isChild1 = (node: TreeNode) => node.id === 'child1'
            expect(isParentOf(tree, isParentRoot, isChild1)).toBe(true)
        })

        test('returns false when parent is NOT direct parent (but ancestor)', () => {
            const tree = createTestTree()
            const isAncestorRoot = (node: TreeNode) => node.id === 'root'
            const isGrandchild = (node: TreeNode) => node.id === 'grandchild1'
            // root 是 grandchild1 的祖先，但不是直接父节点
            expect(isParentOf(tree, isAncestorRoot, isGrandchild)).toBe(false)
        })

        test('returns false when the candidate is not the actual parent', () => {
            const tree = createTestTree()
            const isWrongParent = (node: TreeNode) => node.id === 'child2'
            const isChild1 = (node: TreeNode) => node.id === 'child1'
            expect(isParentOf(tree, isWrongParent, isChild1)).toBe(false)
        })

        test('returns false if child is not found in tree', () => {
            const tree = createTestTree()
            const anyParent = () => true
            const isMissing = (node: TreeNode) => node.id === 'nonexistent'
            expect(isParentOf(tree, anyParent, isMissing)).toBe(false)
        })

        test('returns false if parent is not found in path (child exists but parent predicate never true)', () => {
            const tree = createTestTree()
            const neverTrue = () => false
            const isChild1 = (node: TreeNode) => node.id === 'child1'
            expect(isParentOf(tree, neverTrue, isChild1)).toBe(false)
        })
    })

    // ========== 边界情况 ==========
    describe('edge cases', () => {
        test('returns false for single node tree (no parent)', () => {
            const singleNode: TreeNode = { id: 'only' }
            const anyParent = () => true
            const isNode = (node: TreeNode) => node.id === 'only'
            expect(isParentOf(singleNode, anyParent, isNode)).toBe(false)
        })

        test('returns false when tree is empty array', () => {
            const emptyForest: TreeNode[] = []
            const anyPredicate = () => true
            expect(isParentOf(emptyForest, anyPredicate, anyPredicate)).toBe(
                false
            )
        })

        test('returns false when tree is null/undefined (assuming safe handling)', () => {
            const anyPredicate = () => true
            expect(isParentOf(null as any, anyPredicate, anyPredicate)).toBe(
                false
            )
            expect(
                isParentOf(undefined as any, anyPredicate, anyPredicate)
            ).toBe(false)
        })
    })

    // ========== 森林（数组输入） ==========
    describe('forest (array of roots)', () => {
        test('returns true when parent and child are in same tree with direct relationship', () => {
            const forest = createForest()
            const isParent = (node: TreeNode) => node.id === 'tree1'
            const isChild = (node: TreeNode) => node.id === 'tree1-child1'
            expect(isParentOf(forest, isParent, isChild)).toBe(true)
        })

        test('returns false when parent and child belong to different trees', () => {
            const forest = createForest()
            const isParent = (node: TreeNode) => node.id === 'tree2'
            const isChild = (node: TreeNode) => node.id === 'tree1-child1'
            expect(isParentOf(forest, isParent, isChild)).toBe(false)
        })

        test('returns false when child is deeper than one level under root', () => {
            const forest: TreeNode[] = [
                {
                    id: 'root',
                    children: [{ id: 'level1', children: [{ id: 'level2' }] }],
                },
            ]
            const isRoot = (node: TreeNode) => node.id === 'root'
            const isDeepChild = (node: TreeNode) => node.id === 'level2'
            expect(isParentOf(forest, isRoot, isDeepChild)).toBe(false)
        })
    })

    // ========== 自定义 childrenKey (options) ==========
    describe('custom childrenKey option', () => {
        test('uses custom children property name', () => {
            const customTree: TreeNode = {
                id: 'root',
                subs: [{ id: 'child' }],
            }
            const isParent = (node: TreeNode) => node.id === 'root'
            const isChild = (node: TreeNode) => node.id === 'child'
            const options = { childrenKey: 'subs' }
            expect(
                isParentOf(customTree as any, isParent, isChild, options)
            ).toBe(true)
        })

        test('ignores default children when custom key is provided', () => {
            const mixedTree: any = {
                id: 'root',
                children: [{ id: 'wrong-child' }], // default key, ignored
                subs: [{ id: 'real-child' }],
            }
            const isParent = (node: any) => node.id === 'root'
            const isRealChild = (node: any) => node.id === 'real-child'
            const options = { childrenKey: 'subs' }
            expect(isParentOf(mixedTree, isParent, isRealChild, options)).toBe(
                true
            )

            // Without options, default 'children' is used, so real-child not found
            expect(isParentOf(mixedTree, isParent, isRealChild)).toBe(false)
        })
    })

    // ========== 复杂断言函数 ==========
    describe('complex predicate functions', () => {
        test('predicates can use node properties other than id', () => {
            const tree: TreeNode = {
                id: 'parent',
                type: 'folder',
                children: [{ id: 'child', type: 'file', size: 100 }],
            }
            const isFolder = (node: TreeNode) => node.type === 'folder'
            const isFile = (node: TreeNode) => node.type === 'file'
            expect(isParentOf(tree, isFolder, isFile)).toBe(true)
        })

        test('predicates can use external context (closure)', () => {
            const targetParentId = 'root'
            const targetChildId = 'child1'
            const tree = createTestTree()
            const isTargetParent = (node: TreeNode) =>
                node.id === targetParentId
            const isTargetChild = (node: TreeNode) => node.id === targetChildId
            expect(isParentOf(tree, isTargetParent, isTargetChild)).toBe(true)
        })
    })

    // ========== 参数顺序强调（与 isChildOf 对比） ==========
    describe('parameter order distinction (compared to isChildOf)', () => {
        test('isParentOf(parentPredicate, childPredicate) is opposite of isChildOf', () => {
            const tree = createTestTree()
            const isRoot = (node: TreeNode) => node.id === 'root'
            const isChild1 = (node: TreeNode) => node.id === 'child1'

            // isParentOf: parent then child
            expect(isParentOf(tree, isRoot, isChild1)).toBe(true)

            // isChildOf would be: child then parent
            // Assuming isChildOf exists: isChildOf(tree, isChild1, isRoot) === true
            // This test is just to clarify the order; no actual isChildOf call needed.
        })
    })

    // ========== 无副作用/幂等性 ==========
    describe('no side effects / idempotent', () => {
        test('multiple calls with same arguments return same result', () => {
            const tree = createTestTree()
            const isRoot = (node: TreeNode) => node.id === 'root'
            const isChild1 = (node: TreeNode) => node.id === 'child1'
            const first = isParentOf(tree, isRoot, isChild1)
            const second = isParentOf(tree, isRoot, isChild1)
            expect(first).toBe(second)
        })
    })
})
