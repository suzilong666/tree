import { findPath } from '../findPath'
import { TreeNode } from '../../types'

describe('findPath 查找节点路径', () => {
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
    // 构造树使 DFS 和 BFS 找到的第一个目标节点不同
    const strategyTree: TreeNode = {
        id: 'root',
        children: [
            {
                id: 'left',
                children: [{ id: 'deepTarget' }], // 第三层
            },
            { id: 'shallowTarget' }, // 第二层
        ],
    }
    describe('基本功能', () => {
        it('应返回根节点到目标节点的路径（默认 dfs pre）', () => {
            const path = findPath(tree, (node) => node.id === 'a2x')
            expect(path.map((n) => n.id)).toEqual(['root', 'a', 'a2', 'a2x'])
        })

        it('目标节点不存在应返回空数组', () => {
            const path = findPath(tree, (node) => node.id === 'nonexistent')
            expect(path).toEqual([])
        })

        it('应返回第一个匹配节点的路径', () => {
            const path = findPath(tree, (node) =>
                (node.id as string).includes('a')
            )
            expect(path.map((n) => n.id)).toEqual(['root', 'a'])
        })

        it('当树为单个节点时，路径应包含该节点自身', () => {
            const single: TreeNode = { id: 'only' }
            const path = findPath(single, (node) => node.id === 'only')
            expect(path.map((n) => n.id)).toEqual(['only'])
        })
    })

    describe('遍历策略 (strategy)', () => {
        // DFS pre: root, left, deepTarget, shallowTarget → 第一个包含 Target 的是 deepTarget
        // BFS: root, left, shallowTarget, deepTarget → 第一个包含 Target 的是 shallowTarget

        it('策略 dfs 应返回深度优先找到的第一个节点的路径', () => {
            const path = findPath(
                strategyTree,
                (n) => (n.id as string).includes('Target'),
                {
                    strategy: 'dfs',
                }
            )
            expect(path.map((n) => n.id)).toEqual([
                'root',
                'left',
                'deepTarget',
            ])
        })

        it('策略 bfs 应返回广度优先找到的第一个节点的路径', () => {
            const path = findPath(
                strategyTree,
                (n) => (n.id as string).includes('Target'),
                {
                    strategy: 'bfs',
                }
            )
            expect(path.map((n) => n.id)).toEqual(['root', 'shallowTarget'])
        })

        it('默认策略应为 dfs', () => {
            const path = findPath(strategyTree, (n) =>
                (n.id as string).includes('Target')
            )
            expect(path.map((n) => n.id)).toEqual([
                'root',
                'left',
                'deepTarget',
            ])
        })
    })

    describe('遍历顺序 (order) 对 dfs 的影响', () => {
        // 构造树使前序和后序找到的第一个包含 'a' 的节点不同
        const orderTree: TreeNode = {
            id: 'root',
            children: [
                {
                    id: 'a',
                    children: [
                        { id: 'a1' },
                        { id: 'a2', children: [{ id: 'a2x' }] },
                    ],
                },
                { id: 'b', children: [{ id: 'b1' }] },
            ],
        }
        // 前序找包含 a 的节点: root(否), a(是) → 路径 ['root','a']
        // 后序找包含 a 的节点: a1(是) → 路径 ['root','a','a1']

        it('dfs 前序应按照前序顺序返回路径', () => {
            const path = findPath(
                orderTree,
                (n) => (n.id as string).includes('a'),
                {
                    strategy: 'dfs',
                    order: 'pre',
                }
            )
            expect(path.map((n) => n.id)).toEqual(['root', 'a'])
        })

        it('dfs 后序应按照后序顺序返回路径', () => {
            const path = findPath(
                orderTree,
                (n) => (n.id as string).includes('a'),
                {
                    strategy: 'dfs',
                    order: 'post',
                }
            )
            expect(path.map((n) => n.id)).toEqual(['root', 'a', 'a1'])
        })

        it('默认 order 应为 pre', () => {
            const path = findPath(
                orderTree,
                (n) => (n.id as string).includes('a'),
                {
                    strategy: 'dfs',
                }
            )
            expect(path.map((n) => n.id)).toEqual(['root', 'a'])
        })

        it('当策略为 bfs 时，order 选项应被忽略', () => {
            const pathPre = findPath(
                strategyTree,
                (n) => (n.id as string).includes('Target'),
                {
                    strategy: 'bfs',
                    order: 'pre',
                }
            )
            const pathPost = findPath(
                strategyTree,
                (n) => (n.id as string).includes('Target'),
                {
                    strategy: 'bfs',
                    order: 'post',
                }
            )
            expect(pathPre.map((n) => n.id)).toEqual(['root', 'shallowTarget'])
            expect(pathPost.map((n) => n.id)).toEqual(['root', 'shallowTarget'])
        })
    })

    describe('自定义 childrenKey', () => {
        const customTree: TreeNode = {
            id: 'root',
            subs: [{ id: 'a', subs: [{ id: 'a1' }] }, { id: 'b' }],
        }

        it('应使用指定的 childrenKey 查找路径', () => {
            const path = findPath(customTree, (n) => n.id === 'a1', {
                childrenKey: 'subs',
            })
            expect(path.map((n) => n.id)).toEqual(['root', 'a', 'a1'])
        })

        it('使用错误的 childrenKey 将找不到深层节点', () => {
            const path = findPath(customTree, (n) => n.id === 'a1', {
                childrenKey: 'children',
            })
            expect(path).toEqual([])
        })
    })

    describe('森林（多根节点）', () => {
        const forest: TreeNode[] = [
            { id: 'r1', children: [{ id: 'r1c1' }] },
            { id: 'r2', children: [{ id: 'r2c1' }] },
        ]

        it('应在所有根节点中查找路径', () => {
            const path = findPath(forest, (n) => n.id === 'r2c1')
            expect(path.map((n) => n.id)).toEqual(['r2', 'r2c1'])
        })

        it('应按照指定策略查找第一个满足条件的路径', () => {
            const path = findPath(forest, (n) => n.id === 'r1c1', {
                strategy: 'bfs',
            })
            expect(path.map((n) => n.id)).toEqual(['r1', 'r1c1'])
        })
    })

    describe('边界情况', () => {
        it('传入空数组应返回空数组', () => {
            const path = findPath([], () => true)
            expect(path).toEqual([])
        })

        it('传入 null 或 undefined 应返回空数组', () => {
            const path1 = findPath(null as any, () => true)
            expect(path1).toEqual([])
            const path2 = findPath(undefined as any, () => true)
            expect(path2).toEqual([])
        })

        it('节点 children 为非数组时应忽略子节点', () => {
            const weird: TreeNode = {
                id: 'root',
                children: 'not-array' as any,
                subs: [{ id: 'child' }],
            }
            const path = findPath(weird, (n) => n.id === 'child')
            expect(path).toEqual([])
        })
    })

    describe('路径的正确性', () => {
        it('返回的路径应包含从根到目标节点的所有节点', () => {
            const path = findPath(tree, (n) => n.id === 'b1')
            expect(path.map((n) => n.id)).toEqual(['root', 'b', 'b1'])
        })

        it('路径中的节点引用应与原树中的节点一致', () => {
            const path = findPath(tree, (n) => n.id === 'a2x')
            expect(path[0]).toBe(tree) // root
            expect(path[1]).toBe((tree.children as TreeNode[])[0]) // a
            expect(path[2]).toBe(
                ((tree.children as TreeNode[])[0].children as TreeNode[])[1]
            ) // a2
            expect(path[3]).toBe(
                (
                    ((tree.children as TreeNode[])[0].children as TreeNode[])[1]
                        .children as TreeNode[]
                )[0]
            ) // a2x
        })
    })

    describe('回调行为', () => {
        it('回调应接收每个节点直到找到目标', () => {
            const visited: string[] = []
            const callback = (node: TreeNode) => {
                visited.push(node.id as string)
                return node.id === 'a2'
            }
            const path = findPath(tree, callback)
            expect(path.map((n) => n.id)).toEqual(['root', 'a', 'a2'])
            // dfs pre 顺序: root, a, a1, a2
            expect(visited).toEqual(['root', 'a', 'a1', 'a2'])
        })

        it('找到目标后不应再调用回调', () => {
            const callback = jest.fn((node: TreeNode) => node.id === 'a')
            findPath(tree, callback)
            expect(callback).toHaveBeenCalledTimes(2) // root, a
        })
    })
})
