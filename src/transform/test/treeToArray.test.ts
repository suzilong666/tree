// transform/treeToArray.test.ts
import { treeToArray } from '../treeToArray'
import { arrayToTree } from '../arrayToTree'
import { TreeNode } from '../../types'

describe('treeToArray 将树转换为扁平数组', () => {
    // 测试树结构（使用 id 标识节点）
    const tree: TreeNode = {
        id: 1,
        name: 'root',
        children: [
            {
                id: 2,
                name: 'a',
                children: [{ id: 4, name: 'a1' }],
            },
            { id: 3, name: 'b' },
        ],
    }

    describe('基本转换', () => {
        it('应正确转换单节点树', () => {
            const node = { id: 1, name: 'single' }
            const result = treeToArray(node)
            expect(result).toEqual([{ id: 1, name: 'single', parentId: null }])
        })

        it('应正确转换多节点树（默认选项）', () => {
            const result = treeToArray(tree)
            expect(result).toEqual([
                { id: 1, name: 'root', parentId: null },
                { id: 2, name: 'a', parentId: 1 },
                { id: 4, name: 'a1', parentId: 2 },
                { id: 3, name: 'b', parentId: 1 },
            ])
        })

        it('应处理森林（多根节点）', () => {
            const forest: TreeNode[] = [
                { id: 1, name: 'r1', children: [{ id: 2, name: 'c1' }] },
                { id: 3, name: 'r2' },
            ]
            const result = treeToArray(forest)
            expect(result).toEqual([
                { id: 1, name: 'r1', parentId: null },
                { id: 2, name: 'c1', parentId: 1 },
                { id: 3, name: 'r2', parentId: null },
            ])
        })

        it('空数组应返回空数组', () => {
            expect(treeToArray([])).toEqual([])
        })
    })

    describe('选项测试', () => {
        it('应支持自定义字段名（idKey, parentIdKey, childrenKey）', () => {
            const customTree = {
                uuid: 'root',
                title: 'Root',
                subs: [
                    {
                        uuid: 'a',
                        title: 'A',
                        subs: [{ uuid: 'a1', title: 'A1' }],
                    },
                ],
            }
            const result = treeToArray(customTree, {
                idKey: 'uuid',
                parentIdKey: 'pid',
                childrenKey: 'subs',
                rootParentValue: 0,
            })
            expect(result).toEqual([
                { uuid: 'root', title: 'Root', pid: 0 },
                { uuid: 'a', title: 'A', pid: 'root' },
                { uuid: 'a1', title: 'A1', pid: 'a' },
            ])
        })

        it('应支持 keepChildren: true 保留 children 字段', () => {
            const result = treeToArray(tree, { keepChildren: true })
            expect(result[0]).toHaveProperty('children')
            expect(Array.isArray(result[0].children)).toBe(true)
            expect(result[1]).toHaveProperty('children')
            // expect(result[2]).toHaveProperty('children') // a1 的 children 应为空数组
        })

        it('应支持自定义 rootParentValue', () => {
            const treeWithZeroParent = {
                id: 1,
                name: 'root',
                children: [{ id: 2, name: 'child' }],
            }
            const result = treeToArray(treeWithZeroParent, {
                rootParentValue: 0,
            })
            expect(result[0].parentId).toBe(0)
            expect(result[1].parentId).toBe(1)
        })

        it('应支持不同的遍历策略和顺序', () => {
            // dfs pre 顺序（默认）
            const dfsPre = treeToArray(tree, { strategy: 'dfs', order: 'pre' })
            expect(dfsPre.map((item) => item.id)).toEqual([1, 2, 4, 3])

            // dfs post 顺序
            const dfsPost = treeToArray(tree, {
                strategy: 'dfs',
                order: 'post',
            })
            expect(dfsPost.map((item) => item.id)).toEqual([4, 2, 3, 1])

            // bfs 顺序
            const bfs = treeToArray(tree, { strategy: 'bfs' })
            expect(bfs.map((item) => item.id)).toEqual([1, 2, 3, 4])
        })

        it('默认策略应为 dfs 前序', () => {
            const result = treeToArray(tree)
            expect(result.map((item) => item.id)).toEqual([1, 2, 4, 3])
        })
    })

    // describe('与 arrayToTree 互为逆操作', () => {
    //     it('先 treeToArray 再 arrayToTree 应恢复原树（忽略 children 顺序）', () => {
    //         const arr = treeToArray(tree)
    //         const newTree = arrayToTree(arr)

    //         // 辅助函数：按 id 排序子节点以便比较
    //         const normalize = (t: TreeNode): any => {
    //             if (!t) return t
    //             const copy: any = { id: t.id, name: t.name }
    //             if (t.children) {
    //                 copy.children = [...t.children]
    //                     .map(normalize)
    //                     .sort((a, b) => a.id - b.id)
    //             }
    //             return copy
    //         }
    //         console.log(normalize(newTree[0]))
    //         console.log(normalize(tree))
    //         expect(normalize(newTree[0])).toEqual(normalize(tree))
    //     })

    //     it('使用自定义字段名时也能互为逆操作', () => {
    //         const customTree = {
    //             uuid: 'root',
    //             title: 'Root',
    //             subs: [
    //                 {
    //                     uuid: 'a',
    //                     title: 'A',
    //                     subs: [{ uuid: 'a1', title: 'A1' }],
    //                 },
    //             ],
    //         }
    //         const options = {
    //             idKey: 'uuid',
    //             parentIdKey: 'pid',
    //             childrenKey: 'subs',
    //             rootParentValue: null,
    //         }
    //         const arr = treeToArray(customTree, options)
    //         const newTree = arrayToTree(arr, options)
    //         expect(newTree[0]).toEqual({
    //             uuid: 'root',
    //             title: 'Root',
    //             pid: null,
    //             subs: [
    //                 {
    //                     uuid: 'a',
    //                     title: 'A',
    //                     pid: 'root',
    //                     subs: [{ uuid: 'a1', title: 'A1', pid: 'a', subs: [] }],
    //                 },
    //             ],
    //         })
    //     })
    // })

    describe('边界情况', () => {
        it('应处理节点没有 id 的情况（但会保留 undefined 作为 id）', () => {
            const node = { name: 'no-id' }
            const result = treeToArray(node)
            expect(result).toEqual([
                { name: 'no-id', parentId: null, id: undefined },
            ])
        })

        it('应处理父节点 id 为 null 的情况（根节点）', () => {
            const node = { id: 1, name: 'root' }
            const result = treeToArray(node)
            expect(result[0].parentId).toBeNull()
        })

        it('应处理节点有 children 但 keepChildren 为 false 时删除 children', () => {
            const result = treeToArray(tree, { keepChildren: false })
            expect(result[0]).not.toHaveProperty('children')
            expect(result[1]).not.toHaveProperty('children')
        })

        it('应处理节点有额外属性并保留', () => {
            const nodeWithExtra = {
                id: 1,
                name: 'root',
                extra: true,
                children: [{ id: 2, extra2: 'child' }],
            }
            const result = treeToArray(nodeWithExtra)
            expect(result[0]).toHaveProperty('extra', true)
            expect(result[1]).toHaveProperty('extra2', 'child')
        })
    })
})
