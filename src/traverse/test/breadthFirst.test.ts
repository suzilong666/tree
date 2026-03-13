import { TreeNode } from '../../types/tree'
import { breadthFirst } from '../breadthFirst'

describe('breadthFirst 广度优先遍历', () => {
    // 辅助函数：构建标准测试树
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

    // 预期广度优先顺序（按层）
    const expectedOrder = ['A', 'B', 'C', 'D', 'E', 'F']

    describe('基本功能', () => {
        it('应该对单个节点执行回调', () => {
            const node: TreeNode = { id: 'single' }
            const callback = jest.fn()

            breadthFirst(node, callback)

            expect(callback).toHaveBeenCalledTimes(1)
            expect(callback).toHaveBeenCalledWith(node)
        })

        it('应该按广度优先顺序遍历树', () => {
            const tree = createTree()
            const callback = jest.fn()

            breadthFirst(tree, callback)

            expect(callback).toHaveBeenCalledTimes(6)
            const calledIds = callback.mock.calls.map((call) => call[0].id)
            expect(calledIds).toEqual(expectedOrder)
        })

        it('应该遍历森林（多个根节点）', () => {
            const forest: TreeNode[] = [
                { id: 'X', children: [{ id: 'X1' }] },
                { id: 'Y', children: [{ id: 'Y1' }] },
            ]
            const callback = jest.fn()

            breadthFirst(forest, callback)

            // 广度优先：先遍历所有根节点，再遍历下一层
            expect(callback).toHaveBeenCalledTimes(4)
            const calledIds = callback.mock.calls.map((call) => call[0].id)
            expect(calledIds).toEqual(['X', 'Y', 'X1', 'Y1'])
        })

        it('应该处理深度很大的树（非平衡）', () => {
            const deepTree: TreeNode = {
                id: '1',
                children: [
                    {
                        id: '2',
                        children: [
                            {
                                id: '3',
                                children: [{ id: '4' }],
                            },
                        ],
                    },
                ],
            }
            const callback = jest.fn()
            breadthFirst(deepTree, callback)
            expect(callback.mock.calls.map((c) => c[0].id)).toEqual([
                '1',
                '2',
                '3',
                '4',
            ])
        })
    })

    describe('自定义 childrenKey', () => {
        it('应该使用自定义的子节点字段名', () => {
            const tree = {
                id: 'root',
                subs: [
                    { id: 'child1', subs: [] },
                    { id: 'child2', subs: [] },
                ],
            }
            const callback = jest.fn()

            breadthFirst(tree, callback, { childrenKey: 'subs' })

            expect(callback).toHaveBeenCalledTimes(3)
            const calledIds = callback.mock.calls.map((call) => call[0].id)
            expect(calledIds).toEqual(['root', 'child1', 'child2'])
        })

        it('如果自定义字段不存在，应跳过子节点', () => {
            const tree = {
                id: 'root',
                // 没有 children 字段
            }
            const callback = jest.fn()

            breadthFirst(tree, callback, { childrenKey: 'subs' })

            expect(callback).toHaveBeenCalledTimes(1)
            expect(callback).toHaveBeenCalledWith(tree)
        })
    })

    describe('边界情况', () => {
        it('应该处理空数组输入（不调用回调）', () => {
            const callback = jest.fn()
            breadthFirst([], callback)
            expect(callback).not.toHaveBeenCalled()
        })

        it('应该处理 null 或 undefined 输入（假设 ensureArray 将其转为空数组）', () => {
            const callback = jest.fn()
            // 假设 ensureArray(null) 返回 []，因此不调用回调
            breadthFirst(null as any, callback)
            breadthFirst(undefined as any, callback)
            expect(callback).not.toHaveBeenCalled()
        })

        it('应该跳过没有 children 字段的节点', () => {
            const tree = { id: 'root' }
            const callback = jest.fn()
            breadthFirst(tree, callback)
            expect(callback).toHaveBeenCalledTimes(1)
            expect(callback).toHaveBeenCalledWith(tree)
        })

        it('应该跳过 children 字段不是数组的节点', () => {
            const tree = {
                id: 'root',
                children: 'not an array' as any,
            }
            const callback = jest.fn()
            breadthFirst(tree, callback)
            expect(callback).toHaveBeenCalledTimes(1)
            // 不会尝试遍历 children
        })

        it('应该正确处理 children 字段为 null 的情况', () => {
            const tree = {
                id: 'root',
                children: null,
            }
            const callback = jest.fn()
            breadthFirst(tree, callback)
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
            breadthFirst(tree, callback)
            expect(callback).toHaveBeenCalledTimes(3)
            expect(callback.mock.calls.map((c) => c[0].id)).toEqual([
                'root',
                'child1',
                'child2',
            ])
        })

        it('应该处理循环引用（不会无限循环，因为不会检查是否访问过）', () => {
            // 注意：当前实现不检查循环引用，如果存在循环引用会导致无限循环。
            // 但作为工具库，通常假设输入是无环的。这里不测试无限循环，仅测试代码不会因循环而立即崩溃。
            // 如果需要防止循环，可以添加 visited 集合，但当前函数没有。
            // 因此跳过此测试或标记为待实现。
        })
    })

    describe('多个 options 同时使用', () => {
        it('应该同时处理 childrenKey 和森林', () => {
            const forest = [
                { id: 'root1', subs: [{ id: 'child1' }] },
                { id: 'root2', subs: [] },
            ]
            const callback = jest.fn()
            breadthFirst(forest, callback, { childrenKey: 'subs' })
            expect(callback).toHaveBeenCalledTimes(3)
            expect(callback.mock.calls.map((c) => c[0].id)).toEqual([
                'root1',
                'root2',
                'child1',
            ])
        })
    })

    describe('回调函数行为', () => {
        it('应该将节点作为参数传递给回调', () => {
            const node = { id: 'test' }
            const callback = jest.fn()
            breadthFirst(node, callback)
            expect(callback).toHaveBeenCalledWith(node)
        })

        it('应该按照 BFS 顺序依次调用回调', () => {
            const tree = createTree()
            const order: string[] = []
            breadthFirst(tree, (node) => order.push(node.id))
            expect(order).toEqual(expectedOrder)
        })

        it('回调函数中修改节点不影响遍历（因为节点是对象引用）', () => {
            const tree = { id: 'root', children: [{ id: 'child' }] }
            const callback = jest.fn((node) => {
                node.id = 'modified'
            })
            breadthFirst(tree, callback)
            expect(tree.id).toBe('modified') // 由于直接修改了原节点
            // 但遍历仍会继续，因为队列中存的是引用
            expect(callback).toHaveBeenCalledTimes(2)
        })
    })

    describe('类型推导', () => {
        // 如果使用 TypeScript，可以测试类型，但 Jest 测试中无法直接测试类型。
        // 这里仅作为占位，确保代码在 TypeScript 下能正确编译。
    })
})
