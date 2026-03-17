// traverse/forEach.test.ts
import { forEach } from '../forEach'
import { TreeNode } from '../../types'

describe('forEach 遍历树', () => {
    // 测试树结构
    const tree: TreeNode = {
        id: 1,
        name: 'root',
        children: [
            { id: 2, name: 'a', children: [{ id: 4, name: 'a1' }] },
            { id: 3, name: 'b' },
        ],
    }

    it('应对每个节点调用一次 callback（默认 dfs pre）', () => {
        const visited: number[] = []
        forEach(tree, (node) => {
            visited.push(node.id as number)
        })
        expect(visited).toEqual([1, 2, 4, 3])
    })

    it('应支持 dfs post 顺序', () => {
        const visited: number[] = []
        forEach(
            tree,
            (node) => {
                visited.push(node.id as number)
            },
            { strategy: 'dfs', order: 'post' }
        )
        expect(visited).toEqual([4, 2, 3, 1])
    })

    it('应支持 bfs 顺序', () => {
        const visited: number[] = []
        forEach(
            tree,
            (node) => {
                visited.push(node.id as number)
            },
            { strategy: 'bfs' }
        )
        expect(visited).toEqual([1, 2, 3, 4])
    })

    it('应处理森林（多根节点）', () => {
        const forest: TreeNode[] = [
            { id: 1, children: [{ id: 2 }] },
            { id: 3, children: [{ id: 4 }] },
        ]
        const visited: number[] = []
        forEach(forest, (node) => {
            visited.push(node.id as number)
        })
        expect(visited).toEqual([1, 2, 3, 4]) // dfs pre
    })

    it('应支持自定义 childrenKey', () => {
        const customTree = {
            id: 'root',
            subs: [{ id: 'a', subs: [{ id: 'a1' }] }],
        }
        const visited: string[] = []
        forEach(
            customTree,
            (node) => {
                visited.push(node.id)
            },
            { childrenKey: 'subs' }
        )
        expect(visited).toEqual(['root', 'a', 'a1'])
    })

    it('空树不应调用 callback', () => {
        const callback = jest.fn()
        forEach([], callback)
        expect(callback).not.toHaveBeenCalled()
    })

    it('null 或 undefined 输入应视为空数组（由 traverse 处理）', () => {
        const callback = jest.fn()
        forEach(null as any, callback)
        expect(callback).not.toHaveBeenCalled()
    })

    it('callback 应接收上下文参数（depth, parent, path, index）', () => {
        const contexts: any[] = []
        forEach(tree, (node, ctx) => {
            contexts.push({ id: node.id, ...ctx })
        })
        expect(contexts).toEqual([
            { id: 1, depth: 0, parent: null, path: [tree], index: 0 },
            {
                id: 2,
                depth: 1,
                parent: tree,
                path: [tree, tree.children[0]],
                index: 0,
            },
            {
                id: 4,
                depth: 2,
                parent: tree.children[0],
                path: [tree, tree.children[0], tree.children[0].children[0]],
                index: 0,
            },
            {
                id: 3,
                depth: 1,
                parent: tree,
                path: [tree, tree.children[1]],
                index: 1,
            },
        ])
    })
})
