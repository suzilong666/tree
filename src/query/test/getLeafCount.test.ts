// query/getLeafCount.test.ts
import { getLeafCount } from '../getLeafCount'
import { TreeNode } from '../../types'

describe('getLeafCount 计算叶子节点数量', () => {
    it('单节点树应返回 1（根节点自身是叶子）', () => {
        const tree: TreeNode = { id: 1 }
        expect(getLeafCount(tree)).toBe(1)
    })

    it('两层树，根节点有子节点，叶子为所有子节点', () => {
        const tree: TreeNode = {
            id: 1,
            children: [{ id: 2 }, { id: 3 }],
        }
        expect(getLeafCount(tree)).toBe(2)
    })

    it('多层树应正确计数叶子', () => {
        const tree: TreeNode = {
            id: 1,
            children: [
                {
                    id: 2,
                    children: [
                        { id: 4 }, // 叶子
                        { id: 5, children: [{ id: 6 }] }, // 6 是叶子，5 不是
                    ],
                },
                { id: 3 }, // 叶子
            ],
        }
        // 叶子节点：4,6,3 共 3 个
        expect(getLeafCount(tree)).toBe(3)
    })

    it('森林应累加所有树的叶子数', () => {
        const forest: TreeNode[] = [
            { id: 1, children: [{ id: 2 }] }, // 2 是叶子，1 不是
            { id: 3, children: [{ id: 4 }, { id: 5 }] }, // 4,5 是叶子，3 不是
        ]
        expect(getLeafCount(forest)).toBe(3) // 2,4,5
    })

    it('空数组应返回 0', () => {
        expect(getLeafCount([])).toBe(0)
    })

    it('null 或 undefined 输入应视为空数组（由 ensureArray 处理）', () => {
        expect(getLeafCount(null as any)).toBe(0)
        expect(getLeafCount(undefined as any)).toBe(0)
    })

    it('应支持自定义 childrenKey', () => {
        const tree = {
            id: 'root',
            subs: [
                { id: 'a', subs: [{ id: 'a1' }] }, // a1 是叶子，a 不是
                { id: 'b' }, // b 是叶子
            ],
        }
        expect(getLeafCount(tree, { childrenKey: 'subs' })).toBe(2) // a1, b
    })

    it('应处理 children 字段为非数组的情况（视为叶子）', () => {
        const tree = {
            id: 1,
            children: 'not-an-array' as any,
            subs: [{ id: 2 }], // 不会被当作子节点
        }
        expect(getLeafCount(tree)).toBe(1) // 1 被当作叶子
    })

    it('应处理 children 字段为空数组的情况（视为叶子）', () => {
        const tree = {
            id: 1,
            children: [], // 空数组，没有子节点，所以是叶子
        }
        expect(getLeafCount(tree)).toBe(1)
    })

    it('应处理深度很大的树（不崩溃）', () => {
        const deepChain = (depth: number): TreeNode => {
            if (depth === 0) return { id: 0 }
            return { id: depth, children: [deepChain(depth - 1)] }
        }
        const tree = deepChain(1000)
        // 链式树只有一个叶子（最深层节点）
        expect(getLeafCount(tree)).toBe(1)
    })
})
