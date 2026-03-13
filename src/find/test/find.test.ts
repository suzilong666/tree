// find.test.ts
import { find } from '../find' // 根据实际路径调整

// 定义测试用的节点类型
interface TestNode {
    id: string
    value?: number
    children?: TestNode[]
    [key: string]: any
}

describe('find 函数', () => {
    // 构建标准测试树
    const tree: TestNode = {
        id: 'A',
        value: 1,
        children: [
            {
                id: 'B',
                value: 2,
                children: [
                    { id: 'D', value: 4 },
                    { id: 'E', value: 5 },
                ],
            },
            {
                id: 'C',
                value: 3,
                children: [{ id: 'F', value: 6 }],
            },
        ],
    }

    // 森林（多个根节点）
    const forest: TestNode[] = [
        { id: 'X', value: 10, children: [{ id: 'X1', value: 11 }] },
        { id: 'Y', value: 20, children: [{ id: 'Y1', value: 21 }] },
    ]

    describe('基本查找功能', () => {
        it('应找到第一个匹配的节点（默认前序）', () => {
            const result = find(tree, (node) => node.value === 5)
            expect(result).not.toBeNull()
            expect(result?.id).toBe('E')
        })

        it('找不到匹配节点时应返回 null', () => {
            const result = find(tree, (node) => node.value === 99)
            expect(result).toBeNull()
        })

        it('应处理单个节点', () => {
            const node: TestNode = { id: 'single', value: 42 }
            const result = find(node, (n) => n.value === 42)
            expect(result).toBe(node)
        })

        it('应处理森林（多个根节点）', () => {
            // 查找森林中 value=21 的节点（在第二个根节点的子树中）
            const result = find(forest, (node) => node.value === 21)
            expect(result?.id).toBe('Y1')
        })
    })

    describe('遍历顺序对结果的影响', () => {
        it('前序应返回第一个遇到的满足条件的节点', () => {
            // 查找 value > 4，前序顺序：A(1), B(2), D(4), E(5) -> 第一个 >4 的是 E
            const result = find(tree, (node) => node.value! > 4, {
                order: 'pre',
            })
            expect(result?.id).toBe('E')
        })

        it('后序应返回第一个在后序遍历中满足条件的节点', () => {
            // 后序顺序：D(4), E(5), B(2), F(6), C(3), A(1)；第一个 >4 的是 E(5)
            const result = find(tree, (node) => node.value! > 4, {
                order: 'post',
            })
            expect(result?.id).toBe('E')
        })

        it('order 参数默认应为 pre', () => {
            // 不传 order，应默认为 pre，与第一个测试一致
            const result = find(tree, (node) => node.value === 5)
            expect(result?.id).toBe('E')
        })
    })

    describe('自定义 childrenKey', () => {
        const customTree = {
            id: 'root',
            subs: [{ id: 'a', subs: [] }, { id: 'b' }],
        }

        it('应使用自定义的子节点字段名', () => {
            const result = find(customTree, (node) => node.id === 'a', {
                childrenKey: 'subs',
            })
            expect(result?.id).toBe('a')
        })

        it('字段不存在时应正常查找', () => {
            const result = find(customTree, (node) => node.id === 'b', {
                childrenKey: 'subs',
            })
            expect(result?.id).toBe('b')
        })
    })

    describe('提前终止', () => {
        it('找到第一个匹配后应停止遍历', () => {
            const spy = jest.fn()
            find(tree, (node) => {
                spy(node.id)
                return node.id === 'D' // 在 D 处匹配
            })
            // 前序顺序：A, B, D 停止，不会继续到 E, C, F
            expect(spy.mock.calls.map((call) => call[0])).toEqual([
                'A',
                'B',
                'D',
            ])
        })

        it('后序中找到后应立即停止', () => {
            const spy = jest.fn()
            find(
                tree,
                (node) => {
                    spy(node.id)
                    return node.id === 'E'
                },
                { order: 'post' }
            )
            // 后序顺序：D, E 停止，不会继续到 B, F, C, A
            expect(spy.mock.calls.map((call) => call[0])).toEqual(['D', 'E'])
        })
    })

    describe('边界情况', () => {
        it('空数组输入应返回 null', () => {
            const result = find([], () => true)
            expect(result).toBeNull()
        })

        it('null 输入应返回 null（假设 ensureArray 转为空数组）', () => {
            const result = find(null as any, () => true)
            expect(result).toBeNull()
        })

        it('undefined 输入应返回 null', () => {
            const result = find(undefined as any, () => true)
            expect(result).toBeNull()
        })

        it('节点没有 children 字段应正常查找', () => {
            const node = { id: 'leaf' }
            const result = find(node, (n) => n.id === 'leaf')
            expect(result).toBe(node)
        })

        it('children 字段不是数组应忽略', () => {
            const node = { id: 'root', children: 'invalid' as any }
            const result = find(node, (n) => n.id === 'root')
            expect(result).toBe(node)
        })

        it('children 为 null 应忽略', () => {
            const node = { id: 'root', children: null }
            const result = find(node, (n) => n.id === 'root')
            expect(result).toBe(node)
        })
    })

    describe('回调函数行为', () => {
        it('回调函数应接收节点作为参数', () => {
            const mockCallback = jest.fn()
            find(tree, mockCallback)
            expect(mockCallback).toHaveBeenCalled()
            const firstArg = mockCallback.mock.calls[0][0]
            expect(firstArg).toHaveProperty('id')
        })

        it('只有当回调返回 true 时才视为匹配', () => {
            // 返回 undefined 或 false 不应匹配
            let count = 0
            const result = find(tree, (node) => {
                count++
                if (node.id === 'A') return false
                if (node.id === 'B') return undefined
                if (node.id === 'C') return true // 只有 C 返回 true
                return false
            })
            expect(result?.id).toBe('C')
            // 确保遍历到 C 就停止（前序 A,B,C 停止）
            expect(count).toBe(5)
        })
    })
})
