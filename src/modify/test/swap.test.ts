// modify/swap.test.ts
import { swap } from '../swap'
import { TreeNode } from '../../types'

describe('swap 交换节点', () => {
    // 原始树结构
    const originalTree: TreeNode = {
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
            {
                id: 3,
                name: 'b',
                children: [{ id: 6, name: 'b1' }],
            },
        ],
    }

    it('应交换两个叶子节点', () => {
        const newTree = swap(
            originalTree,
            (node) => node.id === 4,
            (node) => node.id === 6
        )

        expect(newTree).not.toBe(originalTree)
        // a 节点下应该有 b1（原 id=6）
        expect((newTree as any).children[0].children).toEqual([
            { id: 6, name: 'b1' },
            { id: 5, name: 'a2' },
        ])
        // b 节点下应该有 a1（原 id=4）
        expect((newTree as any).children[1].children).toEqual([
            { id: 4, name: 'a1' },
        ])
        // 原树不变
        expect((originalTree as any).children[0].children).toEqual([
            { id: 4, name: 'a1' },
            { id: 5, name: 'a2' },
        ])
    })

    it('应交换内部节点（包括其子树）', () => {
        const newTree = swap(
            originalTree,
            (node) => node.id === 2,
            (node) => node.id === 3
        )

        expect((newTree as any).children[0]).toEqual({
            id: 3,
            name: 'b',
            children: [{ id: 6, name: 'b1' }],
        })
        expect((newTree as any).children[1]).toEqual({
            id: 2,
            name: 'a',
            children: [
                { id: 4, name: 'a1' },
                { id: 5, name: 'a2' },
            ],
        })
    })

    // it('应交换根节点和另一个节点', () => {
    //     const newTree = swap(originalTree, (node) => node.id === 1, (node) => node.id === 2)

    //     // 根节点变成了原来的 a 节点
    //     expect(newTree).toEqual({
    //         id: 2,
    //         name: 'a',
    //         children: [
    //             {
    //                 id: 1,
    //                 name: 'root',
    //                 children: [
    //                     {
    //                         id: 3,
    //                         name: 'b',
    //                         children: [{ id: 6, name: 'b1' }],
    //                     },
    //                 ],
    //             },
    //             { id: 5, name: 'a2' },
    //         ],
    //     })
    // })

    it('森林中应交换不同树的节点', () => {
        const forest: TreeNode[] = [
            { id: 1, name: 'A', children: [{ id: 2, name: 'A1' }] },
            { id: 3, name: 'B', children: [{ id: 4, name: 'B1' }] },
        ]
        const newForest = swap(
            forest,
            (node) => node.id === 2,
            (node) => node.id === 4
        ) as TreeNode[]

        expect(newForest[0].children).toEqual([{ id: 4, name: 'B1' }])
        expect(newForest[1].children).toEqual([{ id: 2, name: 'A1' }])
    })

    it('交换同一节点时应返回原树（引用不变）', () => {
        const newTree = swap(
            originalTree,
            (node) => node.id === 4,
            (node) => node.id === 4
        )
        expect(newTree).toBe(originalTree)
    })

    it('节点不存在时应返回原树（引用不变）', () => {
        const newTree = swap(
            originalTree,
            (node) => node.id === 999,
            (node) => node.id === 4
        )
        expect(newTree).toBe(originalTree)
    })

    it('只有一个节点存在时应返回原树', () => {
        const newTree = swap(
            originalTree,
            (node) => node.id === 4,
            (node) => node.id === 999
        )
        expect(newTree).toBe(originalTree)
    })

    it('应支持自定义 childrenKey', () => {
        const customTree = {
            id: 'root',
            subs: [
                { id: 'a', subs: [{ id: 'a1' }] },
                { id: 'b', subs: [{ id: 'b1' }] },
            ],
        }
        const newTree = swap(
            customTree,
            (node) => node.id === 'a1',
            (node) => node.id === 'b1',
            { childrenKey: 'subs' }
        ) as typeof customTree
        expect(newTree.subs[0].subs).toEqual([{ id: 'b1' }])
        expect(newTree.subs[1].subs).toEqual([{ id: 'a1' }])
    })

    it('交换后应保持节点的完整性（包括额外属性）', () => {
        const treeWithExtraProps: TreeNode = {
            id: 1,
            data: { value: 100 },
            children: [
                { id: 2, extra: 'propA', children: [{ id: 4 }] },
                { id: 3, extra: 'propB', children: [{ id: 5 }] },
            ],
        }
        const newTree = swap(
            treeWithExtraProps,
            (node) => node.id === 2,
            (node) => node.id === 3
        )

        expect((newTree as any).children[0].extra).toBe('propB')
        expect((newTree as any).children[1].extra).toBe('propA')
    })

    it('不应修改原树', () => {
        const originalCopy = JSON.parse(JSON.stringify(originalTree))
        swap(
            originalTree,
            (node) => node.id === 4,
            (node) => node.id === 6
        )
        expect(originalTree).toEqual(originalCopy)
    })

    it('交换具有复杂子树结构的节点', () => {
        const complexTree: TreeNode = {
            id: 1,
            children: [
                {
                    id: 2,
                    children: [
                        { id: 3, children: [{ id: 4 }, { id: 5 }] },
                        { id: 6 },
                    ],
                },
                {
                    id: 7,
                    children: [{ id: 8, children: [{ id: 9 }] }],
                },
            ],
        }

        const newTree = swap(
            complexTree,
            (node) => node.id === 2,
            (node) => node.id === 7
        )

        // id=2 的整棵子树应该与 id=7 的整棵子树交换位置
        expect((newTree as any).children[0].id).toBe(7)
        expect((newTree as any).children[0].children).toEqual([
            { id: 8, children: [{ id: 9 }] },
        ])
        expect((newTree as any).children[1].id).toBe(2)
        expect((newTree as any).children[1].children).toEqual([
            { id: 3, children: [{ id: 4 }, { id: 5 }] },
            { id: 6 },
        ])
    })
})
