import { findAll } from '../findAll'
import { TreeNode } from '../../types/tree'

describe('findAll 查找所有匹配节点', () => {
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

    describe('基本查找', () => {
        it('应返回所有满足条件的节点', () => {
            const nodes = findAll(tree, (node) =>
                (node.id as string).includes('a')
            )
            expect(nodes.map((n) => n.id)).toEqual(['a', 'a1', 'a2', 'a2x'])
        })

        it('无满足条件的节点应返回空数组', () => {
            const nodes = findAll(tree, (node) => node.id === 'nonexistent')
            expect(nodes).toEqual([])
        })

        it('应返回所有节点（当条件恒为 true）', () => {
            const nodes = findAll(tree, () => true)
            // 默认 dfs pre 顺序
            expect(nodes.map((n) => n.id)).toEqual([
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
    })

    describe('遍历策略 (strategy) 和顺序 (order) 对结果顺序的影响', () => {
        // 测试策略和顺序对返回节点顺序的影响
        it('默认策略 dfs 且 order pre 应按前序返回', () => {
            const nodes = findAll(tree, () => true) // 无 options
            expect(nodes.map((n) => n.id)).toEqual([
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

        it('dfs 且 order pre 应按前序返回', () => {
            const nodes = findAll(tree, () => true, {
                strategy: 'dfs',
                order: 'pre',
            })
            expect(nodes.map((n) => n.id)).toEqual([
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

        it('dfs 且 order post 应按后序返回', () => {
            const nodes = findAll(tree, () => true, {
                strategy: 'dfs',
                order: 'post',
            })
            expect(nodes.map((n) => n.id)).toEqual([
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

        it('bfs 应按照广度优先顺序返回', () => {
            const nodes = findAll(tree, () => true, { strategy: 'bfs' })
            expect(nodes.map((n) => n.id)).toEqual([
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
            const nodes = findAll(tree, () => true, {
                strategy: 'bfs',
                order: 'post',
            })
            expect(nodes.map((n) => n.id)).toEqual([
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
    })

    describe('自定义 childrenKey', () => {
        const customTree: TreeNode = {
            id: 'root',
            subs: [{ id: 'a', subs: [{ id: 'a1' }] }, { id: 'b' }],
        }

        it('应使用指定的 childrenKey 查找所有节点', () => {
            const nodes = findAll(customTree, () => true, {
                childrenKey: 'subs',
            })
            expect(nodes.map((n) => n.id)).toEqual(['root', 'a', 'a1', 'b'])
        })

        it('使用错误的 childrenKey 将只找到根节点', () => {
            const nodes = findAll(customTree, () => true, {
                childrenKey: 'children',
            })
            expect(nodes.map((n) => n.id)).toEqual(['root']) // 注意：'a' 和 'b' 是 root.subs 下的节点，但它们没有 childrenKey 指定的 'children' 字段，所以它们的子节点 'a1' 不会被遍历到。
        })
    })

    describe('森林（多根节点）', () => {
        const forest: TreeNode[] = [
            { id: 'r1', children: [{ id: 'r1c1' }] },
            { id: 'r2', children: [{ id: 'r2c1' }] },
        ]

        it('应遍历所有根节点及其子树', () => {
            const nodes = findAll(forest, () => true)
            // dfs pre 顺序：r1, r1c1, r2, r2c1
            expect(nodes.map((n) => n.id)).toEqual(['r1', 'r1c1', 'r2', 'r2c1'])
        })

        it('应返回所有满足条件的节点', () => {
            const nodes = findAll(forest, (node) =>
                (node.id as string).includes('1')
            )
            expect(nodes.map((n) => n.id)).toEqual(['r1', 'r1c1', 'r2c1'])
        })
    })

    describe('边界情况', () => {
        it('空数组应返回空数组', () => {
            const nodes = findAll([], () => true)
            expect(nodes).toEqual([])
        })

        it('传入 null 或 undefined 应返回空数组', () => {
            const nodes1 = findAll(null as any, () => true)
            expect(nodes1).toEqual([])
            const nodes2 = findAll(undefined as any, () => true)
            expect(nodes2).toEqual([])
        })

        it('节点 children 为非数组时应忽略子节点', () => {
            const weird: TreeNode = {
                id: 'root',
                children: 'not-array' as any,
                subs: [{ id: 'child' }],
            }
            const nodes = findAll(weird, () => true)
            expect(nodes.map((n) => n.id)).toEqual(['root']) // children 字段非数组，所以 child 不被遍历
        })

        it('节点没有 children 字段应正常遍历自身', () => {
            const leaf: TreeNode = { id: 'leaf' }
            const nodes = findAll(leaf, () => true)
            expect(nodes.map((n) => n.id)).toEqual(['leaf'])
        })
    })

    describe('回调行为', () => {
        it('应对每个节点调用一次 callback', () => {
            const callback = jest.fn(() => false)
            findAll(tree, callback)
            expect(callback).toHaveBeenCalledTimes(8) // 树共有 8 个节点
        })

        it('callback 接收节点参数', () => {
            const callback = jest.fn()
            findAll(tree, callback)
            expect(callback).toHaveBeenNthCalledWith(
                1,
                expect.objectContaining({ id: 'root' })
            )
            expect(callback).toHaveBeenNthCalledWith(
                2,
                expect.objectContaining({ id: 'a' })
            )
            // 更多验证...
        })

        it('即使 callback 返回 false 也不应停止遍历（因为 findAll 不处理返回值）', () => {
            const visited: string[] = []
            const callback = (node: TreeNode) => {
                visited.push(node.id as string)
                return false // 尝试停止，但 findAll 不处理返回值
            }
            findAll(tree, callback)
            expect(visited.length).toBe(8) // 仍然遍历所有节点
        })
    })

    describe('复杂匹配条件', () => {
        it('应能根据深层属性匹配', () => {
            const nodes = findAll(
                tree,
                (node) => (node.id as string).length > 1
            )
            // id 长度 >1 的节点：'a1','a2','a2x','b1'? 'b1' 长度 2，'root' 长度 4 也符合？root 长度为 4，所以包括 root。还有 'a','b','c' 长度 1 不符合。
            // 预期：root (4), a1 (2), a2 (2), a2x (3), b1 (2)
            expect(nodes.map((n) => n.id).sort()).toEqual([
                'a1',
                'a2',
                'a2x',
                'b1',
                'root',
            ])
        })

        it('应能根据节点是否存在某属性匹配', () => {
            const treeWithExtra: TreeNode = {
                id: 'root',
                extra: true,
                children: [{ id: 'a', extra: true }, { id: 'b' }],
            }
            const nodes = findAll(treeWithExtra, (node) => node.extra === true)
            expect(nodes.map((n) => n.id)).toEqual(['root', 'a'])
        })
    })
})
