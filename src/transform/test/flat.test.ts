import { flat } from '../flat'
import { TreeNode } from '../../types'

describe('flat 展平树为数组', () => {
    // 测试树结构（使用 id 标识节点）
    const tree: TreeNode = {
        id: 'root',
        children: [
            {
                id: 'a',
                children: [
                    { id: 'a1' },
                    { id: 'a2', children: [{ id: 'a2x' }] },
                ],
            },
            {
                id: 'b',
                children: [{ id: 'b1' }],
            },
            { id: 'c' },
        ],
    }

    describe('基本展平', () => {
        it('应展平单个节点', () => {
            const node: TreeNode = { id: 'only' }
            const result = flat(node)
            expect(result.map((n) => n.id)).toEqual(['only'])
        })

        it('应展平多节点树（默认 dfs pre）', () => {
            const result = flat(tree)
            expect(result.map((n) => n.id)).toEqual([
                'root',
                'a',
                'a1',
                'a2',
                'a2x',
                'b',
                'b1',
                'c',
            ])
        })

        it('应展平森林（多根节点）', () => {
            const forest: TreeNode[] = [
                { id: 'r1', children: [{ id: 'r1c1' }] },
                { id: 'r2', children: [{ id: 'r2c1' }] },
            ]
            const result = flat(forest)
            // dfs pre 顺序：r1, r1c1, r2, r2c1
            expect(result.map((n) => n.id)).toEqual([
                'r1',
                'r1c1',
                'r2',
                'r2c1',
            ])
        })
    })

    describe('遍历策略与顺序', () => {
        it('dfs 前序（默认）', () => {
            const result = flat(tree, { strategy: 'dfs', order: 'pre' })
            expect(result.map((n) => n.id)).toEqual([
                'root',
                'a',
                'a1',
                'a2',
                'a2x',
                'b',
                'b1',
                'c',
            ])
        })

        it('dfs 后序', () => {
            const result = flat(tree, { strategy: 'dfs', order: 'post' })
            expect(result.map((n) => n.id)).toEqual([
                'a1',
                'a2x',
                'a2',
                'a',
                'b1',
                'b',
                'c',
                'root',
            ])
        })

        it('bfs 广度优先', () => {
            const result = flat(tree, { strategy: 'bfs' })
            expect(result.map((n) => n.id)).toEqual([
                'root',
                'a',
                'b',
                'c',
                'a1',
                'a2',
                'b1',
                'a2x',
            ])
        })

        it('bfs 时传入 order 选项应被忽略（结果仍为 bfs 顺序）', () => {
            const result = flat(tree, { strategy: 'bfs', order: 'post' })
            expect(result.map((n) => n.id)).toEqual([
                'root',
                'a',
                'b',
                'c',
                'a1',
                'a2',
                'b1',
                'a2x',
            ])
        })

        it('默认策略应为 dfs，默认顺序应为 pre', () => {
            const result1 = flat(tree) // 无 options
            const result2 = flat(tree, {}) // 空 options
            const expected = ['root', 'a', 'a1', 'a2', 'a2x', 'b', 'b1', 'c']
            expect(result1.map((n) => n.id)).toEqual(expected)
            expect(result2.map((n) => n.id)).toEqual(expected)
        })
    })

    describe('自定义 childrenKey', () => {
        const customTree: TreeNode = {
            id: 'root',
            subs: [{ id: 'a', subs: [{ id: 'a1' }] }, { id: 'b' }],
        }

        it('应使用指定的 childrenKey', () => {
            const result = flat(customTree, { childrenKey: 'subs' })
            // dfs pre 顺序：root, a, a1, b
            expect(result.map((n) => n.id)).toEqual(['root', 'a', 'a1', 'b'])
        })

        it('使用错误的 childrenKey 应只返回根节点', () => {
            const result = flat(customTree, { childrenKey: 'children' })
            // root 下的 a 和 b 不会被当作子节点遍历，所以只返回 root
            expect(result.map((n) => n.id)).toEqual(['root'])
        })
    })

    describe('边界情况', () => {
        it('空数组应返回空数组', () => {
            expect(flat([])).toEqual([])
        })

        it('传入 null 或 undefined 应返回空数组（由 ensureArray 处理）', () => {
            expect(flat(null as any)).toEqual([])
            expect(flat(undefined as any)).toEqual([])
        })

        it('节点 children 为非数组时应忽略子节点', () => {
            const weird: TreeNode = {
                id: 'root',
                children: 'not-array' as any,
                subs: [{ id: 'child' }],
            }
            const result = flat(weird)
            // 不会遍历 subs 中的 child
            expect(result.map((n) => n.id)).toEqual(['root'])
        })

        it('节点没有 children 字段应正常返回自身', () => {
            const leaf: TreeNode = { id: 'leaf' }
            expect(flat(leaf).map((n) => n.id)).toEqual(['leaf'])
        })

        it('嵌套深度很深的树也能正确展平（不崩溃）', () => {
            // 生成一个深度 100 的链式树
            const deepChain: TreeNode = { id: '0' }
            let current = deepChain
            for (let i = 1; i < 100; i++) {
                const next = { id: String(i) }
                current.children = [next]
                current = next
            }
            const result = flat(deepChain)
            expect(result.length).toBe(100)
            expect(result[0].id).toBe('0')
            expect(result[99].id).toBe('99')
        })
    })

    describe('确保正确调用 traverse', () => {
        it('应透传 childrenKey 和 order 给 traverse', () => {
            // 通过自定义 childrenKey 和 order 间接验证
            const specialTree: TreeNode = {
                id: 'root',
                items: [
                    { id: 'child1', items: [{ id: 'grandchild' }] },
                    { id: 'child2' },
                ],
            }
            const result = flat(specialTree, {
                childrenKey: 'items',
                strategy: 'dfs',
                order: 'post',
            })
            // 后序顺序：grandchild, child1, child2, root
            expect(result.map((n) => n.id)).toEqual([
                'grandchild',
                'child1',
                'child2',
                'root',
            ])
        })
    })
})
