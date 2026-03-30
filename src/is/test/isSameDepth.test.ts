// relation/isSameDepth.test.ts
import { isSameDepth } from '../isSameDepth'
import { TreeNode } from '../../types'

describe('isSameDepth 判断节点是否在同一深度', () => {
    // 测试树结构
    const tree: TreeNode = {
        id: 1,
        name: 'root',
        children: [
            {
                id: 2,
                name: 'a',
                children: [
                    { id: 4, name: 'a1' },
                    { id: 5, name: 'a2' },
                ],
            },
            { id: 3, name: 'b' },
        ],
    }

    it('两个节点在同一深度应返回 true', () => {
        // 节点 2 和节点 3 深度均为 1
        expect(
            isSameDepth(
                tree,
                (n) => n.id === 2,
                (n) => n.id === 3
            )
        ).toBe(true)
        // 节点 4 和节点 5 深度均为 2
        expect(
            isSameDepth(
                tree,
                (n) => n.id === 4,
                (n) => n.id === 5
            )
        ).toBe(true)
        // 节点 1（根）深度 0，但根只有一个，但另一个根节点不存在，所以 false
    })

    it('不同深度的节点应返回 false', () => {
        // 根节点深度 0，子节点深度 1
        expect(
            isSameDepth(
                tree,
                (n) => n.id === 1,
                (n) => n.id === 2
            )
        ).toBe(false)
        // 深度 1 和深度 2
        expect(
            isSameDepth(
                tree,
                (n) => n.id === 2,
                (n) => n.id === 4
            )
        ).toBe(false)
    })

    it('任一节点不存在应返回 false', () => {
        expect(
            isSameDepth(
                tree,
                (n) => n.id === 2,
                (n) => n.id === 999
            )
        ).toBe(false)
        expect(
            isSameDepth(
                tree,
                (n) => n.id === 999,
                (n) => n.id === 2
            )
        ).toBe(false)
    })

    it('同一节点应返回 true（深度相同）', () => {
        expect(
            isSameDepth(
                tree,
                (n) => n.id === 2,
                (n) => n.id === 2
            )
        ).toBe(true)
    })

    it('应支持自定义 childrenKey', () => {
        const customTree = {
            id: 'root',
            subs: [
                { id: 'a', subs: [{ id: 'a1' }, { id: 'a2' }] },
                { id: 'b' },
            ],
        }
        // 'a' 和 'b' 深度均为 1
        expect(
            isSameDepth(
                customTree,
                (n) => n.id === 'a',
                (n) => n.id === 'b',
                { childrenKey: 'subs' }
            )
        ).toBe(true)
        // 'a1' 和 'a2' 深度均为 2
        expect(
            isSameDepth(
                customTree,
                (n) => n.id === 'a1',
                (n) => n.id === 'a2',
                { childrenKey: 'subs' }
            )
        ).toBe(true)
        // 'a' 和 'a1' 深度不同
        expect(
            isSameDepth(
                customTree,
                (n) => n.id === 'a',
                (n) => n.id === 'a1',
                { childrenKey: 'subs' }
            )
        ).toBe(false)
    })

    it('森林中不同根节点深度相同应返回 true', () => {
        const forest: TreeNode[] = [
            { id: 1, children: [{ id: 2 }] }, // 根节点深度 0，子节点深度 1
            { id: 3, children: [{ id: 4 }] }, // 根节点深度 0，子节点深度 1
        ]
        // 两个根节点深度均为 0
        expect(
            isSameDepth(
                forest,
                (n) => n.id === 1,
                (n) => n.id === 3
            )
        ).toBe(true)
        // 两个子节点深度均为 1
        expect(
            isSameDepth(
                forest,
                (n) => n.id === 2,
                (n) => n.id === 4
            )
        ).toBe(true)
        // 根节点与子节点深度不同
        expect(
            isSameDepth(
                forest,
                (n) => n.id === 1,
                (n) => n.id === 2
            )
        ).toBe(false)
    })

    describe('边界情况', () => {
        it('空数组应返回 false', () => {
            expect(
                isSameDepth(
                    [],
                    (n) => n.id === 1,
                    (n) => n.id === 2
                )
            ).toBe(false)
        })

        it('单节点树中同一节点应返回 true', () => {
            const singleNode = { id: 1 }
            expect(
                isSameDepth(
                    singleNode,
                    (n) => n.id === 1,
                    (n) => n.id === 1
                )
            ).toBe(true)
        })

        it('没有 children 字段的节点应正确处理', () => {
            const treeWithoutChildren = {
                id: 1,
                name: 'root',
            }
            expect(
                isSameDepth(
                    treeWithoutChildren,
                    (n) => n.id === 1,
                    (n) => n.id === 1
                )
            ).toBe(true)
        })

        it('children 字段不是数组应跳过子节点遍历', () => {
            const invalidTree = {
                id: 1,
                children: 'not-array' as any,
            }
            expect(
                isSameDepth(
                    invalidTree,
                    (n) => n.id === 1,
                    (n) => n.id === 1
                )
            ).toBe(true)
        })

        it('两个断言都匹配同一个节点应返回 true', () => {
            expect(
                isSameDepth(
                    tree,
                    (n) => n.id === 2,
                    (n) => n.id === 2
                )
            ).toBe(true)
        })

        it('复杂树结构的多层深度比较', () => {
            const complexTree: TreeNode = {
                id: 'root',
                children: [
                    {
                        id: 'L1-A',
                        children: [
                            {
                                id: 'L2-A',
                                children: [{ id: 'L3-A' }, { id: 'L3-B' }],
                            },
                            { id: 'L2-B' },
                        ],
                    },
                    {
                        id: 'L1-B',
                        children: [{ id: 'L2-C' }, { id: 'L2-D' }],
                    },
                    { id: 'L1-C' },
                ],
            }

            // L1 层的所有节点深度相同
            expect(
                isSameDepth(
                    complexTree,
                    (n) => n.id === 'L1-A',
                    (n) => n.id === 'L1-B'
                )
            ).toBe(true)

            expect(
                isSameDepth(
                    complexTree,
                    (n) => n.id === 'L1-B',
                    (n) => n.id === 'L1-C'
                )
            ).toBe(true)

            // L2 层的所有节点深度相同
            expect(
                isSameDepth(
                    complexTree,
                    (n) => n.id === 'L2-A',
                    (n) => n.id === 'L2-C'
                )
            ).toBe(true)

            // L3 层的节点深度相同
            expect(
                isSameDepth(
                    complexTree,
                    (n) => n.id === 'L3-A',
                    (n) => n.id === 'L3-B'
                )
            ).toBe(true)

            // 跨层比较应为 false
            expect(
                isSameDepth(
                    complexTree,
                    (n) => n.id === 'L1-A',
                    (n) => n.id === 'L2-A'
                )
            ).toBe(false)

            expect(
                isSameDepth(
                    complexTree,
                    (n) => n.id === 'L2-B',
                    (n) => n.id === 'L3-A'
                )
            ).toBe(false)
        })
    })

    describe('性能优化验证', () => {
        it('找到两个节点后应提前终止遍历', () => {
            const largeTree: TreeNode = {
                id: 'root',
                children: Array.from({ length: 100 }, (_, i) => ({
                    id: `node-${i}`,
                    children: Array.from({ length: 10 }, (_, j) => ({
                        id: `leaf-${i}-${j}`,
                    })),
                })),
            }

            // 查找前两个节点，应该能快速返回
            const start = Date.now()
            const result = isSameDepth(
                largeTree,
                (n) => n.id === 'node-0',
                (n) => n.id === 'node-1'
            )
            const duration = Date.now() - start

            expect(result).toBe(true)
            // 验证提前终止（不应该遍历完整棵树）
            expect(duration).toBeLessThan(100) // 应该在 100ms 内完成
        })
    })

    describe('特殊数据类型', () => {
        it('应支持字符串 ID 的节点', () => {
            const stringIdTree: TreeNode = {
                id: 'root-节点',
                children: [
                    { id: 'child-中文', children: [{ id: 'grandchild-测试' }] },
                    { id: 'child-英文' },
                ],
            }

            expect(
                isSameDepth(
                    stringIdTree,
                    (n) => n.id === 'child-中文',
                    (n) => n.id === 'child-英文'
                )
            ).toBe(true)
        })

        it('应支持数字和混合类型 ID', () => {
            const mixedTree: TreeNode = {
                id: 0,
                children: [{ id: 1, children: [{ id: 3 }] }, { id: 2 }],
            }

            expect(
                isSameDepth(
                    mixedTree,
                    (n) => n.id === 1,
                    (n) => n.id === 2
                )
            ).toBe(true)

            expect(
                isSameDepth(
                    mixedTree,
                    (n) => n.id === 0,
                    (n) => n.id === 3
                )
            ).toBe(false)
        })

        it('应处理带有额外属性的节点', () => {
            const treeWithExtraProps: TreeNode = {
                id: 1,
                name: 'root',
                type: 'parent',
                metadata: { level: 1 },
                children: [
                    {
                        id: 2,
                        name: 'child1',
                        type: 'child',
                        metadata: { level: 2 },
                    },
                    {
                        id: 3,
                        name: 'child2',
                        type: 'child',
                        metadata: { level: 2 },
                    },
                ],
            }

            expect(
                isSameDepth(
                    treeWithExtraProps,
                    (n) => n.id === 2,
                    (n) => n.id === 3
                )
            ).toBe(true)

            // 使用其他属性进行断言
            expect(
                isSameDepth(
                    treeWithExtraProps,
                    (n) => n.type === 'child' && n.name === 'child1',
                    (n) => n.type === 'child' && n.name === 'child2'
                )
            ).toBe(true)
        })
    })

    describe('断言函数行为', () => {
        it('断言函数抛出异常时应传播错误', () => {
            const errorTree: TreeNode = {
                id: 1,
                children: [{ id: 2 }],
            }

            expect(() =>
                isSameDepth(
                    errorTree,
                    () => {
                        throw new Error('Predicate error')
                    },
                    (n) => n.id === 2
                )
            ).toThrow('Predicate error')
        })

        it('断言函数返回非布尔值应正确处理', () => {
            expect(
                isSameDepth(
                    tree,
                    // @ts-ignore - 测试非布尔返回值
                    (n) => (n.id === 2 ? 1 : 0),
                    (n) => n.id === 3
                )
            ).toBe(true)
        })
    })
})
