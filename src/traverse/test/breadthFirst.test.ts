import { breadthFirst } from '../breadthFirst' // 根据实际路径调整
import { TreeNode, Context } from '../../types' // 根据实际路径调整

describe('breadthFirst 广度优先遍历', () => {
    // 辅助函数：收集遍历过程中的节点 ID 和上下文
    const collectTraversal = (
        tree: TreeNode | TreeNode[],
        options?: Parameters<typeof breadthFirst>[2]
    ) => {
        const order: string[] = []
        const contexts: Context[] = []
        const callback = (node: TreeNode, context: Context) => {
            order.push(node.id as string)
            contexts.push({ ...context }) // 浅拷贝，避免后续修改影响
        }
        breadthFirst(tree, callback, options)
        return { order, contexts }
    }

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

    describe('基本遍历顺序', () => {
        it('应按照广度优先（逐层从左到右）的顺序访问节点', () => {
            const { order } = collectTraversal(tree)
            // 预期顺序：
            // 第0层: root
            // 第1层: a, b, c
            // 第2层: a1, a2, b1
            // 第3层: a2x
            expect(order).toEqual([
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

    describe('多根节点（森林）', () => {
        const forest: TreeNode[] = [
            { id: 'r1', children: [{ id: 'r1c1' }] },
            { id: 'r2', children: [{ id: 'r2c1' }] },
        ]

        it('应依次遍历每个根节点及其子树（按层）', () => {
            const { order } = collectTraversal(forest)
            // 预期：
            // 第0层: r1, r2
            // 第1层: r1c1, r2c1
            expect(order).toEqual(['r1', 'r2', 'r1c1', 'r2c1'])
        })
    })

    describe('自定义 childrenKey', () => {
        const treeCustom: TreeNode = {
            id: 'root',
            subs: [{ id: 'a', subs: [{ id: 'a1' }] }, { id: 'b' }],
        }

        it('应使用指定的 childrenKey 查找子节点', () => {
            const { order } = collectTraversal(treeCustom, {
                childrenKey: 'subs',
            })
            expect(order).toEqual(['root', 'a', 'b', 'a1'])
        })

        it('使用不存在的 childrenKey 应视为无子节点', () => {
            const { order } = collectTraversal(treeCustom, {
                childrenKey: 'nonexistent',
            })
            expect(order).toEqual(['root']) // 子节点不被遍历
        })
    })

    describe('停止遍历', () => {
        it('当回调返回 false 时应立即停止遍历', () => {
            const visited: string[] = []
            const callback = (node: TreeNode) => {
                visited.push(node.id as string)
                if (node.id === 'b') return false // 停止
            }
            breadthFirst(tree, callback)
            // 访问顺序：root, a, b 后停止，c 及后续节点不被访问
            expect(visited).toEqual(['root', 'a', 'b'])
        })

        it('停止后不应再处理队列中剩余的节点', () => {
            const visited: string[] = []
            const callback = (node: TreeNode) => {
                visited.push(node.id as string)
                if (node.id === 'a') return false
            }
            breadthFirst(tree, callback)
            // 访问 root, a 后停止，b 和 c 不应被访问
            expect(visited).toEqual(['root', 'a'])
        })
    })

    describe('上下文信息 (depth, parent, path)', () => {
        it('应提供正确的 depth（按层计数）', () => {
            const depths: number[] = []
            breadthFirst(tree, (node, { depth }) => {
                depths.push(depth)
            })
            // 预期深度：
            // root(0), a(1), b(1), c(1), a1(2), a2(2), b1(2), a2x(3)
            expect(depths).toEqual([0, 1, 1, 1, 2, 2, 2, 3])
        })

        it('应提供正确的 parent（根节点 parent 为 null）', () => {
            const parents: (string | null)[] = []
            breadthFirst(tree, (node, { parent }) => {
                parents.push(parent ? (parent.id as string) : null)
            })
            expect(parents).toEqual([
                null, // root
                'root', // a
                'root', // b
                'root', // c
                'a', // a1
                'a', // a2
                'b', // b1
                'a2', // a2x
            ])
        })

        it('应提供正确的 path（从根到当前节点的节点数组）', () => {
            const paths: string[][] = []
            breadthFirst(tree, (node, { path }) => {
                paths.push(path.map((n) => n.id as string))
            })
            expect(paths).toEqual([
                ['root'],
                ['root', 'a'],
                ['root', 'b'],
                ['root', 'c'],
                ['root', 'a', 'a1'],
                ['root', 'a', 'a2'],
                ['root', 'b', 'b1'],
                ['root', 'a', 'a2', 'a2x'],
            ])
        })

        it('在森林中，每个根节点的 path 应只包含自身', () => {
            const forest: TreeNode[] = [
                { id: 'r1', children: [{ id: 'r1c1' }] },
                { id: 'r2' },
            ]
            const paths: string[][] = []
            breadthFirst(forest, (node, { path }) => {
                paths.push(path.map((n) => n.id as string))
            })
            expect(paths).toEqual([['r1'], ['r2'], ['r1', 'r1c1']])
        })
    })

    describe('边缘情况', () => {
        it('空树（空数组）不应调用回调', () => {
            const callback = jest.fn()
            breadthFirst([], callback)
            expect(callback).not.toHaveBeenCalled()
        })

        it('传入 null 或 undefined 应视为空树（由 ensureArray 处理）', () => {
            // 假设 ensureArray 将 null/undefined 转换为空数组
            const callback = jest.fn()
            breadthFirst(null as any, callback)
            expect(callback).not.toHaveBeenCalled()

            breadthFirst(undefined as any, callback)
            expect(callback).not.toHaveBeenCalled()
        })

        it('节点 children 字段为非数组时（如对象或字符串）应被忽略', () => {
            const weirdTree: TreeNode = {
                id: 'root',
                children: 'not an array' as any, // 强制为非数组
                extra: { id: 'child' }, // 不会作为子节点
            }
            const visited: string[] = []
            breadthFirst(weirdTree, (node) => {
                visited.push(node.id as string)
            })
            expect(visited).toEqual(['root']) // 只有根节点
        })

        it('节点 children 字段为 undefined 时正常遍历', () => {
            const nodeWithoutChildren: TreeNode = { id: 'leaf' }
            const visited: string[] = []
            breadthFirst(nodeWithoutChildren, (node) => {
                visited.push(node.id as string)
            })
            expect(visited).toEqual(['leaf'])
        })

        it('应正确处理深层嵌套和大数量节点（不崩溃）', () => {
            // 生成一个简单的深层树（链式）
            const deepChain: TreeNode = { id: '0' }
            let current = deepChain
            for (let i = 1; i < 1000; i++) {
                const next = { id: String(i) }
                current.children = [next]
                current = next
            }
            const visited: string[] = []
            breadthFirst(deepChain, (node) => {
                visited.push(node.id as string)
            })
            expect(visited.length).toBe(1000)
            expect(visited[0]).toBe('0')
            expect(visited[999]).toBe('999')
        })
    })

    describe('选项默认值', () => {
        it('不传递 options 时，默认 childrenKey = "children"', () => {
            const tree: TreeNode = {
                id: 'root',
                children: [{ id: 'child' }],
            }
            const { order } = collectTraversal(tree) // 无 options
            expect(order).toEqual(['root', 'child'])
        })
    })

    describe('回调返回值', () => {
        it('回调返回 undefined 或 true 应继续遍历', () => {
            const visited: string[] = []
            const callback = (node: TreeNode) => {
                visited.push(node.id as string)
                return undefined // 或 true，但函数签名期望 void 或 boolean，void 相当于返回 undefined
            }
            breadthFirst(tree, callback)
            expect(visited.length).toBe(8) // 所有节点都被访问
        })

        it('回调显式返回 true 也应继续遍历（因为函数期望返回 false 才停止）', () => {
            const visited: string[] = []
            const callback = (node: TreeNode) => {
                visited.push(node.id as string)
                return true as any // 强制返回 true，但不应该停止
            }
            breadthFirst(tree, callback)
            expect(visited.length).toBe(8)
        })
    })

    describe('复杂树结构', () => {
        const complexTree: TreeNode = {
            id: '1',
            children: [
                { id: '1.1', children: [{ id: '1.1.1' }] },
                {
                    id: '1.2',
                    children: [
                        { id: '1.2.1' },
                        { id: '1.2.2', children: [{ id: '1.2.2.1' }] },
                    ],
                },
                { id: '1.3' },
            ],
        }

        it('应正确遍历复杂树结构', () => {
            const { order } = collectTraversal(complexTree)
            // 预期：
            // 1
            // 1.1, 1.2, 1.3
            // 1.1.1, 1.2.1, 1.2.2
            // 1.2.2.1
            expect(order).toEqual([
                '1',
                '1.1',
                '1.2',
                '1.3',
                '1.1.1',
                '1.2.1',
                '1.2.2',
                '1.2.2.1',
            ])
        })
    })
})
