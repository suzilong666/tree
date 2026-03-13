import { TreeNode } from '../../types/tree'
import { depthFirst } from '../depthFirst'

describe('depthFirst 深度优先遍历', () => {
    // 构建测试树
    const createTree = (): TreeNode => ({
        id: 'A',
        children: [
            {
                id: 'B',
                children: [{ id: 'D' }, { id: 'E' }],
            },
            {
                id: 'C',
                children: [{ id: 'F' }],
            },
        ],
    })

    // 森林（多个根节点）
    const createForest = (): TreeNode[] => [
        { id: 'X', children: [{ id: 'X1' }] },
        { id: 'Y', children: [{ id: 'Y1' }] },
    ]

    describe('前序遍历 (order = "pre")', () => {
        it('应该按前序顺序遍历单个树', () => {
            const tree = createTree()
            const callback = jest.fn()

            depthFirst(tree, callback, { order: 'pre' })

            // 预期前序顺序：A, B, D, E, C, F
            expect(callback).toHaveBeenCalledTimes(6)
            const calledIds = callback.mock.calls.map((call) => call[0].id)
            expect(calledIds).toEqual(['A', 'B', 'D', 'E', 'C', 'F'])
        })

        it('应该遍历森林（多个根节点）', () => {
            const forest = createForest()
            const callback = jest.fn()

            depthFirst(forest, callback, { order: 'pre' })

            // 前序顺序：X, X1, Y, Y1
            expect(callback).toHaveBeenCalledTimes(4)
            const calledIds = callback.mock.calls.map((call) => call[0].id)
            expect(calledIds).toEqual(['X', 'X1', 'Y', 'Y1'])
        })

        it('应该对单个节点执行回调', () => {
            const node = { id: 'single' }
            const callback = jest.fn()

            depthFirst(node, callback, { order: 'pre' })

            expect(callback).toHaveBeenCalledTimes(1)
            expect(callback).toHaveBeenCalledWith([
                node,
                { depth: 0, parent: null, path: [node] },
            ])
        })
    })

    describe('后序遍历 (order = "post")', () => {
        it('应该按后序顺序遍历单个树', () => {
            const tree = createTree()
            const callback = jest.fn()

            depthFirst(tree, callback, { order: 'post' })

            // 预期后序顺序：D, E, B, F, C, A
            expect(callback).toHaveBeenCalledTimes(6)
            const calledIds = callback.mock.calls.map((call) => call[0].id)
            expect(calledIds).toEqual(['D', 'E', 'B', 'F', 'C', 'A'])
        })

        it('应该遍历森林（多个根节点）', () => {
            const forest = createForest()
            const callback = jest.fn()

            depthFirst(forest, callback, { order: 'post' })

            // 后序顺序：X1, X, Y1, Y
            expect(callback).toHaveBeenCalledTimes(4)
            const calledIds = callback.mock.calls.map((call) => call[0].id)
            expect(calledIds).toEqual(['X1', 'X', 'Y1', 'Y'])
        })

        it('应该对单个节点执行回调', () => {
            const node = { id: 'single' }
            const callback = jest.fn()

            depthFirst(node, callback, { order: 'post' })

            expect(callback).toHaveBeenCalledTimes(1)
            expect(callback).toHaveBeenCalledWith(node)
        })
    })

    describe('自定义 childrenKey', () => {
        it('应该使用自定义的子节点字段名', () => {
            const tree = {
                id: 'root',
                subs: [{ id: 'child', subs: [] }],
            }
            const callback = jest.fn()

            depthFirst(tree, callback, { childrenKey: 'subs', order: 'pre' })

            expect(callback).toHaveBeenCalledTimes(2)
            expect(callback.mock.calls[0][0].id).toBe('root')
            expect(callback.mock.calls[1][0].id).toBe('child')
        })
    })

    describe('边界情况', () => {
        it('应该处理空数组输入（不调用回调）', () => {
            const callback = jest.fn()
            depthFirst([], callback)
            expect(callback).not.toHaveBeenCalled()
        })

        it('应该处理 null 或 undefined 输入', () => {
            const callback = jest.fn()
            // 假设 ensureArray 将 null/undefined 转换为空数组，因此不调用回调
            depthFirst(null as any, callback)
            depthFirst(undefined as any, callback)
            expect(callback).not.toHaveBeenCalled()
        })

        it('应该跳过没有 children 字段的节点', () => {
            const tree = {
                id: 'root',
                // 没有 children 字段
            }
            const callback = jest.fn()
            depthFirst(tree, callback)
            expect(callback).toHaveBeenCalledTimes(1)
        })

        it('应该跳过 children 字段不是数组的节点', () => {
            const tree = {
                id: 'root',
                children: 'not an array' as any,
            }
            const callback = jest.fn()
            depthFirst(tree, callback)
            expect(callback).toHaveBeenCalledTimes(1)
        })

        it('应该正确处理嵌套的空 children 数组', () => {
            const tree = {
                id: 'root',
                children: [
                    { id: 'child1', children: [] },
                    { id: 'child2' }, // 无 children 字段
                ],
            }
            const callback = jest.fn()
            depthFirst(tree, callback, { order: 'pre' })
            expect(callback).toHaveBeenCalledTimes(3)
            expect(callback.mock.calls.map((c) => c[0].id)).toEqual([
                'root',
                'child1',
                'child2',
            ])
        })
    })

    describe('order 参数的其他值', () => {
        it('当 order 既不是 "pre" 也不是 "post" 时，应默认按 "pre" 处理', () => {
            const tree = createTree()
            const callback = jest.fn()

            // 传入非法 order 值
            depthFirst(tree, callback, { order: 'invalid' as any })

            // 期望按前序处理
            expect(callback).toHaveBeenCalledTimes(6)
            const calledIds = callback.mock.calls.map((call) => call[0].id)
            expect(calledIds).toEqual(['A', 'B', 'D', 'E', 'C', 'F'])
        })
    })

    describe('复杂场景', () => {
        it('应该正确遍历非平衡树', () => {
            const tree = {
                id: '1',
                children: [
                    {
                        id: '2',
                        children: [{ id: '3' }],
                    },
                    { id: '4' },
                ],
            }
            const callback = jest.fn()

            depthFirst(tree, callback, { order: 'pre' })
            expect(callback.mock.calls.map((c) => c[0].id)).toEqual([
                '1',
                '2',
                '3',
                '4',
            ])

            callback.mockClear()
            depthFirst(tree, callback, { order: 'post' })
            expect(callback.mock.calls.map((c) => c[0].id)).toEqual([
                '3',
                '2',
                '4',
                '1',
            ])
        })
    })
})
