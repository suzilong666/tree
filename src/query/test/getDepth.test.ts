// query/getDepth.test.ts
import { getDepth } from '../getDepth'
import { TreeNode } from '../../types'

describe('getDepth 计算树的最大深度', () => {
    it('单节点树深度应为 0', () => {
        const tree: TreeNode = { id: 1 }
        expect(getDepth(tree)).toBe(0)
    })

    it('两层树深度应为 1', () => {
        const tree: TreeNode = {
            id: 1,
            children: [{ id: 2 }],
        }
        expect(getDepth(tree)).toBe(1)
    })

    it('多层树深度正确', () => {
        const tree: TreeNode = {
            id: 1,
            children: [
                {
                    id: 2,
                    children: [{ id: 4, children: [{ id: 5 }] }],
                },
                { id: 3 },
            ],
        }
        // 路径: 1->2->4->5 深度为 3
        expect(getDepth(tree)).toBe(3)
    })

    it('森林取所有根节点中的最大深度', () => {
        const forest: TreeNode[] = [
            { id: 1, children: [{ id: 2 }] }, // 深度 1
            { id: 3, children: [{ id: 4, children: [{ id: 5 }] }] }, // 深度 2
        ]
        expect(getDepth(forest)).toBe(2)
    })

    it('空数组应返回 0', () => {
        expect(getDepth([])).toBe(0)
    })

    it('null 或 undefined 输入应视为空数组（由 ensureArray 处理）', () => {
        expect(getDepth(null as any)).toBe(0)
        expect(getDepth(undefined as any)).toBe(0)
    })

    it('应支持自定义 childrenKey', () => {
        const tree = {
            id: 'root',
            subs: [{ id: 'a', subs: [{ id: 'a1' }] }, { id: 'b' }],
        }
        expect(getDepth(tree, { childrenKey: 'subs' })).toBe(2) // root->a->a1
    })

    it('应忽略非数组的 children 字段', () => {
        const tree = {
            id: 1,
            children: 'not-an-array' as any,
        }
        expect(getDepth(tree)).toBe(0)
    })

    it('应处理深度很大的树（不崩溃）', () => {
        const deepChain = (depth: number): TreeNode => {
            if (depth === 0) return { id: 0 }
            return { id: depth, children: [deepChain(depth - 1)] }
        }
        const tree = deepChain(1000)
        expect(getDepth(tree)).toBe(1000)
    })
})
