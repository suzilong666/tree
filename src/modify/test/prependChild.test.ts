// modify/prependChild.test.ts
import { prependChild } from '../prependChild'
import { TreeNode } from '../../types'

describe('prependChild 前插子节点', () => {
    // 原始树结构
    const originalTree: TreeNode = {
        id: 1,
        name: 'root',
        children: [
            { id: 2, name: 'a', children: [{ id: 4, name: 'a1' }] },
            { id: 3, name: 'b' },
        ],
    }

    it('应向指定父节点前插新节点作为第一个子节点', () => {
        const newNode = { id: 5, name: 'new' }
        const newTree = prependChild(
            originalTree,
            (node) => node.id === 2,
            newNode
        )

        expect(newTree).not.toBe(originalTree) // 返回新树
        expect((newTree as any).children[0].children).toEqual([
            { id: 5, name: 'new' },
            { id: 4, name: 'a1' },
        ])
        // 验证原树未被修改
        expect(originalTree.children[0].children).toEqual([
            { id: 4, name: 'a1' },
        ])
    })

    it('父节点没有 children 字段时应创建 children 数组并插入', () => {
        const nodeWithoutChildren: TreeNode = { id: 10, name: 'leaf' }
        const newNode = { id: 11, name: 'child' }
        const newTree = prependChild(
            nodeWithoutChildren,
            (node) => node.id === 10,
            newNode
        )

        expect(newTree).toEqual({
            id: 10,
            name: 'leaf',
            children: [{ id: 11, name: 'child' }],
        })
    })

    it('父节点的 children 字段为非数组时应替换为数组', () => {
        const weirdNode: any = { id: 20, name: 'weird', children: 'not-array' }
        const newNode = { id: 21, name: 'child' }
        const newTree = prependChild(
            weirdNode,
            (node) => node.id === 20,
            newNode
        )

        expect(newTree).toEqual({
            id: 20,
            name: 'weird',
            children: [{ id: 21, name: 'child' }],
        })
    })

    it('根节点作为父节点时工作正常', () => {
        const newNode = { id: 6, name: 'newRootChild' }
        const newTree = prependChild(
            originalTree,
            (node) => node.id === 1,
            newNode
        )

        expect((newTree as any).children).toEqual([
            { id: 6, name: 'newRootChild' },
            { id: 2, name: 'a', children: [{ id: 4, name: 'a1' }] },
            { id: 3, name: 'b' },
        ])
    })

    it('森林中只修改第一个匹配的父节点', () => {
        const forest: TreeNode[] = [
            { id: 1, children: [{ id: 2 }] },
            { id: 3, children: [{ id: 4 }] },
        ]
        const newNode = { id: 5 }
        const newForest = prependChild(
            forest,
            (node) => node.id === 1 || node.id === 3,
            newNode
        )

        expect(newForest).not.toBe(forest)
        expect(newForest[0].children).toEqual([{ id: 5 }, { id: 2 }]) // 第一个匹配被修改
        expect(newForest[1].children).toEqual([{ id: 4 }]) // 第二个匹配未被修改（只改第一个）
    })

    it('未找到父节点时应返回原树（引用不变）', () => {
        const newTree = prependChild(originalTree, (node) => node.id === 999, {
            id: 99,
        })
        expect(newTree).toBe(originalTree) // 同一引用
    })

    it('应支持自定义 childrenKey', () => {
        const customTree = {
            id: 'root',
            subs: [{ id: 'a' }],
        }
        const newNode = { id: 'b' }
        const newTree = prependChild(
            customTree,
            (node) => node.id === 'root',
            newNode,
            { childrenKey: 'subs' }
        )
        expect(newTree).toEqual({
            id: 'root',
            subs: [{ id: 'b' }, { id: 'a' }],
        })
    })

    it('新节点引用应保持不变（浅拷贝）', () => {
        const newNode = { id: 7, data: { x: 1 } }
        const newTree = prependChild(
            originalTree,
            (node) => node.id === 2,
            newNode
        )
        const inserted = (newTree as any).children[0].children[0]
        expect(inserted).toBe(newNode) // 引用相同
    })

    it('空树应返回空数组', () => {
        const newNode = { id: 1 }
        expect(prependChild([], () => true, newNode)).toEqual([])
    })

    it('不应修改原树任何节点', () => {
        const originalCopy = JSON.parse(JSON.stringify(originalTree))
        prependChild(originalTree, (node) => node.id === 2, { id: 5 })
        expect(originalTree).toEqual(originalCopy)
    })
})
