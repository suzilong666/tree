// transform/reduce.test.ts
import { reduce } from '../reduce'
import { TreeNode } from '../../types'

describe('reduce 归约树', () => {
    // 测试树结构
    const tree: TreeNode = {
        id: 1,
        value: 10,
        children: [
            { id: 2, value: 20, children: [{ id: 4, value: 40 }] },
            { id: 3, value: 30 },
        ],
    }

    describe('基本归约', () => {
        it('应使用初始值进行求和归约', () => {
            const sum = reduce(
                tree,
                (acc, node) => acc + (node.value as number),
                0
            )
            expect(sum).toBe(10 + 20 + 30 + 40)
        })

        it('应能收集所有节点的 id', () => {
            const ids = reduce(
                tree,
                (acc, node) => {
                    acc.push(node.id)
                    return acc
                },
                [] as any[]
            )
            expect(ids).toEqual([1, 2, 4, 3]) // 默认 dfs pre 顺序
        })

        it('应能构建对象映射', () => {
            const map = reduce(
                tree,
                (acc, node) => {
                    acc[node.id as number] = node.value
                    return acc
                },
                {} as Record<number, number>
            )
            expect(map).toEqual({ 1: 10, 2: 20, 3: 30, 4: 40 })
        })
    })

    describe('森林（多根节点）', () => {
        const forest: TreeNode[] = [
            { id: 1, value: 10 },
            { id: 2, value: 20, children: [{ id: 3, value: 30 }] },
        ]

        it('应依次归约多个根节点', () => {
            const sum = reduce(
                forest,
                (acc, node) => acc + (node.value as number),
                0
            )
            expect(sum).toBe(10 + 20 + 30)
        })

        it('应能收集所有节点 id（按遍历顺序）', () => {
            const ids = reduce(
                forest,
                (acc, node) => {
                    acc.push(node.id)
                    return acc
                },
                [] as any[]
            )
            expect(ids).toEqual([1, 2, 3]) // dfs pre: 1, 2, 3
        })
    })

    describe('空树', () => {
        it('空数组应直接返回初始值', () => {
            const result = reduce([], (acc, node) => acc, 42)
            expect(result).toBe(42)
        })

        it('空数组且初始值为对象应返回该对象', () => {
            const obj = { count: 0 }
            const result = reduce([], (acc, node) => acc, obj)
            expect(result).toBe(obj) // 引用相同
        })
    })

    describe('遍历策略与顺序', () => {
        it('默认使用 dfs pre 顺序', () => {
            const order: number[] = []
            reduce(
                tree,
                (acc, node) => {
                    order.push(node.id as number)
                    return acc
                },
                0
            )
            expect(order).toEqual([1, 2, 4, 3])
        })

        it('支持 dfs post 顺序', () => {
            const order: number[] = []
            reduce(
                tree,
                (acc, node) => {
                    order.push(node.id as number)
                    return acc
                },
                0,
                { strategy: 'dfs', order: 'post' }
            )
            expect(order).toEqual([4, 2, 3, 1])
        })

        it('支持 bfs 顺序', () => {
            const order: number[] = []
            reduce(
                tree,
                (acc, node) => {
                    order.push(node.id as number)
                    return acc
                },
                0,
                { strategy: 'bfs' }
            )
            expect(order).toEqual([1, 2, 3, 4])
        })
    })

    describe('自定义 childrenKey', () => {
        const customTree = {
            id: 'root',
            subs: [{ id: 'a', subs: [{ id: 'a1' }] }, { id: 'b' }],
        }

        it('应使用指定的 childrenKey 递归', () => {
            const ids = reduce(
                customTree,
                (acc, node) => {
                    acc.push(node.id)
                    return acc
                },
                [] as string[],
                { childrenKey: 'subs' }
            )
            expect(ids).toEqual(['root', 'a', 'a1', 'b']) // dfs pre
        })
    })

    describe('上下文参数', () => {
        it('reducer 应接收包含 depth, parent, path, index 的 context', () => {
            const contexts: any[] = []
            reduce(
                tree,
                (acc, node, ctx) => {
                    contexts.push({
                        id: node.id,
                        depth: ctx.depth,
                        parentId: ctx.parent?.id,
                        pathIds: ctx.path.map((n) => n.id),
                        index: ctx.index,
                    })
                    return acc
                },
                0
            )
            expect(contexts).toEqual([
                {
                    id: 1,
                    depth: 0,
                    parentId: undefined,
                    pathIds: [1],
                    index: 0,
                },
                { id: 2, depth: 1, parentId: 1, pathIds: [1, 2], index: 0 },
                { id: 4, depth: 2, parentId: 2, pathIds: [1, 2, 4], index: 0 },
                { id: 3, depth: 1, parentId: 1, pathIds: [1, 3], index: 1 },
            ])
        })

        it('森林中根节点的 index 是其在根数组中的位置', () => {
            const forest: TreeNode[] = [
                { id: 'r1' },
                { id: 'r2', children: [{ id: 'c1' }] },
            ]
            const contexts: any[] = []
            reduce(
                forest,
                (acc, node, ctx) => {
                    contexts.push({ id: node.id, index: ctx.index })
                    return acc
                },
                0
            )
            expect(contexts).toEqual([
                { id: 'r1', index: 0 },
                { id: 'r2', index: 1 },
                { id: 'c1', index: 0 }, // 在 r2 的 children 中 index 为 0
            ])
        })
    })

    describe('复杂归约', () => {
        it('应能计算树的最大深度', () => {
            let maxDepth = 0
            reduce(
                tree,
                (_, node, { depth }) => {
                    if (depth > maxDepth) maxDepth = depth
                    return null
                },
                null
            )
            expect(maxDepth).toBe(2)
        })

        it('应能统计叶子节点数量', () => {
            const leafCount = reduce(
                tree,
                (count, node, { depth, parent, path, index }) => {
                    // 叶子节点判断：没有 children 或 children 为空数组
                    const isLeaf = !node.children || node.children.length === 0
                    return count + (isLeaf ? 1 : 0)
                },
                0
            )
            expect(leafCount).toBe(2) // id=4 和 id=3 是叶子
        })

        it('应能收集所有节点（flat 功能）', () => {
            const nodes = reduce(
                tree,
                (acc, node) => {
                    acc.push(node)
                    return acc
                },
                [] as TreeNode[]
            )
            expect(nodes.map((n) => n.id)).toEqual([1, 2, 4, 3]) // dfs pre
        })
    })
})
