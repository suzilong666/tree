// query/getAncestors.test.ts
import { getAncestors } from '../getAncestors'
import { TreeNode } from '../../types'

describe('getAncestors 获取节点祖先', () => {
    // 测试树结构
    const tree: TreeNode = {
        id: 1,
        name: 'root',
        children: [
            {
                id: 2,
                name: 'a',
                children: [{ id: 4, name: 'a1' }],
            },
            { id: 3, name: 'b' },
        ],
    }

    it('应返回目标节点的所有祖先（从根到父）', () => {
        const ancestors = getAncestors(tree, (node) => node.id === 4)
        expect(ancestors.map((n) => n.id)).toEqual([1, 2]) // 根 -> a
    })

    it('目标节点是根节点时，应返回空数组', () => {
        const ancestors = getAncestors(tree, (node) => node.id === 1)
        expect(ancestors).toEqual([])
    })

    it('目标节点不存在时，应返回空数组', () => {
        const ancestors = getAncestors(tree, (node) => node.id === 999)
        expect(ancestors).toEqual([])
    })

    it('应支持森林（多根节点）', () => {
        const forest: TreeNode[] = [
            { id: 1, children: [{ id: 2, children: [{ id: 3 }] }] },
            { id: 4, children: [{ id: 5 }] },
        ]
        const ancestors = getAncestors(forest, (node) => node.id === 3)
        expect(ancestors.map((n) => n.id)).toEqual([1, 2])
    })

    it('应支持自定义 childrenKey', () => {
        const customTree = {
            id: 'root',
            subs: [{ id: 'a', subs: [{ id: 'a1' }] }],
        }
        const ancestors = getAncestors(customTree, (node) => node.id === 'a1', {
            childrenKey: 'subs',
        })
        expect(ancestors.map((n) => n.id)).toEqual(['root', 'a'])
    })

    it('空树应返回空数组', () => {
        expect(getAncestors([], () => true)).toEqual([])
    })

    it('null 或 undefined 输入应返回空数组（由 ensureArray 处理）', () => {
        expect(getAncestors(null as any, () => true)).toEqual([])
        expect(getAncestors(undefined as any, () => true)).toEqual([])
    })
})
