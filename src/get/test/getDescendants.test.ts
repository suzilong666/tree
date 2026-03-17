import { getDescendants } from '../getDescendants'
import { TreeNode } from '../../types'

describe('getDescendants 获取后代节点', () => {
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
                    { id: 5, name: 'a2', children: [{ id: 6, name: 'a2x' }] },
                ],
            },
            { id: 3, name: 'b' },
        ],
    }

    it('应返回目标节点的所有后代（不包括自身）', () => {
        const descendants = getDescendants(tree, (node) => node.id === 2)
        expect(descendants.map((n) => n.id)).toEqual([4, 5, 6]) // 顺序：a1, a2, a2x
    })

    it('目标节点为叶子时，应返回空数组', () => {
        const descendants = getDescendants(tree, (node) => node.id === 4)
        expect(descendants).toEqual([])
    })

    it('目标节点是根节点时，应返回所有其他节点', () => {
        const descendants = getDescendants(tree, (node) => node.id === 1)
        expect(descendants.map((n) => n.id)).toEqual([2, 4, 5, 6, 3]) // 深度优先顺序
    })

    it('目标节点不存在时，应返回空数组', () => {
        const descendants = getDescendants(tree, (node) => node.id === 999)
        expect(descendants).toEqual([])
    })

    it('应支持森林（多根节点）', () => {
        const forest: TreeNode[] = [
            { id: 1, children: [{ id: 2, children: [{ id: 3 }] }] },
            { id: 4, children: [{ id: 5 }] },
        ]
        const descendants = getDescendants(forest, (node) => node.id === 1)
        expect(descendants.map((n) => n.id)).toEqual([2, 3])
    })

    it('predicate 匹配多个节点时，只使用第一个匹配的节点', () => {
        // 匹配所有 id 为偶数的节点，但只取第一个找到的（id=2）
        const descendants = getDescendants(
            tree,
            (node) => (node.id as number) % 2 === 0
        )
        expect(descendants.map((n) => n.id)).toEqual([4, 5, 6]) // id=2 的后代
    })

    it('应支持自定义 childrenKey', () => {
        const customTree = {
            id: 'root',
            subs: [{ id: 'a', subs: [{ id: 'a1' }] }],
        }
        const descendants = getDescendants(
            customTree,
            (node) => node.id === 'a',
            { childrenKey: 'subs' }
        )
        expect(descendants.map((n) => n.id)).toEqual(['a1'])
    })

    it('空树应返回空数组', () => {
        expect(getDescendants([], () => true)).toEqual([])
    })

    it('null 或 undefined 输入应返回空数组（由 find 处理）', () => {
        expect(getDescendants(null as any, () => true)).toEqual([])
        expect(getDescendants(undefined as any, () => true)).toEqual([])
    })
})
