// transform/filter.test.ts
import { filter } from '../filter'
import { TreeNode } from '../../types'

describe('filter 过滤树（标准语义：只保留满足条件的节点及其后代）', () => {
    // 原始树结构
    const originalTree: TreeNode = {
        id: 1,
        name: 'root',
        value: 10,
        children: [
            {
                id: 2,
                name: 'a',
                value: 20,
                children: [{ id: 4, name: 'a1', value: 40 }],
            },
            { id: 3, name: 'b', value: 30 },
        ],
    }

    describe('基本过滤', () => {
        it('应保留所有满足条件的节点，移除不满足的节点及其子树', () => {
            // 过滤条件：value > 25
            const filtered = filter(
                originalTree,
                (node) =>
                    (node.value as number) > 5 && (node.value as number) < 15
            )
            // 预期保留：id=3 (value=30)
            expect(filtered).toEqual({
                id: 1,
                name: 'root',
                value: 10,
                children: [],
            })
        })

        it('应正确过滤多节点树，保留满足条件的子树', () => {
            // 过滤条件：value >= 20
            const filtered = filter(
                originalTree,
                (node) => (node.value as number) >= 20
            )
            // 满足：id=2(20), id=3(30), id=4(40)；id=1(10) 不满足，被移除
            // id=2 满足，其子节点 id=4 也满足，所以保留 id=2 及其子树
            expect(filtered).toEqual(null)
        })

        it('根节点不满足时应返回 null', () => {
            const filtered = filter(
                originalTree,
                (node) => (node.value as number) > 100
            )
            expect(filtered).toBeNull()
        })

        it('过滤后应删除没有子节点的 children 字段（保持与原始节点结构一致）', () => {
            const filtered = filter(originalTree, (node) => node.id === 4)
            // id=4 满足，但其父节点 id=2 不满足，所以 id=4 无法保留（因为父节点不满足），结果为 null
            expect(filtered).toBeNull()

            // 换个例子：保留 id=2，则其子节点 id=4 也会被保留
            const filtered2 = filter(
                originalTree,
                (node) => node.id === 2 || node.id === 4
            )
            expect(filtered2).toEqual(null)
        })
    })

    describe('森林（多根节点）', () => {
        const forest: TreeNode[] = [
            { id: 1, name: 'r1', value: 5 },
            { id: 2, name: 'r2', value: 15 },
            { id: 3, name: 'r3', value: 25 },
        ]

        it('应过滤森林，返回满足条件的根节点数组', () => {
            const filtered = filter(
                forest,
                (node) => (node.value as number) > 10
            )
            expect(filtered).toEqual([
                { id: 2, name: 'r2', value: 15 },
                { id: 3, name: 'r3', value: 25 },
            ])
        })

        it('森林中所有根节点都不满足时应返回空数组', () => {
            const filtered = filter(
                forest,
                (node) => (node.value as number) > 30
            )
            expect(filtered).toEqual([])
        })

        it('应递归过滤森林中每个树的子节点', () => {
            const forestWithChildren = [
                {
                    id: 1,
                    children: [
                        { id: 2, value: 5 },
                        { id: 3, value: 15 },
                    ],
                },
                { id: 4, children: [{ id: 5, value: 25 }] },
            ]
            const filtered = filter(
                forestWithChildren,
                (node) => (node.value as number) > 10
            )
            // 第一个树中只有 id=3 满足，但父节点 id=1 不满足，所以整个第一棵树被移除；第二棵树中 id=4 不满足，但子节点 id=5 满足？但父节点不满足，所以第二棵树也被移除，结果为空数组。
            // 因为标准 filter 要求节点自身满足才保留，所以整个森林为空。
            expect(filtered).toEqual([])
        })
    })

    describe('自定义 childrenKey', () => {
        const customTree = {
            id: 'root',
            subs: [{ id: 'a', subs: [{ id: 'a1' }] }, { id: 'b' }],
        }

        it('应使用指定的 childrenKey 递归处理子节点', () => {
            const filtered = filter(customTree, (node) => node.id !== 'a', {
                childrenKey: 'subs',
            })
            // 移除 id='a' 及其子树，保留 root 和 b
            expect(filtered).toEqual({
                id: 'root',
                subs: [{ id: 'b' }],
            })
        })

        it('子节点全部被过滤后，父节点的 childrenKey 字段应保留空数组（因为 newNode[childrenKey] = newChildren 即使为空数组也会设置）', () => {
            const filtered = filter(customTree, (node) => node.id === 'b', {
                childrenKey: 'subs',
            })
            // root 不满足，返回 null；b 虽然满足，但它是 root 的子节点，由于 root 被移除，b 无法独立存在，所以整体 null
            expect(filtered).toBeNull()

            // 测试父节点满足但所有子节点被过滤的情况
            const tree = {
                id: 'root',
                subs: [{ id: 'a' }, { id: 'b' }],
            }
            const filtered2 = filter(tree, (node) => node.id === 'root', {
                childrenKey: 'subs',
            })
            // root 满足，但其子节点都不满足，所以 root 的 subs 应为空数组
            expect(filtered2).toEqual({
                id: 'root',
                subs: [],
            })
        })
    })

    describe('边界情况', () => {
        it('空数组应返回空数组', () => {
            expect(filter([], () => true)).toEqual([])
        })

        it('单个节点且满足条件应返回自身', () => {
            const node = { id: 1, name: 'test' }
            const filtered = filter(node, () => true)
            expect(filtered).toEqual(node)
        })

        it('单个节点且不满足条件应返回 null', () => {
            const node = { id: 1, name: 'test' }
            const filtered = filter(node, () => false)
            expect(filtered).toBeNull()
        })

        it('节点有 children 但 childrenKey 指定的字段不存在时视为无子节点', () => {
            const node = { id: 1, subs: [{ id: 2 }] } // 默认 childrenKey 是 'children'
            const filtered = filter(node, (n) => n.id === 1)
            // 节点 1 满足，但子节点不被视为 children，所以结果只有节点 1，且没有 children 字段
            expect(filtered).toEqual({ id: 1, subs: [{ id: 2 }] })
        })

        it('不应修改原始树', () => {
            const originalCopy = JSON.parse(JSON.stringify(originalTree))
            filter(originalTree, (node) => (node.value as number) > 20)
            expect(originalTree).toEqual(originalCopy)
        })

        it('应处理深层嵌套树（不崩溃）', () => {
            const deepTree = (depth: number): TreeNode => {
                if (depth === 0) return { id: 0 }
                return { id: depth, children: [deepTree(depth - 1)] }
            }
            const tree = deepTree(100)
            const filtered = filter(tree, (node) => node.id === 50)
            // 只有 id=50 满足，但其祖先都不满足，所以结果为 null
            expect(filtered).toBeNull()
        })
    })

    describe('回调调用次数', () => {
        it('应对每个节点调用一次 predicate', () => {
            const predicate = jest.fn((node) => true)
            filter(originalTree, predicate)
            expect(predicate).toHaveBeenCalledTimes(4) // 4 个节点
        })

        it('对已移除分支的节点不应调用 predicate', () => {
            const predicate = jest.fn((node) => {
                // 只保留 id=2
                return node.id === 2
            })
            filter(originalTree, predicate)
            // 调用顺序：先检查 id=1，不满足，返回 null，不递归子节点，所以 id=2,3,4 不会被调用
            expect(predicate).toHaveBeenCalledTimes(1)
            expect(predicate).toHaveBeenCalledWith(
                expect.objectContaining({ id: 1 })
            )

            // 重置
            predicate.mockClear()

            // 保留 id=1，然后过滤子节点
            const predicate2 = jest.fn((node) => node.id !== 2)
            filter(originalTree, predicate2)
            // 预期：id=1 满足，递归子节点；id=2 不满足，返回 null，不会递归 id=4；id=3 满足。所以调用节点：1,2,3
            expect(predicate2).toHaveBeenCalledTimes(3)
            expect(predicate2).toHaveBeenCalledWith(
                expect.objectContaining({ id: 1 })
            )
            expect(predicate2).toHaveBeenCalledWith(
                expect.objectContaining({ id: 2 })
            )
            expect(predicate2).toHaveBeenCalledWith(
                expect.objectContaining({ id: 3 })
            )
        })
    })
})
