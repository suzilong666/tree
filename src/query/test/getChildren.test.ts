// query/getChildren.test.ts
import { getChildren } from '../getChildren'
import { TreeNode } from '../../types'

describe('getChildren 获取子节点', () => {
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
                    { id: 6, name: 'a3' },
                ],
            },
            {
                id: 3,
                name: 'b',
                children: [{ id: 7, name: 'b1' }],
            },
        ],
    }

    it('应返回目标节点的所有子节点', () => {
        const children = getChildren(tree, (n) => n.id === 2)
        expect(children.map((c) => c.id)).toEqual([4, 5, 6])
    })

    it('目标节点只有一个子节点时返回数组', () => {
        const children = getChildren(tree, (n) => n.id === 3)
        expect(children.map((c) => c.id)).toEqual([7])
    })

    it('目标节点没有子节点时返回空数组', () => {
        // a1 是叶子节点，没有子节点
        const children = getChildren(tree, (n) => n.id === 4)
        expect(children).toEqual([])
    })

    it('目标节点不存在时应返回空数组', () => {
        const children = getChildren(tree, (n) => n.id === 999)
        expect(children).toEqual([])
    })

    it('应支持森林（多根节点）', () => {
        const forest: TreeNode[] = [
            { id: 1, children: [{ id: 2 }, { id: 3 }] },
            { id: 4, children: [{ id: 5 }] },
        ]
        const children = getChildren(forest, (n) => n.id === 1)
        expect(children.map((c) => c.id)).toEqual([2, 3])
    })

    it('森林中目标节点不存在时应返回空数组', () => {
        const forest: TreeNode[] = [{ id: 1 }, { id: 2 }]
        const children = getChildren(forest, (n) => n.id === 999)
        expect(children).toEqual([])
    })

    it('应支持自定义 childrenKey', () => {
        const customTree = {
            id: 'root',
            subs: [
                { id: 'a', subs: [{ id: 'a1' }, { id: 'a2' }] },
                { id: 'b', subs: [{ id: 'b1' }] },
            ],
        }
        const children = getChildren(customTree, (n) => n.id === 'a', {
            childrenKey: 'subs',
        })
        expect(children.map((c) => c.id)).toEqual(['a1', 'a2'])
    })

    it('自定义 childrenKey 且目标节点无子节点时应返回空数组', () => {
        const customTree = {
            id: 'root',
            subs: [{ id: 'a' }, { id: 'b' }],
        }
        const children = getChildren(customTree, (n) => n.id === 'a', {
            childrenKey: 'subs',
        })
        expect(children).toEqual([])
    })

    it('应处理子节点字段为非数组的情况', () => {
        const weirdTree = {
            id: 1,
            children: 'not-an-array' as any,
        }
        const children = getChildren(weirdTree, (n) => n.id === 1)
        expect(children).toEqual([])
    })

    it('空树应返回空数组', () => {
        expect(getChildren([], () => true)).toEqual([])
    })

    it('null 或 undefined 输入应返回空数组', () => {
        expect(getChildren(null as any, () => true)).toEqual([])
        expect(getChildren(undefined as any, () => true)).toEqual([])
    })

    it('应支持复杂的断言函数', () => {
        // 查找 name 以 'b' 开头的节点的子节点
        const children = getChildren(
            tree,
            (n) => typeof n.name === 'string' && n.name.startsWith('b')
        )
        expect(children.map((c) => c.id)).toEqual([7])
    })

    it('应保持返回数组的不可变性（不修改原树）', () => {
        const originalTree: TreeNode = {
            id: 1,
            children: [{ id: 2 }, { id: 3 }],
        }
        const children = getChildren(originalTree, (n) => n.id === 1)

        // 修改返回的数组不应影响原树
        children.push({ id: 999 })
        expect(originalTree.children?.length).toBe(2)
        expect(children.length).toBe(3)
    })
})
