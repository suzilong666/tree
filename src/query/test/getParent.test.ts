// query/getParent.test.ts
import { getParent } from '../getParent'
import { TreeNode } from '../../types'

describe('getParent 获取父节点', () => {
    const tree: TreeNode = {
        id: 1,
        name: 'root',
        children: [
            { id: 2, name: 'a', children: [{ id: 4, name: 'a1' }] },
            { id: 3, name: 'b' },
        ],
    }

    it('应返回目标节点的父节点', () => {
        const parent = getParent(tree, (n) => n.id === 4)
        expect(parent).toBe(tree.children[0])
    })

    it('目标节点是根节点时应返回 null', () => {
        const parent = getParent(tree, (n) => n.id === 1)
        expect(parent).toBeNull()
    })

    it('目标节点不存在时应返回 null', () => {
        const parent = getParent(tree, (n) => n.id === 999)
        expect(parent).toBeNull()
    })

    it('应支持森林中的节点', () => {
        const forest: TreeNode[] = [{ id: 1, children: [{ id: 2 }] }, { id: 3 }]
        const parent = getParent(forest, (n) => n.id === 2)
        expect(parent).toBe(forest[0])
    })

    it('森林中的根节点应返回 null', () => {
        const forest: TreeNode[] = [{ id: 1 }, { id: 2 }]
        const parent = getParent(forest, (n) => n.id === 1)
        expect(parent).toBeNull()
    })

    it('应支持自定义 childrenKey', () => {
        const customTree = {
            id: 'root',
            subs: [{ id: 'a', subs: [{ id: 'a1' }] }],
        }
        const parent = getParent(customTree, (n) => n.id === 'a1', {
            childrenKey: 'subs',
        })
        expect(parent?.id).toBe('a')
    })
})
