// query/every.test.ts
import { every } from '../every'
import { TreeNode } from '../../types'

describe('every 判断是否所有节点都满足条件', () => {
    // 测试树结构
    const tree: TreeNode = {
        id: 1,
        value: 10,
        children: [
            { id: 2, value: 20, children: [{ id: 4, value: 40 }] },
            { id: 3, value: 30 },
        ],
    }

    it('所有节点都满足条件时应返回 true', () => {
        const result = every(tree, (node) => (node.value as number) >= 10)
        expect(result).toBe(true)
    })

    it('存在一个节点不满足条件时应返回 false', () => {
        const result = every(tree, (node) => (node.value as number) !== 20)
        expect(result).toBe(false) // id=2 的 value 为 20
    })

    it('空树应返回 true', () => {
        expect(every([], () => true)).toBe(true)
        expect(every([], () => false)).toBe(true) // 空树所有条件都成立
    })

    it('森林中所有节点满足应返回 true', () => {
        const forest: TreeNode[] = [
            { id: 1, value: 5 },
            { id: 2, value: 8, children: [{ id: 3, value: 3 }] },
        ]
        expect(every(forest, (node) => (node.value as number) > 0)).toBe(true)
    })

    it('森林中存在不满足节点应返回 false', () => {
        const forest: TreeNode[] = [
            { id: 1, value: 5 },
            { id: 2, value: -1 },
        ]
        expect(every(forest, (node) => (node.value as number) > 0)).toBe(false)
    })

    it('应支持自定义 childrenKey', () => {
        const customTree = {
            id: 'root',
            subs: [{ id: 'a', subs: [{ id: 'a1' }] }],
        }
        expect(
            every(customTree, (node) => node.id !== 'a', {
                childrenKey: 'subs',
            })
        ).toBe(false)
        expect(
            every(customTree, (node) => node.id.length > 0, {
                childrenKey: 'subs',
            })
        ).toBe(true)
    })

    it('应支持不同的遍历策略（dfs/bfs）', () => {
        // 策略不影响结果
        expect(every(tree, (node) => node.id > 0, { strategy: 'dfs' })).toBe(
            true
        )
        expect(every(tree, (node) => node.id > 0, { strategy: 'bfs' })).toBe(
            true
        )
    })

    it('应支持 dfs 的遍历顺序（pre/post）', () => {
        // 顺序不影响结果
        expect(
            every(tree, (node) => node.id > 0, {
                strategy: 'dfs',
                order: 'pre',
            })
        ).toBe(true)
        expect(
            every(tree, (node) => node.id > 0, {
                strategy: 'dfs',
                order: 'post',
            })
        ).toBe(true)
    })

    it('遇到不满足条件时应立即停止遍历', () => {
        const visited: any[] = []
        every(tree, (node) => {
            visited.push(node.id)
            return node.id !== 2 // id=2 时不满足
        })
        // 默认 dfs pre 顺序：1,2，遇到 2 不满足即停止，不会继续到 4,3
        expect(visited).toEqual([1, 2])
    })

    it('应处理节点为 null/undefined 的情况（视为空树，返回 true）', () => {
        // 假设底层 traverse 能处理 null/undefined 输入（返回空数组）
        expect(every(null as any, () => false)).toBe(true)
        expect(every(undefined as any, () => false)).toBe(true)
    })

    it('应忽略非数组的 children 字段', () => {
        const weirdTree = {
            id: 1,
            children: 'not-array' as any,
        }
        expect(every(weirdTree, (node) => node.id === 1)).toBe(true)
        expect(every(weirdTree, (node) => node.id === 999)).toBe(false)
    })
})
