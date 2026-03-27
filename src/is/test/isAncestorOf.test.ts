// relation/isAncestorOf.test.ts
import { isAncestorOf } from '../isAncestorOf'
import { TreeNode } from '../../types'

describe('isAncestorOf 判断祖先节点', () => {
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

    it('直接父节点应返回 true', () => {
        expect(
            isAncestorOf(
                tree,
                (n) => n.id === 2,
                (n) => n.id === 4
            )
        ).toBe(true)
    })

    it('祖父节点应返回 true', () => {
        expect(
            isAncestorOf(
                tree,
                (n) => n.id === 1,
                (n) => n.id === 6
            )
        ).toBe(true)
    })

    it('曾祖父节点应返回 true', () => {
        expect(
            isAncestorOf(
                tree,
                (n) => n.id === 1,
                (n) => n.id === 6
            )
        ).toBe(true)
    })

    it('非祖先节点应返回 false', () => {
        expect(
            isAncestorOf(
                tree,
                (n) => n.id === 3,
                (n) => n.id === 6
            )
        ).toBe(false)
    })

    it('后代节点不能作为祖先（反向关系）', () => {
        expect(
            isAncestorOf(
                tree,
                (n) => n.id === 4,
                (n) => n.id === 2
            )
        ).toBe(false)
    })

    it('同一节点不应视为祖先关系', () => {
        expect(
            isAncestorOf(
                tree,
                (n) => n.id === 2,
                (n) => n.id === 2
            )
        ).toBe(false)
    })

    it('任一节点不存在应返回 false', () => {
        expect(
            isAncestorOf(
                tree,
                (n) => n.id === 999,
                (n) => n.id === 6
            )
        ).toBe(false)

        expect(
            isAncestorOf(
                tree,
                (n) => n.id === 2,
                (n) => n.id === 999
            )
        ).toBe(false)
    })

    it('根节点是所有其他节点的祖先', () => {
        expect(
            isAncestorOf(
                tree,
                (n) => n.id === 1,
                (n) => n.id === 2
            )
        ).toBe(true)

        expect(
            isAncestorOf(
                tree,
                (n) => n.id === 1,
                (n) => n.id === 3
            )
        ).toBe(true)

        expect(
            isAncestorOf(
                tree,
                (n) => n.id === 1,
                (n) => n.id === 6
            )
        ).toBe(true)
    })

    it('叶子节点不能是任何节点的祖先', () => {
        expect(
            isAncestorOf(
                tree,
                (n) => n.id === 6,
                (n) => n.id === 2
            )
        ).toBe(false)

        expect(
            isAncestorOf(
                tree,
                (n) => n.id === 5,
                (n) => n.id === 2
            )
        ).toBe(false)
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
            isAncestorOf(
                customTree,
                (n) => n.id === 'root',
                (n) => n.id === 'a1-1',
                { childrenKey: 'subs' }
            )
        ).toBe(true)

        expect(
            isAncestorOf(
                customTree,
                (n) => n.id === 'a',
                (n) => n.id === 'a1-1',
                { childrenKey: 'subs' }
            )
        ).toBe(true)
    })

    it('森林中应能正确判断祖先关系', () => {
        const forest: TreeNode[] = [
            {
                id: 1,
                children: [{ id: 2, children: [{ id: 3 }] }],
            },
            { id: 4 },
        ]

        // 同一棵树中的祖先关系
        expect(
            isAncestorOf(
                forest,
                (n) => n.id === 1,
                (n) => n.id === 3
            )
        ).toBe(true)

        expect(
            isAncestorOf(
                forest,
                (n) => n.id === 2,
                (n) => n.id === 3
            )
        ).toBe(true)

        // 不同树之间不存在祖先关系
        expect(
            isAncestorOf(
                forest,
                (n) => n.id === 1,
                (n) => n.id === 4
            )
        ).toBe(false)

        expect(
            isAncestorOf(
                forest,
                (n) => n.id === 4,
                (n) => n.id === 3
            )
        ).toBe(false)
    })

    it('深层嵌套的祖先关系应正确判断', () => {
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

        // L0 是 L5 的祖先
        expect(
            isAncestorOf(
                deepTree,
                (n) => n.id === 'L0',
                (n) => n.id === 'L5'
            )
        ).toBe(true)

        // L2 是 L5 的祖先
        expect(
            isAncestorOf(
                deepTree,
                (n) => n.id === 'L2',
                (n) => n.id === 'L5'
            )
        ).toBe(true)

        // L4 是 L5 的直接父节点
        expect(
            isAncestorOf(
                deepTree,
                (n) => n.id === 'L4',
                (n) => n.id === 'L5'
            )
        ).toBe(true)

        // L5 不是任何节点的祖先
        expect(
            isAncestorOf(
                deepTree,
                (n) => n.id === 'L5',
                (n) => n.id === 'L0'
            )
        ).toBe(false)
    })

    it('单节点树应正确处理', () => {
        const singleNode: TreeNode = { id: 'only' }

        expect(
            isAncestorOf(
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

        // 根节点是所有叶子的祖先
        expect(
            isAncestorOf(
                simpleTree,
                (n) => n.id === 'root',
                (n) => n.id === 'leaf1'
            )
        ).toBe(true)

        expect(
            isAncestorOf(
                simpleTree,
                (n) => n.id === 'root',
                (n) => n.id === 'leaf2'
            )
        ).toBe(true)

        // 叶子节点之间没有祖先关系
        expect(
            isAncestorOf(
                simpleTree,
                (n) => n.id === 'leaf1',
                (n) => n.id === 'leaf2'
            )
        ).toBe(false)
    })
})
