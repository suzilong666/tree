// query/getSiblings.test.ts
import { getSiblings } from '../getSiblings'
import { TreeNode } from '../../types'

describe('getSiblings 获取兄弟节点', () => {
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
                ],
            },
            { id: 3, name: 'b' },
        ],
    }

    it('应返回目标节点的所有兄弟（不包括自身）', () => {
        const siblings = getSiblings(tree, (node) => node.id === 4)
        expect(siblings.map((n) => n.id)).toEqual([5]) // a1 的兄弟是 a2
    })

    it('目标节点有多个兄弟时返回全部', () => {
        const siblings = getSiblings(tree, (node) => node.id === 2)
        expect(siblings.map((n) => n.id)).toEqual([3]) // a 的兄弟是 b
    })

    it('目标节点是唯一子节点时返回空数组', () => {
        // 创建一个树：根节点只有一个子节点
        const singleChildTree: TreeNode = {
            id: 1,
            children: [{ id: 2 }],
        }
        const siblings = getSiblings(singleChildTree, (node) => node.id === 2)
        expect(siblings).toEqual([])
    })

    it('目标节点是根节点时返回空数组', () => {
        const siblings = getSiblings(tree, (node) => node.id === 1)
        expect(siblings).toEqual([])
    })

    it('目标节点不存在时返回空数组', () => {
        const siblings = getSiblings(tree, (node) => node.id === 999)
        expect(siblings).toEqual([])
    })

    it('应支持森林（多根节点）', () => {
        const forest: TreeNode[] = [
            { id: 1, children: [{ id: 2 }, { id: 3 }] },
            { id: 4, children: [{ id: 5 }] },
        ]
        // 在第一个根节点中查找 id=2 的兄弟
        const siblings = getSiblings(forest, (node) => node.id === 2)
        expect(siblings.map((n) => n.id)).toEqual([3])

        // 根节点之间不视为兄弟
        const rootSiblings = getSiblings(forest, (node) => node.id === 1)
        expect(rootSiblings).toEqual([])
    })

    it('应支持自定义 childrenKey', () => {
        const customTree = {
            id: 'root',
            subs: [
                { id: 'a', subs: [{ id: 'a1' }, { id: 'a2' }] },
                { id: 'b' },
            ],
        }
        const siblings = getSiblings(customTree, (node) => node.id === 'a1', {
            childrenKey: 'subs',
        })
        expect(siblings.map((n) => n.id)).toEqual(['a2'])
    })

    it('应处理父节点的 children 字段为非数组的情况', () => {
        const weirdTree = {
            id: 1,
            children: 'not-an-array' as any,
        }
        // 没有有效子节点，查找任何节点都会失败
        const siblings = getSiblings(weirdTree, (node) => node.id === 1)
        expect(siblings).toEqual([])
    })

    it('空树应返回空数组', () => {
        expect(getSiblings([], () => true)).toEqual([])
    })

    it('null 或 undefined 输入应返回空数组（由 findPath 处理）', () => {
        expect(getSiblings(null as any, () => true)).toEqual([])
        expect(getSiblings(undefined as any, () => true)).toEqual([])
    })
})
