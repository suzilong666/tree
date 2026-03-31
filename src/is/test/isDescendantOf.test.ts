// relation/isDescendantOf.test.ts
import { isDescendantOf } from '../isDescendantOf'
import { isAncestorOf } from '../isAncestorOf'
import { TreeNode } from '../../types'

describe('isDescendantOf 判断后代节点', () => {
    // 测试树结构
    const tree: TreeNode = {
        id: 1,
        name: 'root',
        children: [
            {
                id: 2,
                name: 'a',
                children: [
                    { id: 4, name: 'a1', children: [{ id: 6, name: 'a1-1' }] },
                    { id: 5, name: 'a2' },
                ],
            },
            { id: 3, name: 'b' },
        ],
    }

    it('直接子节点应返回 true', () => {
        expect(
            isDescendantOf(
                tree,
                (n) => n.id === 4,
                (n) => n.id === 2
            )
        ).toBe(true)
    })

    it('孙子节点应返回 true', () => {
        expect(
            isDescendantOf(
                tree,
                (n) => n.id === 6,
                (n) => n.id === 1
            )
        ).toBe(true)
    })

    it('曾孙节点应返回 true', () => {
        expect(
            isDescendantOf(
                tree,
                (n) => n.id === 6,
                (n) => n.id === 1
            )
        ).toBe(true)
    })

    it('非后代节点应返回 false', () => {
        expect(
            isDescendantOf(
                tree,
                (n) => n.id === 6,
                (n) => n.id === 3
            )
        ).toBe(false)
    })

    it('祖先节点不能作为后代（反向关系）', () => {
        expect(
            isDescendantOf(
                tree,
                (n) => n.id === 2,
                (n) => n.id === 4
            )
        ).toBe(false)
    })

    it('同一节点不应视为后代关系', () => {
        expect(
            isDescendantOf(
                tree,
                (n) => n.id === 2,
                (n) => n.id === 2
            )
        ).toBe(false)
    })

    it('任一节点不存在应返回 false', () => {
        expect(
            isDescendantOf(
                tree,
                (n) => n.id === 999,
                (n) => n.id === 6
            )
        ).toBe(false)

        expect(
            isDescendantOf(
                tree,
                (n) => n.id === 2,
                (n) => n.id === 999
            )
        ).toBe(false)
    })

    it('根节点不是任何其他节点的后代', () => {
        expect(
            isDescendantOf(
                tree,
                (n) => n.id === 1,
                (n) => n.id === 2
            )
        ).toBe(false)

        expect(
            isDescendantOf(
                tree,
                (n) => n.id === 1,
                (n) => n.id === 3
            )
        ).toBe(false)

        expect(
            isDescendantOf(
                tree,
                (n) => n.id === 1,
                (n) => n.id === 6
            )
        ).toBe(false)
    })

    it('叶子节点可以是祖先节点的后代', () => {
        expect(
            isDescendantOf(
                tree,
                (n) => n.id === 6,
                (n) => n.id === 2
            )
        ).toBe(true)

        expect(
            isDescendantOf(
                tree,
                (n) => n.id === 5,
                (n) => n.id === 2
            )
        ).toBe(true)
    })

    it('应支持自定义 childrenKey', () => {
        const customTree = {
            id: 'root',
            subs: [
                {
                    id: 'a',
                    subs: [{ id: 'a1', subs: [{ id: 'a1-1' }] }],
                },
                { id: 'b' },
            ],
        }
        expect(
            isDescendantOf(
                customTree,
                (n) => n.id === 'a1-1',
                (n) => n.id === 'root',
                { childrenKey: 'subs' }
            )
        ).toBe(true)

        expect(
            isDescendantOf(
                customTree,
                (n) => n.id === 'a1-1',
                (n) => n.id === 'a',
                { childrenKey: 'subs' }
            )
        ).toBe(true)
    })

    it('森林中应正确判断后代关系', () => {
        const forest: TreeNode[] = [
            {
                id: 1,
                children: [{ id: 2, children: [{ id: 3 }] }],
            },
            { id: 4 },
        ]

        // 同一棵树中的后代关系
        expect(
            isDescendantOf(
                forest,
                (n) => n.id === 3,
                (n) => n.id === 1
            )
        ).toBe(true)

        expect(
            isDescendantOf(
                forest,
                (n) => n.id === 3,
                (n) => n.id === 2
            )
        ).toBe(true)

        // 不同树之间不存在后代关系
        expect(
            isDescendantOf(
                forest,
                (n) => n.id === 4,
                (n) => n.id === 1
            )
        ).toBe(false)

        expect(
            isDescendantOf(
                forest,
                (n) => n.id === 3,
                (n) => n.id === 4
            )
        ).toBe(false)
    })

    it('深层嵌套的后代关系应正确判断', () => {
        const deepTree: TreeNode = {
            id: 'L0',
            children: [
                {
                    id: 'L1',
                    children: [
                        {
                            id: 'L2',
                            children: [
                                {
                                    id: 'L3',
                                    children: [
                                        {
                                            id: 'L4',
                                            children: [{ id: 'L5' }],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        }

        // L5 是 L0 的后代
        expect(
            isDescendantOf(
                deepTree,
                (n) => n.id === 'L5',
                (n) => n.id === 'L0'
            )
        ).toBe(true)

        // L5 是 L2 的后代
        expect(
            isDescendantOf(
                deepTree,
                (n) => n.id === 'L5',
                (n) => n.id === 'L2'
            )
        ).toBe(true)

        // L5 是 L4 的直接子节点
        expect(
            isDescendantOf(
                deepTree,
                (n) => n.id === 'L5',
                (n) => n.id === 'L4'
            )
        ).toBe(true)

        // L0 不是任何节点的后代
        expect(
            isDescendantOf(
                deepTree,
                (n) => n.id === 'L0',
                (n) => n.id === 'L5'
            )
        ).toBe(false)
    })

    it('单节点树应正确处理', () => {
        const singleNode: TreeNode = { id: 'only' }

        expect(
            isDescendantOf(
                singleNode,
                (n) => n.id === 'only',
                (n) => n.id === 'only'
            )
        ).toBe(false)
    })

    it('只有根节点和叶子节点的树', () => {
        const simpleTree: TreeNode = {
            id: 'root',
            children: [{ id: 'leaf1' }, { id: 'leaf2' }, { id: 'leaf3' }],
        }

        // 所有叶子都是根节点的后代
        expect(
            isDescendantOf(
                simpleTree,
                (n) => n.id === 'leaf1',
                (n) => n.id === 'root'
            )
        ).toBe(true)

        expect(
            isDescendantOf(
                simpleTree,
                (n) => n.id === 'leaf2',
                (n) => n.id === 'root'
            )
        ).toBe(true)

        // 叶子节点之间没有后代关系
        expect(
            isDescendantOf(
                simpleTree,
                (n) => n.id === 'leaf1',
                (n) => n.id === 'leaf2'
            )
        ).toBe(false)
    })

    describe('边界情况', () => {
        it('空数组应返回 false', () => {
            expect(
                isDescendantOf(
                    [],
                    (n) => n.id === 1,
                    (n) => n.id === 2
                )
            ).toBe(false)
        })

        it('没有 children 字段的节点应正确处理', () => {
            const treeWithoutChildren = {
                id: 1,
                name: 'root',
            }
            expect(
                isDescendantOf(
                    treeWithoutChildren,
                    (n) => n.id === 1,
                    (n) => n.id === 1
                )
            ).toBe(false)
        })

        it('children 字段不是数组应跳过子节点遍历', () => {
            const invalidTree = {
                id: 1,
                children: 'not-array' as any,
            }
            expect(
                isDescendantOf(
                    invalidTree,
                    (n) => n.id === 1,
                    (n) => n.id === 1
                )
            ).toBe(false)
        })
    })

    describe('特殊数据类型', () => {
        it('应支持字符串 ID 的节点', () => {
            const stringIdTree: TreeNode = {
                id: 'root-节点',
                children: [
                    {
                        id: 'child-中文',
                        children: [{ id: 'grandchild-测试' }],
                    },
                    { id: 'child-英文' },
                ],
            }

            expect(
                isDescendantOf(
                    stringIdTree,
                    (n) => n.id === 'grandchild-测试',
                    (n) => n.id === 'root-节点'
                )
            ).toBe(true)

            expect(
                isDescendantOf(
                    stringIdTree,
                    (n) => n.id === 'child-中文',
                    (n) => n.id === 'root-节点'
                )
            ).toBe(true)
        })

        it('应支持数字和混合类型 ID', () => {
            const mixedTree: TreeNode = {
                id: 0,
                children: [{ id: 1, children: [{ id: 3 }] }, { id: 2 }],
            }

            expect(
                isDescendantOf(
                    mixedTree,
                    (n) => n.id === 3,
                    (n) => n.id === 0
                )
            ).toBe(true)

            expect(
                isDescendantOf(
                    mixedTree,
                    (n) => n.id === 1,
                    (n) => n.id === 0
                )
            ).toBe(true)

            expect(
                isDescendantOf(
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
                isDescendantOf(
                    treeWithExtraProps,
                    (n) => n.id === 2,
                    (n) => n.id === 1
                )
            ).toBe(true)

            // 使用其他属性进行断言
            expect(
                isDescendantOf(
                    treeWithExtraProps,
                    (n) => n.type === 'child' && n.name === 'child1',
                    (n) => n.type === 'parent' && n.name === 'root'
                )
            ).toBe(true)
        })
    })

    describe('与 isAncestorOf 的对称性', () => {
        it('isDescendantOf(A, B) 应等于 isAncestorOf(B, A)', () => {
            // 如果 A 是 B 的后代，那么 B 就是 A 的祖先
            expect(
                isDescendantOf(
                    tree,
                    (n) => n.id === 6,
                    (n) => n.id === 2
                )
            ).toBe(
                isAncestorOf(
                    tree,
                    (n) => n.id === 2,
                    (n) => n.id === 6
                )
            )

            expect(
                isDescendantOf(
                    tree,
                    (n) => n.id === 4,
                    (n) => n.id === 1
                )
            ).toBe(
                isAncestorOf(
                    tree,
                    (n) => n.id === 1,
                    (n) => n.id === 4
                )
            )

            // 反向也应该成立
            expect(
                isDescendantOf(
                    tree,
                    (n) => n.id === 1,
                    (n) => n.id === 6
                )
            ).toBe(
                isAncestorOf(
                    tree,
                    (n) => n.id === 6,
                    (n) => n.id === 1
                )
            )
        })
    })
})
