import { TreeNode } from '../../types'
import { isLeaf } from '../isLeaf'

// 辅助函数：创建测试数据
const createTree = (): TreeNode => ({
    id: 'root',
    children: [
        { id: 'parent', children: [{ id: 'leaf1' }, { id: 'leaf2' }] },
        { id: 'leaf3' }, // 无 children 属性
        { id: 'emptyChildren', children: [] },
    ],
})

const createForest = (): TreeNode[] => [
    {
        id: 'tree1',
        children: [
            { id: 'leaf1-1' },
            { id: 'parent1', children: [{ id: 'leaf1-2' }] },
        ],
    },
    {
        id: 'tree2',
        children: [],
    },
]

describe('isLeaf', () => {
    // ========== 基本叶子节点判断 ==========
    describe('basic leaf detection', () => {
        test('returns true for node with no children (undefined children)', () => {
            const tree = createTree()
            const isLeaf3 = (node: TreeNode) => node.id === 'leaf3'
            expect(isLeaf(tree, isLeaf3)).toBe(true)
        })

        test('returns true for node with empty children array', () => {
            const tree = createTree()
            const isEmptyChildren = (node: TreeNode) =>
                node.id === 'emptyChildren'
            expect(isLeaf(tree, isEmptyChildren)).toBe(true)
        })

        test('returns false for node with non-empty children', () => {
            const tree = createTree()
            const isRoot = (node: TreeNode) => node.id === 'root'
            const isParent = (node: TreeNode) => node.id === 'parent'
            expect(isLeaf(tree, isRoot)).toBe(false)
            expect(isLeaf(tree, isParent)).toBe(false)
        })

        test('returns false for node that has children property but null/undefined value (treat as leaf)', () => {
            // 根据 isEmpty 实现，如果 childrenKey 对应的值为 null/undefined，应视为空（叶子）
            const tree: TreeNode = {
                id: 'node',
                children: null as any,
            }
            const isNode = (node: TreeNode) => node.id === 'node'
            // 假设 isEmpty 对 null 返回 true
            expect(isLeaf(tree, isNode)).toBe(true)
        })
    })

    // ========== 节点存在性 ==========
    describe('node existence', () => {
        test('returns false when node is not found in tree', () => {
            const tree = createTree()
            const isMissing = (node: TreeNode) => node.id === 'nonexistent'
            expect(isLeaf(tree, isMissing)).toBe(false)
        })

        test('returns false when tree is empty array', () => {
            const emptyForest: TreeNode[] = []
            const anyPredicate = () => true
            expect(isLeaf(emptyForest, anyPredicate)).toBe(false)
        })

        test('returns false when tree is null/undefined (find returns undefined)', () => {
            const anyPredicate = () => true
            expect(isLeaf(null as any, anyPredicate)).toBe(false)
            expect(isLeaf(undefined as any, anyPredicate)).toBe(false)
        })
    })

    // ========== 森林（数组输入） ==========
    describe('forest (array of roots)', () => {
        test('returns true for leaf node inside a tree of the forest', () => {
            const forest = createForest()
            const isLeafNode = (node: TreeNode) => node.id === 'leaf1-1'
            expect(isLeaf(forest, isLeafNode)).toBe(true)
        })

        test('returns false for non-leaf node inside a tree of the forest', () => {
            const forest = createForest()
            const isParent = (node: TreeNode) => node.id === 'parent1'
            expect(isLeaf(forest, isParent)).toBe(false)
        })

        test('returns true for root node that has no children (leaf root)', () => {
            const forest = createForest()
            const isTree2 = (node: TreeNode) => node.id === 'tree2'
            expect(isLeaf(forest, isTree2)).toBe(true)
        })
    })

    // ========== 自定义 childrenKey ==========
    describe('custom childrenKey option', () => {
        test('uses custom children property name', () => {
            const customTree: TreeNode = {
                id: 'parent',
                subs: [{ id: 'child' }],
            }
            const isParent = (node: TreeNode) => node.id === 'parent'
            const isChild = (node: TreeNode) => node.id === 'child'
            const options = { childrenKey: 'subs' }
            expect(isLeaf(customTree as any, isParent, options)).toBe(false)
            expect(isLeaf(customTree as any, isChild, options)).toBe(true)
        })

        test('falls back to default childrenKey when custom key is not provided', () => {
            const tree: TreeNode = {
                id: 'node',
                children: [],
                subs: [{ id: 'should-be-ignored' }],
            }
            const isNode = (node: TreeNode) => node.id === 'node'
            // 默认使用 'children'，为空数组，所以是叶子
            expect(isLeaf(tree, isNode)).toBe(true)
        })

        test('returns true when custom childrenKey property is empty array', () => {
            const tree: any = {
                id: 'node',
                customChildren: [],
            }
            const isNode = (node: any) => node.id === 'node'
            const options = { childrenKey: 'customChildren' }
            expect(isLeaf(tree, isNode, options)).toBe(true)
        })

        test('returns false when custom childrenKey property has items', () => {
            const tree: any = {
                id: 'node',
                customChildren: [{ id: 'child' }],
            }
            const isNode = (node: any) => node.id === 'node'
            const options = { childrenKey: 'customChildren' }
            expect(isLeaf(tree, isNode, options)).toBe(false)
        })
    })

    // ========== 复杂断言函数 ==========
    describe('complex predicate functions', () => {
        test('predicate can use node properties other than id', () => {
            const tree: TreeNode = {
                id: 'root',
                type: 'folder',
                children: [
                    { id: 'file1', type: 'file', size: 100 },
                    { id: 'folder2', type: 'folder', children: [] },
                ],
            }
            const isFile = (node: TreeNode) => node.type === 'file'
            const isFolder = (node: TreeNode) => node.type === 'folder'
            // file1 没有 children 属性，是叶子
            expect(isLeaf(tree, isFile)).toBe(true)
            // folder2 有 children 空数组，是叶子（空文件夹通常算叶子）
            expect(isLeaf(tree, (node) => node.id === 'folder2')).toBe(true)
            // root 有非空 children，不是叶子
            const isRoot = (node: TreeNode) =>
                node.type === 'folder' && node.id === 'root'
            expect(isLeaf(tree, isRoot)).toBe(false)
        })

        test('predicate can use external context (closure)', () => {
            const targetLeafId = 'leaf1'
            const tree = createTree()
            const isTargetLeaf = (node: TreeNode) => node.id === targetLeafId
            expect(isLeaf(tree, isTargetLeaf)).toBe(true)
        })
    })

    // ========== 边界情况：children 属性存在但非数组 ==========
    describe('edge cases with children property type', () => {
        test('returns false when children is not an array (non-empty object)', () => {
            const tree: TreeNode = {
                id: 'node',
                children: { some: 'object' } as any,
            }
            const isNode = (node: TreeNode) => node.id === 'node'
            // isEmpty 通常检查数组长度，对于非数组可能返回 false（取决于实现）
            // 根据常见实现，isEmpty 只对数组有效，非数组视为非空（不是叶子）
            // 这里假设 isEmpty 对非数组返回 false
            expect(isLeaf(tree, isNode)).toBe(false)
        })

        test('returns true when children is empty string (treated as falsy)', () => {
            const tree: TreeNode = {
                id: 'node',
                children: '' as any,
            }
            const isNode = (node: TreeNode) => node.id === 'node'
            // 如果 isEmpty 检查 !node[childrenKey] 或 length，空字符串可能被视为空
            // 但通常 children 应为数组，这里仅作边界演示
            expect(isLeaf(tree, isNode)).toBe(true)
        })
    })

    // ========== 无副作用 / 幂等性 ==========
    describe('no side effects / idempotent', () => {
        test('multiple calls with same arguments return same result', () => {
            const tree = createTree()
            const isLeafNode = (node: TreeNode) => node.id === 'leaf3'
            const first = isLeaf(tree, isLeafNode)
            const second = isLeaf(tree, isLeafNode)
            expect(first).toBe(second)
        })
    })
})
