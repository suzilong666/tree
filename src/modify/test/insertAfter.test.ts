// modify/insertAfter.test.ts
import { insertAfter } from '../insertAfter'
import { TreeNode } from '../../types'

describe('insertAfter 在节点后插入兄弟', () => {
    // 原始树结构
    const originalTree: TreeNode = {
        id: 1,
        name: 'root',
        children: [
            { id: 2, name: 'a', children: [{ id: 4, name: 'a1' }] },
            { id: 3, name: 'b' },
        ],
    }

    it('应在目标节点后插入新节点作为兄弟', () => {
        const newNode = { id: 5, name: 'new' }
        const newTree = insertAfter(
            originalTree,
            (node) => node.id === 2,
            newNode
        )

        expect(newTree).not.toBe(originalTree)
        expect((newTree as any).children).toEqual([
            { id: 2, name: 'a', children: [{ id: 4, name: 'a1' }] },
            { id: 5, name: 'new' },
            { id: 3, name: 'b' },
        ])
        // 原树不变
        expect(originalTree.children).toEqual([
            { id: 2, name: 'a', children: [{ id: 4, name: 'a1' }] },
            { id: 3, name: 'b' },
        ])
    })

    it('目标节点是最后一个子节点时，插入后成为新的最后一个', () => {
        const newNode = { id: 6, name: 'new2' }
        const newTree = insertAfter(
            originalTree,
            (node) => node.id === 3,
            newNode
        )

        expect((newTree as any).children).toEqual([
            { id: 2, name: 'a', children: [{ id: 4, name: 'a1' }] },
            { id: 3, name: 'b' },
            { id: 6, name: 'new2' },
        ])
    })

    it('目标节点是第一个子节点时，插入后成为第二个', () => {
        const newNode = { id: 7, name: 'new3' }
        const newTree = insertAfter(
            originalTree,
            (node) => node.id === 2,
            newNode
        )
        expect((newTree as any).children[1].id).toBe(7)
    })

    it('目标节点不存在时应返回原树（引用不变）', () => {
        const newTree = insertAfter(originalTree, (node) => node.id === 999, {
            id: 99,
        })
        expect(newTree).toBe(originalTree)
    })

    it('目标是根节点时应返回原树（无法插入兄弟）', () => {
        const newTree = insertAfter(originalTree, (node) => node.id === 1, {
            id: 99,
        })
        expect(newTree).toBe(originalTree)
    })

    it('森林中只修改第一个匹配的节点', () => {
        const forest: TreeNode[] = [
            { id: 1, children: [{ id: 2 }, { id: 3 }] },
            { id: 4, children: [{ id: 5 }] },
        ]
        const newNode = { id: 6 }
        const newForest = insertAfter(
            forest,
            (node) => node.id === 2 || node.id === 5,
            newNode
        ) as TreeNode[]

        expect(newForest).not.toBe(forest)
        expect(newForest[0].children).toEqual([{ id: 2 }, { id: 6 }, { id: 3 }]) // 第一个匹配被修改
        expect(newForest[1].children).toEqual([{ id: 5 }]) // 第二个匹配未处理
    })

    it('应支持自定义 childrenKey', () => {
        const customTree = {
            id: 'root',
            subs: [{ id: 'a' }, { id: 'b' }],
        }
        const newNode = { id: 'c' }
        const newTree = insertAfter(
            customTree,
            (node) => node.id === 'a',
            newNode,
            { childrenKey: 'subs' }
        )
        expect(newTree).toEqual({
            id: 'root',
            subs: [{ id: 'a' }, { id: 'c' }, { id: 'b' }],
        })
    })

    it('目标节点在深层子节点中应能插入', () => {
        const newNode = { id: 8, name: 'deepNew' }
        const newTree = insertAfter(
            originalTree,
            (node) => node.id === 4,
            newNode
        )
        // 节点 4 是 a1，其父是 a（id=2）
        const aNode = (newTree as any).children[0]
        expect(aNode.children).toEqual([
            { id: 4, name: 'a1' },
            { id: 8, name: 'deepNew' },
        ])
    })

    it('新节点引用应保持不变', () => {
        const newNode = { id: 9, data: { x: 1 } }
        const newTree = insertAfter(
            originalTree,
            (node) => node.id === 2,
            newNode
        )
        const inserted = (newTree as any).children[1]
        expect(inserted).toBe(newNode)
    })

    it('空树应返回空数组', () => {
        expect(insertAfter([], () => true, { id: 1 })).toEqual([])
    })

    it('不应修改原树任何节点', () => {
        const originalCopy = JSON.parse(JSON.stringify(originalTree))
        insertAfter(originalTree, (node) => node.id === 2, { id: 5 })
        expect(originalTree).toEqual(originalCopy)
    })

    it('新节点本身带有 children 时应正确插入', () => {
        const newNodeWithChildren = {
            id: 5,
            name: 'new parent',
            children: [{ id: 6, name: 'grandchild' }],
        }
        const newTree = insertAfter(
            originalTree,
            (node) => node.id === 2,
            newNodeWithChildren
        )

        expect(newTree).not.toBe(originalTree)
        expect((newTree as any).children).toEqual([
            { id: 2, name: 'a', children: [{ id: 4, name: 'a1' }] },
            newNodeWithChildren,
            { id: 3, name: 'b' },
        ])
    })

    it('多个匹配节点时只修改第一个匹配的节点', () => {
        const treeWithMultipleMatches: TreeNode = {
            id: 1,
            children: [
                { id: 2, name: 'match' },
                { id: 3, name: 'match' },
                { id: 4, name: 'match' },
            ],
        }
        const newNode = { id: 5, name: 'new' }
        const newTree = insertAfter(
            treeWithMultipleMatches,
            (node) => node.name === 'match',
            newNode
        )

        expect(newTree).not.toBe(treeWithMultipleMatches)
        expect((newTree as any).children).toEqual([
            { id: 2, name: 'match' },
            { id: 5, name: 'new' },
            { id: 3, name: 'match' },
            { id: 4, name: 'match' },
        ])
    })

    it('目标节点是森林中的根节点时应返回原树', () => {
        const forest: TreeNode[] = [
            { id: 1, name: 'root1' },
            { id: 2, name: 'root2' },
        ]
        const newNode = { id: 3, name: 'new' }
        const newForest = insertAfter(forest, (node) => node.id === 1, newNode)

        expect(newForest).toBe(forest)
    })

    it('目标节点在深层嵌套结构中应正确插入', () => {
        const deepTree: TreeNode = {
            id: 1,
            children: [
                {
                    id: 2,
                    children: [
                        {
                            id: 3,
                            children: [{ id: 4 }, { id: 5 }, { id: 6 }],
                        },
                    ],
                },
            ],
        }
        const newNode = { id: 7, name: 'deep new' }
        const newTree = insertAfter(deepTree, (node) => node.id === 4, newNode)

        expect(newTree).not.toBe(deepTree)
        expect((newTree as any).children[0].children[0].children).toEqual([
            { id: 4 },
            { id: 7, name: 'deep new' },
            { id: 5 },
            { id: 6 },
        ])
    })
})
