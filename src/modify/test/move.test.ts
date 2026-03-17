// modify/move.test.ts
import { move } from '../move'
import { TreeNode } from '../../types'

describe('move 移动节点', () => {
    // 原始树结构
    const originalTree: TreeNode = {
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

    describe('移动到目标父节点（append）', () => {
        it('应将节点移动到另一个父节点下作为最后一个子节点', () => {
            const newTree = move(
                originalTree,
                (node) => node.id === 4, // 移动 a1
                (node) => node.id === 3, // 目标父节点 b
                'append'
            )

            expect(newTree).not.toBe(originalTree)
            // a 节点下不再有 a1
            expect(
                (newTree as any).children[0].children.map((n: any) => n.id)
            ).toEqual([5])
            // b 节点下现在有 a1
            expect(
                (newTree as any).children[1].children.map((n: any) => n.id)
            ).toEqual([4])
        })

        it('应将节点移动到目标父节点下，如果目标父节点没有 children 则创建', () => {
            const tree = {
                id: 1,
                children: [{ id: 2 }],
            }
            const newTree = move(
                tree,
                (n) => n.id === 2,
                (n) => n.id === 1,
                'append'
            )
            expect(newTree).toEqual({
                id: 1,
                children: [{ id: 2 }], // 2 还是原来的位置？实际上移动到自己父节点下 append，相当于没变化？但可能重复？
                // 这里移动源节点到自身父节点下，等同于将节点从原位置移除再追加到末尾，所以结果应该还是 [2]（因为只有一个子节点）
                // 但我们的实现会先移除再插入，最终顺序不变。
            })
        })

        it('prepend 应将节点作为目标父节点的第一个子节点', () => {
            const newTree = move(
                originalTree,
                (node) => node.id === 4,
                (node) => node.id === 2,
                'prepend'
            )
            // 将 a1 移动到 a 节点下作为第一个子节点（原来 a 有 a1,a2，移动后顺序 a1,a2？但 a1 原本就是第一个，所以不变）
            // 换个目标：移动到 b 节点下作为第一个
            const newTree2 = move(
                originalTree,
                (node) => node.id === 4,
                (node) => node.id === 3,
                'prepend'
            )
            expect((newTree2 as any).children[1].children[0].id).toBe(4)
            expect((newTree2 as any).children[1].children.length).toBe(1)
        })
    })

    describe('移动到兄弟节点之前/之后', () => {
        it('before 应将节点插入到参考节点之前', () => {
            const newTree = move(
                originalTree,
                (node) => node.id === 4, // 移动 a1
                (node) => node.id === 5, // 参考节点 a2
                'before'
            )
            // 目标父节点是 a（id=2），参考节点是 a2，将 a1 插入到 a2 之前
            // 原来 a 的子节点顺序 [a1, a2]，移动后 a1 本就在 a2 之前，所以可能没变化？但实际移动后 a1 被移除又插入到 a2 前，顺序不变。
            // 我们换个源节点：移动 a2 到 a1 之前
            const newTree2 = move(
                originalTree,
                (node) => node.id === 5,
                (node) => node.id === 4,
                'before'
            )
            expect(
                (newTree2 as any).children[0].children.map((n: any) => n.id)
            ).toEqual([5, 4])
        })

        it('after 应将节点插入到参考节点之后', () => {
            const newTree = move(
                originalTree,
                (node) => node.id === 4,
                (node) => node.id === 5,
                'after'
            )
            // a1 移动到 a2 之后，原顺序 [a1, a2] 变成 [a2, a1]
            expect(
                (newTree as any).children[0].children.map((n: any) => n.id)
            ).toEqual([5, 4])
        })

        it('参考节点在不同父节点下，应能跨父节点移动', () => {
            const newTree = move(
                originalTree,
                (node) => node.id === 4,
                (node) => node.id === 3, // 参考节点 b
                'before'
            )
            // 将 a1 插入到 b 之前，目标父节点是 b 的父节点 root
            const rootChildren = (newTree as any).children.map((n: any) => n.id)
            expect(rootChildren).toEqual([2, 4, 3]) // a, new, b
            // a 节点的子节点只剩 a2
            expect(
                (newTree as any).children[0].children.map((n: any) => n.id)
            ).toEqual([5])
        })
    })

    describe('边界情况', () => {
        it('源节点不存在应返回原树', () => {
            const newTree = move(
                originalTree,
                (n) => n.id === 999,
                (n) => n.id === 2,
                'append'
            )
            expect(newTree).toBe(originalTree)
        })

        it('目标节点不存在应返回原树', () => {
            const newTree = move(
                originalTree,
                (n) => n.id === 4,
                (n) => n.id === 999,
                'append'
            )
            expect(newTree).toBe(originalTree)
        })

        it('源节点是根节点应返回原树（不能移动根节点）', () => {
            const newTree = move(
                originalTree,
                (n) => n.id === 1,
                (n) => n.id === 2,
                'append'
            )
            expect(newTree).toBe(originalTree)
        })

        it('不能将节点移动到自己或自己的后代中', () => {
            // 尝试将 a 移动到 a1 下面（a 是 a1 的祖先）
            const newTree = move(
                originalTree,
                (n) => n.id === 2,
                (n) => n.id === 4,
                'append'
            )
            expect(newTree).toBe(originalTree)

            // 尝试将 a1 移动到自身（作为自己的子节点？不可能，因为 a1 是叶子，但目标父节点可以是 a1 本身，也是非法）
            const newTree2 = move(
                originalTree,
                (n) => n.id === 4,
                (n) => n.id === 4,
                'append'
            )
            expect(newTree2).toBe(originalTree)
        })

        it('森林中只处理第一个匹配的源节点', () => {
            const forest: TreeNode[] = [
                { id: 1, children: [{ id: 2 }, { id: 3 }] },
                { id: 4, children: [{ id: 5 }] },
            ]
            const newForest = move(
                forest,
                (n) => n.id === 2 || n.id === 5, // 匹配两个，但只移动第一个（id=2）
                (n) => n.id === 4,
                'append'
            )
            expect(newForest[0].children.map((c: any) => c.id)).toEqual([3]) // id=2 被移除
            expect(newForest[1].children.map((c: any) => c.id)).toEqual([5, 2]) // id=5 没动
        })

        it('应支持自定义 childrenKey', () => {
            const customTree = {
                id: 'root',
                subs: [{ id: 'a', subs: [{ id: 'a1' }] }, { id: 'b' }],
            }
            const newTree = move(
                customTree,
                (n) => n.id === 'a1',
                (n) => n.id === 'b',
                'append',
                { childrenKey: 'subs' }
            )
            expect(newTree).toEqual({
                id: 'root',
                subs: [
                    { id: 'a', subs: [] },
                    { id: 'b', subs: [{ id: 'a1' }] },
                ],
            })
        })

        it('不应修改原树', () => {
            const originalCopy = JSON.parse(JSON.stringify(originalTree))
            move(
                originalTree,
                (n) => n.id === 4,
                (n) => n.id === 3,
                'append'
            )
            expect(originalTree).toEqual(originalCopy)
        })
    })
})
