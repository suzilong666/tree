// modify/remove.test.ts
import { remove } from '../remove'
import { TreeNode } from '../../types'

describe('remove 删除节点', () => {
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

    it('应删除叶子节点', () => {
        const newTree = remove(originalTree, (node) => node.id === 4)

        expect(newTree).not.toBe(originalTree)
        // a 节点下只剩 a2
        expect(
            (newTree as any).children[0].children.map((n: any) => n.id)
        ).toEqual([5])
        // 原树不变
        expect(originalTree.children[0].children.map((n: any) => n.id)).toEqual(
            [4, 5]
        )
    })

    it('应删除内部节点及其所有子节点', () => {
        const newTree = remove(originalTree, (node) => node.id === 2)

        expect((newTree as any).children.map((n: any) => n.id)).toEqual([3]) // root 下只剩 b
        // 原树不变
        expect(originalTree.children.length).toBe(2)
    })

    it('应删除根节点（在森林中移除整棵树）', () => {
        const forest: TreeNode[] = [
            { id: 1, name: 'r1', children: [{ id: 2 }] },
            { id: 3, name: 'r2' },
        ]
        const newForest = remove(forest, (node) => node.id === 1)

        expect(newForest).not.toBe(forest)
        expect(newForest).toHaveLength(1)
        expect(newForest[0].id).toBe(3)
    })

    it('森林中只删除第一个匹配的节点', () => {
        const forest: TreeNode[] = [
            { id: 1, children: [{ id: 2 }, { id: 3 }] },
            { id: 4, children: [{ id: 5 }] },
        ]
        const newForest = remove(
            forest,
            (node) => node.id === 2 || node.id === 5
        )

        // 只删除第一个匹配的节点（id=2）
        expect(newForest[0].children.map((c: any) => c.id)).toEqual([3]) // 2 被移除
        expect(newForest[1].children.map((c: any) => c.id)).toEqual([5]) // 5 没动
    })

    it('节点不存在时应返回原树（引用不变）', () => {
        const newTree = remove(originalTree, (node) => node.id === 999)
        expect(newTree).toBe(originalTree)
    })

    it('删除后父节点的 children 为空数组时保留空数组', () => {
        const tree: TreeNode = {
            id: 1,
            children: [{ id: 2 }],
        }
        const newTree = remove(tree, (node) => node.id === 2)
        expect(newTree).toEqual({ id: 1, children: [] })
    })

    it('空树应返回空数组', () => {
        expect(remove([], () => true)).toEqual([])
    })

    it('应支持自定义 childrenKey', () => {
        const customTree = {
            id: 'root',
            subs: [{ id: 'a', subs: [{ id: 'a1' }] }, { id: 'b' }],
        }
        const newTree = remove(customTree, (node) => node.id === 'a', {
            childrenKey: 'subs',
        })
        expect(newTree).toEqual({
            id: 'root',
            subs: [{ id: 'b' }],
        })
    })

    it('不应修改原树', () => {
        const originalCopy = JSON.parse(JSON.stringify(originalTree))
        remove(originalTree, (node) => node.id === 4)
        expect(originalTree).toEqual(originalCopy)
    })
})
