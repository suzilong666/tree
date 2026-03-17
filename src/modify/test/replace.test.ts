// modify/replace.test.ts
import { replace } from '../replace'
import { TreeNode } from '../../types'

describe('replace 替换节点', () => {
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
            { id: 3, name: 'b' },
        ],
    }

    it('应替换叶子节点', () => {
        const newNode = { id: 6, name: 'newLeaf', extra: true }
        const newTree = replace(originalTree, (node) => node.id === 4, newNode)

        expect(newTree).not.toBe(originalTree)
        // a 节点下原来的 a1 被替换为新节点
        expect((newTree as any).children[0].children).toEqual([
            { id: 6, name: 'newLeaf', extra: true },
            { id: 5, name: 'a2' },
        ])
        // 原树不变
        expect(originalTree.children[0].children).toEqual([
            { id: 4, name: 'a1' },
            { id: 5, name: 'a2' },
        ])
    })

    it('应替换内部节点（丢弃旧节点的子节点）', () => {
        const newNode = { id: 7, name: 'newInternal' }
        const newTree = replace(originalTree, (node) => node.id === 2, newNode)

        expect((newTree as any).children[0]).toEqual({
            id: 7,
            name: 'newInternal',
        })
        // 原 a 节点的子节点被丢弃
        expect((newTree as any).children).toHaveLength(2)
    })

    it('应替换根节点', () => {
        const newNode = { id: 8, name: 'newRoot' }
        const newTree = replace(originalTree, (node) => node.id === 1, newNode)

        expect(newTree).toEqual({ id: 8, name: 'newRoot' })
    })

    it('森林中只替换第一个匹配的节点', () => {
        const forest: TreeNode[] = [
            { id: 1, children: [{ id: 2 }, { id: 3 }] },
            { id: 4, children: [{ id: 5 }] },
        ]
        const newNode = { id: 6 }
        const newForest = replace(
            forest,
            (node) => node.id === 2 || node.id === 5,
            newNode
        )

        expect(newForest).not.toBe(forest)
        expect(newForest[0].children).toEqual([{ id: 6 }, { id: 3 }]) // 第一个匹配（id=2）被替换
        expect(newForest[1].children).toEqual([{ id: 5 }]) // 第二个匹配未处理
    })

    it('节点不存在时应返回原树（引用不变）', () => {
        const newTree = replace(originalTree, (node) => node.id === 999, {
            id: 99,
        })
        expect(newTree).toBe(originalTree)
    })

    it('新节点可以是任意结构，原树子节点不保留', () => {
        const newNode = { id: 9, data: [1, 2, 3] } // 没有 children 字段
        const newTree = replace(originalTree, (node) => node.id === 4, newNode)
        expect((newTree as any).children[0].children[0]).toEqual(newNode)
    })

    it('应支持自定义 childrenKey', () => {
        const customTree = {
            id: 'root',
            subs: [{ id: 'a', subs: [{ id: 'a1' }] }, { id: 'b' }],
        }
        const newNode = { id: 'c' }
        const newTree = replace(
            customTree,
            (node) => node.id === 'a',
            newNode,
            { childrenKey: 'subs' }
        )
        expect(newTree).toEqual({
            id: 'root',
            subs: [{ id: 'c' }, { id: 'b' }],
        })
    })

    it('不应修改原树', () => {
        const originalCopy = JSON.parse(JSON.stringify(originalTree))
        replace(originalTree, (node) => node.id === 4, { id: 6 })
        expect(originalTree).toEqual(originalCopy)
    })
})
