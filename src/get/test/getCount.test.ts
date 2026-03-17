// query/getCount.test.ts
import { getCount } from '../getCount'
import { TreeNode } from '../../types'

describe('getCount 计算节点总数', () => {
    it('单节点树应返回 1', () => {
        const tree: TreeNode = { id: 1 }
        expect(getCount(tree)).toBe(1)
    })

    it('两层树应返回节点总数', () => {
        const tree: TreeNode = {
            id: 1,
            children: [{ id: 2 }, { id: 3 }],
        }
        expect(getCount(tree)).toBe(3)
    })

    it('多层树应正确计数', () => {
        const tree: TreeNode = {
            id: 1,
            children: [
                {
                    id: 2,
                    children: [{ id: 4 }, { id: 5, children: [{ id: 6 }] }],
                },
                { id: 3 },
            ],
        }
        // 节点：1,2,4,5,6,3 共 6 个
        expect(getCount(tree)).toBe(6)
    })

    it('森林应累加所有节点', () => {
        const forest: TreeNode[] = [
            { id: 1, children: [{ id: 2 }] },
            { id: 3, children: [{ id: 4 }, { id: 5 }] },
        ]
        // 节点：1,2,3,4,5 共 5 个
        expect(getCount(forest)).toBe(5)
    })

    it('空数组应返回 0', () => {
        expect(getCount([])).toBe(0)
    })

    it('null 或 undefined 输入应视为空数组（由 ensureArray 处理）', () => {
        expect(getCount(null as any)).toBe(0)
        expect(getCount(undefined as any)).toBe(0)
    })

    it('应支持自定义 childrenKey', () => {
        const tree = {
            id: 'root',
            subs: [{ id: 'a', subs: [{ id: 'a1' }] }, { id: 'b' }],
        }
        expect(getCount(tree, { childrenKey: 'subs' })).toBe(4) // root, a, a1, b
    })

    it('应忽略非数组的 children 字段', () => {
        const tree = {
            id: 1,
            children: 'not-an-array' as any,
            extra: { id: 2 }, // 不会被当作子节点
        }
        expect(getCount(tree)).toBe(1)
    })

    it('应处理深度很大的树（不崩溃）', () => {
        const deepChain = (depth: number): TreeNode => {
            if (depth === 0) return { id: 0 }
            return { id: depth, children: [deepChain(depth - 1)] }
        }
        const tree = deepChain(1000)
        expect(getCount(tree)).toBe(1001) // 节点数 = 深度 + 1
    })
})
