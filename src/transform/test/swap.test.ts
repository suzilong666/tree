// modify/swap.test.ts
import { swap } from '../swap'
import { TreeNode } from '../../types'

describe('swap 交换节点（包含子树）', () => {
    const tree: TreeNode = {
        id: 1,
        name: 'root',
        children: [
            { id: 2, name: 'a', children: [{ id: 4, name: 'a1' }] },
            { id: 3, name: 'b' },
        ],
    }

    it('应交换同一父节点下的两个子节点', () => {
        const newTree = swap(
            tree,
            (n) => n.id === 2,
            (n) => n.id === 3
        )
        expect(newTree).not.toBe(tree)
        expect((newTree as any).children.map((c: any) => c.id)).toEqual([3, 2])
        expect((newTree as any).children[1].children[0].id).toBe(4)
    })

    it('应交换不同父节点下的两个节点', () => {
        const newTree = swap(
            tree,
            (n) => n.id === 4,
            (n) => n.id === 3
        )
        const rootChildren = (newTree as any).children
        expect(rootChildren[0].children.map((c: any) => c.id)).toEqual([3]) // a 的子节点现在是 3
        expect(rootChildren[1].id).toBe(4) // root 的第二个子节点现在是 4
    })

    it('节点互为祖先-后代时不应交换', () => {
        const newTree = swap(
            tree,
            (n) => n.id === 1,
            (n) => n.id === 2
        )
        expect(newTree).toBe(tree)
    })

    it('任一节点不存在时应返回原树', () => {
        const newTree = swap(
            tree,
            (n) => n.id === 999,
            (n) => n.id === 2
        )
        expect(newTree).toBe(tree)
    })

    it('同一节点交换应返回原树', () => {
        const newTree = swap(
            tree,
            (n) => n.id === 2,
            (n) => n.id === 2
        )
        expect(newTree).toBe(tree)
    })

    it('应支持自定义 childrenKey', () => {
        const customTree = {
            id: 'root',
            subs: [{ id: 'a', subs: [{ id: 'a1' }] }, { id: 'b' }],
        }
        const newTree = swap(
            customTree,
            (n) => n.id === 'a',
            (n) => n.id === 'b',
            { childrenKey: 'subs' }
        )
        expect(newTree).toEqual({
            id: 'root',
            subs: [{ id: 'b' }, { id: 'a', subs: [{ id: 'a1' }] }],
        })
    })

    it('应支持森林（多根节点）', () => {
        const forest: TreeNode[] = [
            { id: 1, children: [{ id: 2 }] },
            { id: 3, children: [{ id: 4 }] },
        ]
        const newForest = swap(
            forest,
            (n) => n.id === 2,
            (n) => n.id === 4
        )
        expect(newForest[0].children[0].id).toBe(4)
        expect(newForest[1].children[0].id).toBe(2)
    })
})
