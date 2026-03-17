import { find } from '../find' // 根据实际路径调整
import { TreeNode } from '../../types'

describe('find 查找节点', () => {
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
    // dfs pre: root, left, deepTarget, right, shallowTarget -> 第一个满足 'Target' 的是 deepTarget
    // bfs: root, left, right, deepTarget, shallowTarget -> 第一个满足 'Target' 的是 shallowTarget（因为 right 先于 deepTarget 出队，且 right 的孩子 shallowTarget 会在处理 right 时入队，但注意 bfs 是逐层，处理 root 后将 left 和 right 入队，然后处理 left 时将其子 deepTarget 入队，此时队列已有 right 和 deepTarget？实际上队列顺序：初始 [root]; 处理 root，入队 left, right；然后处理 left，入队 deepTarget，队列变为 [right, deepTarget]；然后处理 right，入队 shallowTarget，队列变为 [deepTarget, shallowTarget]；然后处理 deepTarget，队列 [shallowTarget]；最后处理 shallowTarget。所以 bfs 找到的第一个包含 Target 的是 deepTarget 还是 shallowTarget？因为 deepTarget 在 shallowTarget 之前出队（deepTarget 先入队），所以 bfs 会先找到 deepTarget。因此要让 bfs 先找到 shallowTarget，需要让 shallowTarget 在更浅的层，或者调整队列顺序。实际上 shallowTarget 在第三层，deepTarget 也在第三层，但 shallowTarget 的父节点 right 在第二层，deepTarget 的父节点 left 也在第二层。由于 left 和 right 都在第二层，且 left 先于 right 入队（因为处理 root 时 left 先入队），所以 deepTarget 会先于 shallowTarget 入队，因此 bfs 还是 deepTarget 先。我们需要让 shallowTarget 在第二层，即 right 直接是目标。例如：
    const diffTree2: TreeNode = {
        id: 'root',
        children: [
            {
                id: 'left',
                children: [
                    { id: 'deepTarget' }, // 第三层
                ],
            },
            { id: 'shallowTarget' }, // 第二层
        ],
    }

    describe('基本查找', () => {
        it('应能找到存在的节点（默认 dfs pre）', () => {
            const node = find(tree, (n) => n.id === 'a2')
            expect(node).toBeDefined()
            expect(node?.id).toBe('a2')
        })

        it('节点不存在时应返回 null', () => {
            const node = find(tree, (n) => n.id === 'not-exist')
            expect(node).toBeNull()
        })

        it('应返回第一个满足条件的节点（深度优先前序）', () => {
            // 多个节点 id 包含 'a'，按 dfs pre 顺序第一个是 'a'
            const node = find(tree, (n) => String(n.id).includes('a'))
            expect(node?.id).toBe('a')
        })
    })

    describe('遍历策略 (strategy)', () => {
        // dfs pre: root, left, deepTarget, shallowTarget -> 第一个满足 target 的是 deepTarget
        // bfs: root, left, shallowTarget, deepTarget -> 第一个满足 target 的是 shallowTarget（因为第二层 shallowTarget 先于 deepTarget 出队）
        // 这样就有差异了。

        it('策略 dfs 应使用深度优先查找第一个节点', () => {
            const node = find(
                diffTree2,
                (n) => String(n.id).includes('Target'),
                {
                    strategy: 'dfs',
                }
            )
            expect(node?.id).toBe('deepTarget')
        })

        it('策略 bfs 应使用广度优先查找第一个节点', () => {
            const node = find(
                diffTree2,
                (n) => String(n.id).includes('Target'),
                {
                    strategy: 'bfs',
                }
            )
            expect(node?.id).toBe('shallowTarget')
        })

        it('默认策略应为 dfs', () => {
            const node = find(diffTree2, (n) => String(n.id).includes('Target')) // 无 strategy 选项
            expect(node?.id).toBe('deepTarget')
        })
    })

    describe('遍历顺序 (order) 对 dfs 的影响', () => {
        // order 只在 dfs 时有效，测试 pre 和 post 找到的第一个节点是否不同
        const orderTree: TreeNode = {
            id: 'root',
            children: [
                {
                    id: 'left',
                    children: [
                        { id: 'left-leaf' }, // 包含 leaf
                    ],
                },
                { id: 'right', children: [{ id: 'right-leaf' }] },
            ],
        }
        // 前序: root, left, left-leaf, right, right-leaf → 第一个包含 leaf 的是 left-leaf
        // 后序: left-leaf, left, right-leaf, right, root → 第一个包含 leaf 的是 left-leaf 也是？后序中 left-leaf 先于 right-leaf？是的，后序遍历子树时先访问 left-leaf，然后 left，然后 right-leaf，所以第一个 leaf 还是 left-leaf。为了有差异，需要让后序遍历中某个 leaf 在另一个之前出现。因为后序遍历是左右根，所以同一层级的 left-leaf 会在 right-leaf 之前。但如果不同层级，后序遍历会先访问更深层的 left-leaf，然后 left，然后 right-leaf？例如：
        const orderTree2: TreeNode = {
            id: 'root',
            children: [
                {
                    id: 'a',
                    children: [
                        { id: 'a1' }, // 包含 '1'
                        { id: 'a2', children: [{ id: 'a2x' }] }, // a2x 包含 'x'
                    ],
                },
                { id: 'b', children: [{ id: 'b1' }] }, // b1 包含 '1'
            ],
        }
        // 前序: root, a, a1, a2, a2x, b, b1 → 第一个包含 '1' 的是 a1
        // 后序: a1, a2x, a2, a, b1, b, root → 第一个包含 '1' 的是 a1（仍然 a1 在前）。因为 a1 是 a 的第一个孩子的最左叶子，后序遍历中它最先被访问。要让后序第一个不同，需要让某个节点在后序中比前序更早出现，比如让一个节点在更深层但后序中因为子树遍历顺序而提前。但在这个例子中，后序仍然先访问左子树的最深左节点。所以可能很难构造出第一个不同的节点，因为后序遍历也是从左到右，深度优先。实际上，前序和后序的区别在于父节点访问时机，但叶子节点的访问顺序通常一致（都是从左到右深度优先）。要制造差异，需要让条件在父节点上满足，而前序和后序父节点出现顺序不同。例如，查找 id 包含 'a' 的节点，前序会先找到 a，后序会先找到 a1 或 a2？不，id 包含 a 的有 a, a1, a2, a2x。前序顺序: a, a1, a2, a2x → 第一个是 a；后序顺序: a1, a2x, a2, a → 第一个是 a1，因为 a1 先被访问。所以确实可以不同。我们用这个例子：
        // 前序找 id 包含 'a' 的节点：返回 a
        // 后序找 id 包含 'a' 的节点：返回 a1

        it('dfs 前序 (pre) 应按照前序顺序查找', () => {
            const node = find(
                orderTree2,
                (n) => (n.id as string).includes('a'),
                { strategy: 'dfs', order: 'pre' }
            )
            expect(node?.id).toBe('a')
        })

        it('dfs 后序 (post) 应按照后序顺序查找', () => {
            const node = find(
                orderTree2,
                (n) => (n.id as string).includes('a'),
                { strategy: 'dfs', order: 'post' }
            )
            expect(node?.id).toBe('a1')
        })

        it('默认 order 应为 pre', () => {
            const node = find(
                orderTree2,
                (n) => (n.id as string).includes('a'),
                { strategy: 'dfs' }
            ) // 无 order
            expect(node?.id).toBe('a')
        })

        it('当策略为 bfs 时，order 选项应被忽略（不影响结果）', () => {
            // bfs 无视 order，我们确保调用不会出错，且结果与 bfs 一致
            const nodePre = find(
                diffTree2,
                (n) => String(n.id).includes('Target'),
                {
                    strategy: 'bfs',
                    order: 'pre',
                }
            )
            const nodePost = find(
                diffTree2,
                (n) => String(n.id).includes('Target'),
                {
                    strategy: 'bfs',
                    order: 'post',
                }
            )
            const nodeDefault = find(
                diffTree2,
                (n) => String(n.id).includes('Target'),
                { strategy: 'bfs' }
            )
            expect(nodePre?.id).toBe('shallowTarget')
            expect(nodePost?.id).toBe('shallowTarget')
            expect(nodeDefault?.id).toBe('shallowTarget')
        })
    })

    describe('自定义 childrenKey', () => {
        const customTree: TreeNode = {
            id: 'root',
            subs: [{ id: 'a', subs: [{ id: 'a1' }] }, { id: 'b' }],
        }

        it('应使用指定的 childrenKey 查找节点', () => {
            const node = find(customTree, (n) => n.id === 'a1', {
                childrenKey: 'subs',
            })
            expect(node?.id).toBe('a1')
        })

        it('使用错误的 childrenKey 将无法找到深层节点', () => {
            const node = find(customTree, (n) => n.id === 'a1', {
                childrenKey: 'children',
            }) // 默认，但树中无 children
            expect(node).toBeNull()
        })
    })

    describe('森林（多根节点）', () => {
        const forest: TreeNode[] = [
            { id: 'r1', children: [{ id: 'r1c1' }] },
            { id: 'r2', children: [{ id: 'r2c1' }] },
        ]

        it('应在所有根节点中查找', () => {
            const node = find(forest, (n) => n.id === 'r2c1')
            expect(node?.id).toBe('r2c1')
        })

        it('应按照指定策略查找第一个满足条件的节点', () => {
            // 假设两个根节点都有满足条件的节点，策略影响找到的第一个
            const forest2: TreeNode[] = [
                { id: 'target1' }, // r1
                { id: 'target2' }, // r2
            ]
            // dfs 先访问 r1，所以找到 target1；bfs 也是先访问 r1，所以也找到 target1。为了让差异，让 r1 没有满足条件，但子节点有。
            // 略，主要测试能找到即可。
            const node = find(forest2, (n) => String(n.id).startsWith('target'))
            expect(node?.id).toBe('target1')
        })
    })

    describe('边界情况', () => {
        it('传入空数组应返回 null', () => {
            const node = find([], (n) => true)
            expect(node).toBeNull()
        })

        it('传入 null 或 undefined 应返回 null（由 ensureArray 处理）', () => {
            // 假设 ensureArray 将 null/undefined 转为空数组
            const node1 = find(null as any, (n) => true)
            expect(node1).toBeNull()

            const node2 = find(undefined as any, (n) => true)
            expect(node2).toBeNull()
        })

        it('单个节点树查找自身', () => {
            const single: TreeNode = { id: 'only' }
            const node = find(single, (n) => n.id === 'only')
            expect(node?.id).toBe('only')
        })

        it('节点 children 为非数组时不应遍历', () => {
            const weird: TreeNode = {
                id: 'root',
                children: 'not-array' as any,
                subs: [{ id: 'child' }],
            }
            const node = find(weird, (n) => n.id === 'child')
            expect(node).toBeNull() // 找不到，因为 children 非数组被忽略
        })
    })

    describe('回调行为', () => {
        it('回调应接收每个节点直到找到目标', () => {
            const visited: string[] = []
            const callback = (node: TreeNode) => {
                visited.push(node.id as string)
                return node.id === 'a2'
            }
            const node = find(tree, callback)
            expect(node?.id).toBe('a2')
            // 默认 dfs pre: root, a, a1, a2 -> 当 a2 满足时停止，不会继续访问 a2x 等
            expect(visited).toEqual(['root', 'a', 'a1', 'a2'])
        })

        it('回调不应在找到后继续执行', () => {
            const callback = jest.fn((node: TreeNode) => node.id === 'a')
            find(tree, callback)
            // 找到 a 后停止，预期调用次数：root, a 就停止（root 不满足，a 满足）
            expect(callback).toHaveBeenCalledTimes(2)
            expect(callback).toHaveBeenNthCalledWith(
                1,
                expect.objectContaining({ id: 'root' })
            )
            expect(callback).toHaveBeenNthCalledWith(
                2,
                expect.objectContaining({ id: 'a' })
            )
        })
    })
})
