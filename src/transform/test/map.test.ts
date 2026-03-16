// transform/map.test.ts
import { map } from '../map'
import { TreeNode } from '../../types'

describe('map 映射树', () => {
    // 原始树结构（使用 id 标识节点以便断言）
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

    describe('基本映射', () => {
        it('应返回新树，节点数据根据映射函数变化', () => {
            // 映射：每个节点 value 翻倍，并添加一个新字段
            const mapped = map(originalTree, (node) => ({
                ...node,
                value: (node.value as number) * 2,
                doubled: true,
            }))

            expect(mapped).toEqual({
                id: 1,
                name: 'root',
                value: 20,
                doubled: true,
                children: [
                    {
                        id: 2,
                        name: 'a',
                        value: 40,
                        doubled: true,
                        children: [
                            { id: 4, name: 'a1', value: 80, doubled: true },
                        ],
                    },
                    { id: 3, name: 'b', value: 60, doubled: true },
                ],
            })
        })

        it('应保留原始树的结构和字段（只修改映射返回的内容）', () => {
            const mapped = map(originalTree, (node) => ({
                ...node,
                extra: true,
            }))
            // 验证每个节点都有 extra 字段
            expect(mapped).toHaveProperty('extra', true)
            expect((mapped as any).children[0]).toHaveProperty('extra', true)
            expect((mapped as any).children[0].children[0]).toHaveProperty(
                'extra',
                true
            )
            expect((mapped as any).children[1]).toHaveProperty('extra', true)
        })

        it('不应修改原始树', () => {
            const originalCopy = JSON.parse(JSON.stringify(originalTree))
            map(originalTree, (node) => ({ ...node, value: 0 }))
            expect(originalTree).toEqual(originalCopy)
        })

        it('映射后新树的节点应与原节点引用不同（深拷贝）', () => {
            const mapped = map(originalTree, (node) => ({ ...node }))
            // 递归检查所有节点都不是同一个对象
            const checkRef = (a: any, b: any) => {
                expect(a).not.toBe(b)
                if (a.children && b.children) {
                    a.children.forEach((child: any, idx: number) =>
                        checkRef(child, b.children[idx])
                    )
                }
            }
            checkRef(mapped, originalTree)
        })
    })

    describe('森林（多根节点）', () => {
        const forest: TreeNode[] = [
            { id: 1, name: 'r1', children: [{ id: 2, name: 'c1' }] },
            { id: 3, name: 'r2' },
        ]

        it('应返回数组形式的新森林', () => {
            const mapped = map(forest, (node) => ({
                ...node,
                name: (node.name as string).toUpperCase(),
            }))
            expect(Array.isArray(mapped)).toBe(true)
            expect(mapped).toHaveLength(2)
            expect(mapped[0].name).toBe('R1')
            expect((mapped[0].children as any)[0].name).toBe('C1')
            expect(mapped[1].name).toBe('R2')
        })

        it('输入数组时，原数组不变', () => {
            const originalCopy = [...forest]
            map(forest, (node) => ({ ...node }))
            expect(forest).toEqual(originalCopy)
        })
    })

    describe('空树和边界情况', () => {
        it('空数组应返回空数组', () => {
            expect(map([], (node) => node)).toEqual([])
        })

        it('单个节点且无 children 应正确映射', () => {
            const leaf = { id: 1, name: 'leaf' }
            const mapped = map(leaf, (node) => ({ ...node, extra: true }))
            expect(mapped).toEqual({ id: 1, name: 'leaf', extra: true })
        })

        it('节点有 children 但 childrenKey 指定的字段不存在时视为无子节点', () => {
            const node = { id: 1, subs: [{ id: 2 }] } // 默认 childrenKey 是 'children'
            const mapped = map(node, (n) => ({ ...n, mapped: true }))
            // 不会递归到 subs 中的节点
            expect(mapped).toEqual({ id: 1, subs: [{ id: 2 }], mapped: true })
        })
    })

    describe('自定义 childrenKey', () => {
        const customTree = {
            id: 'root',
            subs: [{ id: 'a', subs: [{ id: 'a1' }] }, { id: 'b' }],
        }

        it('应使用指定的 childrenKey 递归处理子节点', () => {
            const mapped = map(
                customTree,
                (node) => ({ ...node, marked: true }),
                {
                    childrenKey: 'subs',
                }
            )
            expect(mapped).toEqual({
                id: 'root',
                marked: true,
                subs: [
                    {
                        id: 'a',
                        marked: true,
                        subs: [{ id: 'a1', marked: true }],
                    },
                    { id: 'b', marked: true },
                ],
            })
        })

        it('自定义 childrenKey 时，原树中该字段不存在视为无子节点', () => {
            const tree = { id: 1, items: [] }
            const mapped = map(tree, (n) => ({ ...n }), {
                childrenKey: 'items',
            })
            expect(mapped).toEqual({ id: 1, items: [] }) // 空数组被保留
        })
    })

    describe('回调调用次数', () => {
        it('应对每个节点调用一次 callback', () => {
            const callback = jest.fn((node) => ({ ...node }))
            map(originalTree, callback)
            expect(callback).toHaveBeenCalledTimes(4) // 共有 4 个节点
        })

        it('森林中应对所有节点调用 callback', () => {
            const forest = [{ id: 1 }, { id: 2, children: [{ id: 3 }] }]
            const callback = jest.fn((node) => ({ ...node }))
            map(forest, callback)
            expect(callback).toHaveBeenCalledTimes(3)
        })

        it('callback 接收的节点是原节点的浅拷贝（可安全修改）', () => {
            const callback = jest.fn((node) => {
                // 尝试修改 node，不应影响原树
                node.modified = true
                return node
            })
            const original = { id: 1, name: 'test' }
            const mapped = map(original, callback)
            expect(original).not.toHaveProperty('modified') // 原树无此属性
            expect(mapped).toHaveProperty('modified', true) // 新树有
        })
    })

    describe('复杂映射', () => {
        it('映射函数可以返回完全不同的节点结构', () => {
            const mapped = map(originalTree, (node) => ({
                id: (node.id as number) * 100,
                label: `Node-${node.id}`,
                // 故意不保留原 children，map 会自动处理子节点
            }))
            expect(mapped).toEqual({
                id: 100,
                label: 'Node-1',
                children: [
                    {
                        id: 200,
                        label: 'Node-2',
                        children: [{ id: 400, label: 'Node-4' }],
                    },
                    { id: 300, label: 'Node-3' },
                ],
            })
        })

        it('映射函数可以删除属性', () => {
            const mapped = map(originalTree, (node) => {
                const { value, ...rest } = node // 删除 value 字段
                return rest
            })
            expect(mapped).not.toHaveProperty('value')
            expect((mapped as any).children[0]).not.toHaveProperty('value')
        })

        // it('映射函数可以返回 null 或 undefined，但会导致树中出现空位', () => {
        //     // map 不负责过滤，所以如果返回 null，子节点不会被处理
        //     const mapped = map(originalTree, (node) => {
        //         if (node.id === 2) return null
        //         return node
        //     })
        //     expect(mapped).toEqual({
        //         id: 1,
        //         name: 'root',
        //         value: 10,
        //         children: [
        //             null, // 节点被替换为 null
        //             { id: 3, name: 'b', value: 30 },
        //         ],
        //     })
        //     // 注意：原本 id:2 的子树（包括 id:4）都不会被处理，因为 mapSubtree 在遇到返回 null 时停止递归
        // })
    })

    describe('深层嵌套树', () => {
        it('应能处理深层嵌套且节点数较多的树（不崩溃）', () => {
            // 生成一个深度 10、每层 2 个子节点的树，节点数约为 2^10 -1 = 1023
            const deepTree = (depth: number): TreeNode => {
                if (depth === 0) return { id: 0 }
                return {
                    id: depth,
                    children: [deepTree(depth - 1), deepTree(depth - 1)],
                }
            }
            const tree = deepTree(10)
            const callback = jest.fn((node) => ({ ...node, visited: true }))
            const mapped = map(tree, callback)
            expect(callback).toHaveBeenCalled() // 至少被调用
            // 验证映射后的树结构（不展开全部，只检查根节点有 visited）
            expect(mapped).toHaveProperty('visited', true)
        })
    })
})
