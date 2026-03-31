// 被测试函数（需要从实际模块导入）
import { BaseOptions, TreeNode } from '../../types'
import { isChildOf } from '../isChildOf'

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

describe('isChildOf', () => {
    // ========== 基础功能 ==========
    describe('basic direct parent-child relationship', () => {
        test('returns true when child is direct child of parent', () => {
            const tree = createTestTree()
            const isChildDirect = (node: TreeNode) => node.id === 'child1'
            const isParentRoot = (node: TreeNode) => node.id === 'root'
            expect(isChildOf(tree, isChildDirect, isParentRoot)).toBe(true)
        })

        test('returns false when child is NOT direct child of parent (but descendant)', () => {
            const tree = createTestTree()
            const isGrandchild = (node: TreeNode) => node.id === 'grandchild1'
            const isParentRoot = (node: TreeNode) => node.id === 'root'
            // grandchild1 是 root 的孙子，不是直接子节点
            expect(isChildOf(tree, isGrandchild, isParentRoot)).toBe(false)
        })

        test('returns false when parent is not the direct parent', () => {
            const tree = createTestTree()
            const isChild1 = (node: TreeNode) => node.id === 'child1'
            const isWrongParent = (node: TreeNode) => node.id === 'child2'
            expect(isChildOf(tree, isChild1, isWrongParent)).toBe(false)
        })

        test('returns false if child is not found in tree', () => {
            const tree = createTestTree()
            const isMissing = (node: TreeNode) => node.id === 'nonexistent'
            const anyParent = () => true
            expect(isChildOf(tree, isMissing, anyParent)).toBe(false)
        })

        test('returns false if parent is not found in path (child exists but parent predicate never true)', () => {
            const tree = createTestTree()
            const isChild1 = (node: TreeNode) => node.id === 'child1'
            const neverTrue = () => false
            expect(isChildOf(tree, isChild1, neverTrue)).toBe(false)
        })
    })

    // ========== 边界情况 ==========
    describe('edge cases', () => {
        test('returns false for single node tree (no parent)', () => {
            const singleNode: TreeNode = { id: 'only' }
            const isNode = (node: TreeNode) => node.id === 'only'
            const isAny = () => true
            expect(isChildOf(singleNode, isNode, isAny)).toBe(false)
        })

        test('returns false when tree is empty array', () => {
            const emptyForest: TreeNode[] = []
            const anyPredicate = () => true
            expect(isChildOf(emptyForest, anyPredicate, anyPredicate)).toBe(
                false
            )
        })

        test('returns false when tree is null/undefined? (assuming function handles gracefully)', () => {
            // 如果函数未处理空值，这里可能抛错；但根据常规实现，应返回 false
            // 若实际代码未做防护，可跳过该测试或增加 try-catch
            // 这里假设函数能处理 null（返回 false）
            const anyPredicate = () => true
            expect(isChildOf(null as any, anyPredicate, anyPredicate)).toBe(
                false
            )
            expect(
                isChildOf(undefined as any, anyPredicate, anyPredicate)
            ).toBe(false)
        })
    })

    // ========== 森林（数组输入） ==========
    describe('forest (array of roots)', () => {
        test('returns true when child is direct child of parent within same tree', () => {
            const forest = createForest()
            const isChild = (node: TreeNode) => node.id === 'tree1-child1'
            const isParent = (node: TreeNode) => node.id === 'tree1'
            expect(isChildOf(forest, isChild, isParent)).toBe(true)
        })

        test('returns false when child and parent belong to different trees', () => {
            const forest = createForest()
            const isChild = (node: TreeNode) => node.id === 'tree1-child1'
            const isParent = (node: TreeNode) => node.id === 'tree2' // 不同树的根
            expect(isChildOf(forest, isChild, isParent)).toBe(false)
        })

        test('returns false when child is not directly under root but deeper', () => {
            const forest: TreeNode[] = [
                {
                    id: 'root',
                    children: [{ id: 'level1', children: [{ id: 'level2' }] }],
                },
            ]
            const isDeep = (node: TreeNode) => node.id === 'level2'
            const isRoot = (node: TreeNode) => node.id === 'root'
            expect(isChildOf(forest, isDeep, isRoot)).toBe(false)
        })
    })

    // ========== 自定义 childrenKey (options) ==========
    describe('custom childrenKey option', () => {
        test('uses custom children property name', () => {
            const customTree: TreeNode = {
                id: 'root',
                subs: [{ id: 'child' }],
            }
            const isChild = (node: TreeNode) => node.id === 'child'
            const isParent = (node: TreeNode) => node.id === 'root'
            const options: BaseOptions = { childrenKey: 'subs' }
            expect(isChildOf(customTree, isChild, isParent, options)).toBe(true)
        })

        test('ignores default children when custom key is provided', () => {
            const mixedTree: any = {
                id: 'root',
                children: [{ id: 'wrong-child' }], // default key, but will be ignored
                subs: [{ id: 'real-child' }],
            }
            const isRealChild = (node: any) => node.id === 'real-child'
            const isRoot = (node: any) => node.id === 'root'
            const options = { childrenKey: 'subs' }
            expect(isChildOf(mixedTree, isRealChild, isRoot, options)).toBe(
                true
            )

            // 如果不指定 options，使用默认 'children'，则找不到 real-child
            expect(isChildOf(mixedTree, isRealChild, isRoot)).toBe(false)
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
            const isFileNode = (node: TreeNode) => node.type === 'file'
            const isFolderNode = (node: TreeNode) => node.type === 'folder'
            expect(isChildOf(tree, isFileNode, isFolderNode)).toBe(true)
        })

        test('predicates can use external context (closure)', () => {
            const targetChildId = 'child1'
            const targetParentId = 'root'
            const tree = createTestTree()
            const isTargetChild = (node: TreeNode) => node.id === targetChildId
            const isTargetParent = (node: TreeNode) =>
                node.id === targetParentId
            expect(isChildOf(tree, isTargetChild, isTargetParent)).toBe(true)
        })
    })

    // ========== 副作用与性能（可选） ==========
    describe('no side effects / idempotent', () => {
        test('multiple calls with same arguments return same result', () => {
            const tree = createTestTree()
            const isChild1 = (node: TreeNode) => node.id === 'child1'
            const isRoot = (node: TreeNode) => node.id === 'root'
            const first = isChildOf(tree, isChild1, isRoot)
            const second = isChildOf(tree, isChild1, isRoot)
            expect(first).toBe(second)
        })
    })
})
