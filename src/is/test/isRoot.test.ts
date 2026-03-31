import { TreeNode } from '../../types'
import { isRoot } from '../isRoot'

// 辅助函数：创建测试数据
const createSimpleTree = (): TreeNode => ({
    id: 'root',
    children: [
        { id: 'child1', children: [{ id: 'grandchild1' }] },
        { id: 'child2' },
    ],
})

const createForest = (): TreeNode[] => [
    { id: 'tree1', children: [{ id: 'tree1-child1' }] },
    { id: 'tree2', children: [{ id: 'tree2-child1' }] },
]

describe('isRoot', () => {
    // ========== 单棵树场景 ==========
    describe('single tree', () => {
        test('returns true when node is the root (top-level node)', () => {
            const tree = createSimpleTree()
            const isRootNode = (node: TreeNode) => node.id === 'root'
            expect(isRoot(tree, isRootNode)).toBe(true)
        })

        test('returns false when node is not the root (deep node)', () => {
            const tree = createSimpleTree()
            const isChild = (node: TreeNode) => node.id === 'child1'
            const isGrandchild = (node: TreeNode) => node.id === 'grandchild1'
            expect(isRoot(tree, isChild)).toBe(false)
            expect(isRoot(tree, isGrandchild)).toBe(false)
        })

        test('returns false when node does not exist in tree', () => {
            const tree = createSimpleTree()
            const isMissing = (node: TreeNode) => node.id === 'nonexistent'
            expect(isRoot(tree, isMissing)).toBe(false)
        })

        test('returns true when tree is a single node and predicate matches', () => {
            const singleNode: TreeNode = { id: 'only' }
            const isOnly = (node: TreeNode) => node.id === 'only'
            expect(isRoot(singleNode, isOnly)).toBe(true)
        })
    })

    // ========== 森林（多根树数组） ==========
    describe('forest (array of roots)', () => {
        test('returns true when node is a root of any tree in the forest', () => {
            const forest = createForest()
            const isFirstRoot = (node: TreeNode) => node.id === 'tree1'
            const isSecondRoot = (node: TreeNode) => node.id === 'tree2'
            expect(isRoot(forest, isFirstRoot)).toBe(true)
            expect(isRoot(forest, isSecondRoot)).toBe(true)
        })

        test('returns false when node is a non-root node inside a tree of the forest', () => {
            const forest = createForest()
            const isChild = (node: TreeNode) => node.id === 'tree1-child1'
            expect(isRoot(forest, isChild)).toBe(false)
        })

        test('returns false when node does not exist in any tree', () => {
            const forest = createForest()
            const isMissing = (node: TreeNode) => node.id === 'missing'
            expect(isRoot(forest, isMissing)).toBe(false)
        })

        test('returns true when forest contains multiple roots and predicate matches one', () => {
            const forest = createForest()
            const isTree1 = (node: TreeNode) => node.id === 'tree1'
            expect(isRoot(forest, isTree1)).toBe(true)
        })
    })

    // ========== 边界情况 ==========
    describe('edge cases', () => {
        test('returns false when tree is empty array', () => {
            const emptyForest: TreeNode[] = []
            const anyPredicate = () => true
            expect(isRoot(emptyForest, anyPredicate)).toBe(false)
        })

        test('returns false when tree is null or undefined (ensureArray should handle)', () => {
            const anyPredicate = () => true
            // 假设 ensureArray 对 null/undefined 返回 []
            expect(isRoot(null as any, anyPredicate)).toBe(false)
            expect(isRoot(undefined as any, anyPredicate)).toBe(false)
        })

        test('returns false when predicate matches no node', () => {
            const tree = createSimpleTree()
            const neverMatch = () => false
            expect(isRoot(tree, neverMatch)).toBe(false)
        })
    })

    // ========== 复杂断言函数 ==========
    describe('complex predicate functions', () => {
        test('predicate can use node properties other than id', () => {
            const tree: TreeNode = {
                id: 'root',
                type: 'folder',
                children: [{ id: 'child', type: 'file' }],
            }
            const isFolder = (node: TreeNode) => node.type === 'folder'
            const isFile = (node: TreeNode) => node.type === 'file'
            expect(isRoot(tree, isFolder)).toBe(true)
            expect(isRoot(tree, isFile)).toBe(false)
        })

        test('predicate can use external context (closure)', () => {
            const targetRootId = 'root'
            const tree = createSimpleTree()
            const isTargetRoot = (node: TreeNode) => node.id === targetRootId
            expect(isRoot(tree, isTargetRoot)).toBe(true)
        })
    })

    // ========== 无副作用 / 幂等性 ==========
    describe('no side effects / idempotent', () => {
        test('multiple calls with same arguments return same result', () => {
            const tree = createSimpleTree()
            const isRootNode = (node: TreeNode) => node.id === 'root'
            const first = isRoot(tree, isRootNode)
            const second = isRoot(tree, isRootNode)
            expect(first).toBe(second)
        })
    })
})
