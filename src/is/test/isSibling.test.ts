// relation/isSibling.test.ts
import { isSibling } from '../isSibling'
import { TreeNode } from '../../types'

describe('isSibling 判断兄弟节点', () => {
    // 测试树结构
    const tree: TreeNode = {
        id: 1,
        name: 'root',
        children: [
            { id: 2, name: 'a', children: [{ id: 4, name: 'a1' }] },
            { id: 3, name: 'b' },
        ],
    }

    it('同一父节点下的两个节点应返回 true', () => {
        expect(
            isSibling(
                tree,
                (n) => n.id === 2,
                (n) => n.id === 3
            )
        ).toBe(true)
    })

    it('不同父节点下的节点应返回 false', () => {
        expect(
            isSibling(
                tree,
                (n) => n.id === 4,
                (n) => n.id === 3
            )
        ).toBe(false)
    })

    it('根节点与任何节点都不为兄弟', () => {
        expect(
            isSibling(
                tree,
                (n) => n.id === 1,
                (n) => n.id === 2
            )
        ).toBe(false)
    })

    it('同一节点不应视为兄弟', () => {
        expect(
            isSibling(
                tree,
                (n) => n.id === 2,
                (n) => n.id === 2
            )
        ).toBe(false)
    })

    it('任一节点不存在应返回 false', () => {
        expect(
            isSibling(
                tree,
                (n) => n.id === 2,
                (n) => n.id === 999
            )
        ).toBe(false)
    })

    it('应支持自定义 childrenKey', () => {
        const customTree = {
            id: 'root',
            subs: [{ id: 'a', subs: [{ id: 'a1' }] }, { id: 'b' }],
        }
        expect(
            isSibling(
                customTree,
                (n) => n.id === 'a',
                (n) => n.id === 'b',
                { childrenKey: 'subs' }
            )
        ).toBe(true)
    })

    it('森林中不同根节点下的节点不是兄弟', () => {
        const forest: TreeNode[] = [
            { id: 1, children: [{ id: 2 }] },
            { id: 3, children: [{ id: 4 }] },
        ]
        expect(
            isSibling(
                forest,
                (n) => n.id === 2,
                (n) => n.id === 4
            )
        ).toBe(false)
    })

    it('森林中相同父节点下的节点是兄弟（跨根）', () => {
        const forest: TreeNode[] = [
            { id: 1, children: [{ id: 2 }, { id: 3 }] },
            { id: 4 },
        ]
        expect(
            isSibling(
                forest,
                (n) => n.id === 2,
                (n) => n.id === 3
            )
        ).toBe(true)
    })
})
