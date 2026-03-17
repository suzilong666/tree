// query/some.test.ts
import { some } from '../some'
import { TreeNode } from '../../types'

describe('some 判断是否存在满足条件的节点', () => {
    const tree: TreeNode = {
        id: 1,
        value: 10,
        children: [
            { id: 2, value: 20, children: [{ id: 4, value: 40 }] },
            { id: 3, value: 30 },
        ],
    }

    it('存在满足条件的节点时返回 true', () => {
        const result = some(tree, (node) => node.value === 30)
        expect(result).toBe(true)
    })

    it('不存在满足条件的节点时返回 false', () => {
        const result = some(tree, (node) => node.value === 100)
        expect(result).toBe(false)
    })

    it('空树应返回 false', () => {
        expect(some([], () => true)).toBe(false)
    })

    it('森林中存在满足条件的节点返回 true', () => {
        const forest: TreeNode[] = [
            { id: 1, value: 5 },
            { id: 2, value: 15 },
        ]
        expect(some(forest, (node) => node.value > 10)).toBe(true)
    })

    it('支持 dfs 和 bfs 策略', () => {
        // 构造一棵树，使 dfs 和 bfs 查找顺序不同，但结果不影响
        const testTree = {
            id: 1,
            children: [{ id: 2, children: [{ id: 4 }] }, { id: 3 }],
        }
        // 两个策略都应找到
        expect(
            some(testTree, (node) => node.id === 4, { strategy: 'dfs' })
        ).toBe(true)
        expect(
            some(testTree, (node) => node.id === 4, { strategy: 'bfs' })
        ).toBe(true)
    })

    it('支持自定义 childrenKey', () => {
        const customTree = {
            id: 'root',
            subs: [{ id: 'a', subs: [{ id: 'a1' }] }],
        }
        expect(
            some(customTree, (node) => node.id === 'a1', {
                childrenKey: 'subs',
            })
        ).toBe(true)
    })

    it('找到第一个满足条件后停止遍历（不会继续检查其他节点）', () => {
        const visited: any[] = []
        some(tree, (node) => {
            visited.push(node.id)
            return node.id === 2
        })
        // dfs pre 顺序：1,2 找到后停止，不会继续到 4,3
        expect(visited).toEqual([1, 2])
    })
})
