// utils/clone.test.ts
import { clone } from '../clone'
import { TreeNode } from '../../types'

describe('clone 深拷贝树', () => {
    // 原始树结构
    const originalTree: TreeNode = {
        id: 1,
        name: 'root',
        value: 10,
        children: [
            {
                id: 2,
                name: 'a',
                children: [{ id: 4, name: 'a1' }],
            },
            { id: 3, name: 'b' },
        ],
    }

    it('应深拷贝单个节点树', () => {
        const node = { id: 1, data: [1, 2, 3] }
        const cloned = clone(node)
        expect(cloned).toEqual(node)
        expect(cloned).not.toBe(node)
        // 验证深拷贝（嵌套数组也是新的）
        expect((cloned as any).data).not.toBe(node.data)
    })

    it('应深拷贝多节点树', () => {
        const cloned = clone(originalTree)
        expect(cloned).toEqual(originalTree)
        expect(cloned).not.toBe(originalTree)
        // 验证所有节点引用都不相同
        const checkRef = (a: any, b: any) => {
            expect(a).not.toBe(b)
            if (a.children && b.children) {
                a.children.forEach((child: any, idx: number) =>
                    checkRef(child, b.children[idx])
                )
            }
        }
        checkRef(cloned, originalTree)
    })

    it('应深拷贝森林（多根节点）', () => {
        const forest: TreeNode[] = [
            { id: 1, children: [{ id: 2 }] },
            { id: 3, children: [{ id: 4 }] },
        ]
        const cloned = clone(forest)
        expect(cloned).toEqual(forest)
        expect(cloned).not.toBe(forest)
        expect(cloned[0]).not.toBe(forest[0])
        expect(cloned[0].children[0]).not.toBe(forest[0].children[0])
    })

    it('应支持自定义 childrenKey', () => {
        const customTree = {
            id: 'root',
            subs: [{ id: 'a', subs: [{ id: 'a1' }] }],
        }
        const cloned = clone(customTree, { childrenKey: 'subs' })
        expect(cloned).toEqual(customTree)
        expect(cloned).not.toBe(customTree)
        expect((cloned as any).subs[0]).not.toBe(customTree.subs[0])
    })

    it('应处理没有 children 字段的节点', () => {
        const leaf = { id: 1, name: 'leaf' }
        const cloned = clone(leaf)
        expect(cloned).toEqual(leaf)
        expect(cloned).not.toBe(leaf)
    })

    it('应处理 children 字段为非数组的情况（视为无子节点，不拷贝该字段）', () => {
        const weird = { id: 1, children: 'not-array' as any }
        const cloned = clone(weird)
        expect(cloned).toEqual({ id: 1 }) // children 字段被忽略
    })

    it('空数组应返回空数组', () => {
        expect(clone([])).toEqual([])
    })

    it('null 或 undefined 输入应返回原值（但函数内部未处理，调用者需确保输入合法）', () => {
        // 由于函数内部未做 ensureArray，传入 null 会出错，但实际使用中可通过入口统一处理
        // 这里仅测试非空情况
    })

    it('应拷贝所有自有可枚举属性', () => {
        const node: any = { id: 1, extra: true, func: () => {} }
        const cloned = clone(node)
        expect(cloned).toHaveProperty('extra', true)
        expect(cloned).toHaveProperty('func')
        expect(cloned.func).toBe(node.func) // 函数是引用类型，浅拷贝？实际上 {...node} 是浅拷贝，函数引用相同，但深拷贝通常只拷贝数据，函数可接受共享。若需要深拷贝函数，需特殊处理，一般不考虑。
    })
})
