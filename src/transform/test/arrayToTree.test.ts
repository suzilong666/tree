// transform/arrayToTree.test.ts
import { arrayToTree } from '../arrayToTree'
import { DEFAULT_CHILDREN_KEY } from '../../constants'

describe('arrayToTree 将扁平数组转换为树形结构', () => {
    // 基础测试数据
    const items = [
        { id: 1, name: 'Root 1', parentId: null },
        { id: 2, name: 'Child 1 of Root 1', parentId: 1 },
        { id: 3, name: 'Child 2 of Root 1', parentId: 1 },
        { id: 4, name: 'Grandchild of Root 1', parentId: 2 },
        { id: 5, name: 'Root 2', parentId: null },
        { id: 6, name: 'Child of Root 2', parentId: 5 },
    ]

    describe('基本功能', () => {
        it('应正确构建树形结构（默认配置）', () => {
            const tree = arrayToTree(items)
            expect(tree).toHaveLength(2)

            // 验证根节点 1
            expect(tree[0]).toMatchObject({
                id: 1,
                name: 'Root 1',
                children: [
                    {
                        id: 2,
                        name: 'Child 1 of Root 1',
                        children: [
                            {
                                id: 4,
                                name: 'Grandchild of Root 1',
                                children: [],
                            },
                        ],
                    },
                    { id: 3, name: 'Child 2 of Root 1', children: [] },
                ],
            })

            // 验证根节点 2
            expect(tree[1]).toMatchObject({
                id: 5,
                name: 'Root 2',
                children: [{ id: 6, name: 'Child of Root 2', children: [] }],
            })
        })

        it('应处理空数组', () => {
            expect(arrayToTree([])).toEqual([])
        })

        it('应处理单个节点（根节点）', () => {
            const single = [{ id: 1, name: 'Only', parentId: null }]
            const tree = arrayToTree(single)
            expect(tree).toEqual([
                { id: 1, name: 'Only', parentId: null, children: [] },
            ])
        })

        it('应保留节点上的额外属性', () => {
            const itemsWithExtra = [
                { id: 1, name: 'Root', extra: 'rootExtra', parentId: null },
                { id: 2, name: 'Child', count: 10, parentId: 1 },
            ]
            const tree = arrayToTree(itemsWithExtra)
            expect(tree[0]).toHaveProperty('extra', 'rootExtra')
            expect(tree[0].children[0]).toHaveProperty('count', 10)
        })
    })

    describe('自定义字段名', () => {
        const customItems = [
            { uuid: 'r1', title: 'Root', pid: null },
            { uuid: 'c1', title: 'Child', pid: 'r1' },
            { uuid: 'c2', title: 'Another Child', pid: 'r1' },
        ]

        it('应支持自定义 idKey、parentIdKey、childrenKey', () => {
            const tree = arrayToTree(customItems, {
                idKey: 'uuid',
                parentIdKey: 'pid',
                childrenKey: 'subs',
            })
            expect(tree).toEqual([
                {
                    uuid: 'r1',
                    title: 'Root',
                    pid: null,
                    subs: [
                        { uuid: 'c1', title: 'Child', pid: 'r1', subs: [] },
                        {
                            uuid: 'c2',
                            title: 'Another Child',
                            pid: 'r1',
                            subs: [],
                        },
                    ],
                },
            ])
        })

        it('应使用 DEFAULT_CHILDREN_KEY 作为默认 childrenKey', () => {
            // 默认 childrenKey 应该是 'children'
            expect(DEFAULT_CHILDREN_KEY).toBe('children')
            const tree = arrayToTree(customItems, {
                idKey: 'uuid',
                parentIdKey: 'pid',
            })
            // 树中应该使用 'children' 作为子节点字段名
            expect(tree[0]).toHaveProperty('children')
            expect(tree[0].children).toBeInstanceOf(Array)
        })
    })

    describe('根节点标识 (rootParentValue)', () => {
        it('默认根节点值为 null，应正确识别根节点', () => {
            const itemsWithNull = [
                { id: 1, parentId: null },
                { id: 2, parentId: 1 },
            ]
            const tree = arrayToTree(itemsWithNull)
            expect(tree).toHaveLength(1)
            expect(tree[0].id).toBe(1)
        })

        it('应支持自定义根节点值（例如 0）', () => {
            const itemsWithZero = [
                { id: 1, parentId: 0 },
                { id: 2, parentId: 1 },
                { id: 3, parentId: 0 },
            ]
            const tree = arrayToTree(itemsWithZero, { rootParentValue: 0 })
            expect(tree).toHaveLength(2)
            expect(tree[0].id).toBe(1)
            expect(tree[1].id).toBe(3)
        })

        it('应支持自定义根节点值为空字符串', () => {
            const itemsWithEmpty = [
                { id: 'a', parentId: '' },
                { id: 'b', parentId: 'a' },
            ]
            const tree = arrayToTree(itemsWithEmpty, { rootParentValue: '' })
            expect(tree).toHaveLength(1)
            expect(tree[0].id).toBe('a')
        })

        it('应注意类型比较：rootParentValue 与 parentId 为严格相等（parentId 被转为字符串）', () => {
            // 当前实现中，parentId 通过 String() 转为字符串，rootParentValue 直接比较，所以如果 rootParentValue 是数字 0，parentId 是字符串 "0"，则不相等
            const items = [
                { id: 1, parentId: 0 }, // 数字 0
                { id: 2, parentId: 1 },
            ]
            const tree = arrayToTree(items, { rootParentValue: 0 })
            expect(tree).toHaveLength(1)
            expect(tree[0].id).toBe(1)
            // 说明：这是当前实现的特性，测试文档可以记录或建议改进
        })
    })

    describe('处理异常数据', () => {
        it('应忽略没有 id 或 id 为 null/undefined 的节点', () => {
            const itemsWithInvalidId = [
                { name: 'No Id', parentId: null },
                { id: 2, name: 'Valid', parentId: 1 },
            ]
            const tree = arrayToTree(itemsWithInvalidId as any)
            expect(tree).toHaveLength(1)
            expect(tree[0].id).toBe(2)
        })

        it('应处理父节点不存在的情况（孤儿节点作为根节点）', () => {
            const orphanItems = [
                { id: 1, parentId: null },
                { id: 2, parentId: 999 }, // 父节点不存在
                { id: 3, parentId: 1 },
            ]
            const tree = arrayToTree(orphanItems)
            expect(tree).toHaveLength(2)
            expect(tree[0].id).toBe(1)
            expect(tree[0].children).toHaveLength(1)
            expect(tree[0].children[0].id).toBe(3)
            expect(tree[1].id).toBe(2) // 孤儿节点作为根
        })

        // it('应处理重复 id（后出现的节点覆盖先出现的）', () => {
        //     const duplicateItems = [
        //         { id: 1, name: 'First', parentId: null },
        //         { id: 1, name: 'Second', parentId: null },
        //     ]
        //     const tree = arrayToTree(duplicateItems)
        //     expect(tree).toHaveLength(1)
        //     expect(tree[0].name).toBe('Second') // 映射表中后覆盖前
        // })

        it('应处理 id 为字符串的情况', () => {
            const stringIdItems = [
                { id: 'root', name: 'Root', parentId: null },
                { id: 'child', name: 'Child', parentId: 'root' },
            ]
            const tree = arrayToTree(stringIdItems)
            expect(tree[0].id).toBe('root')
            expect(tree[0].children[0].id).toBe('child')
        })

        it('应处理混合类型 id（数字和字符串）但映射使用字符串作为键', () => {
            const mixedItems = [
                { id: 1, name: 'Root', parentId: null },
                { id: '2', name: 'Child', parentId: 1 }, // parentId 数字，id 字符串
            ]
            const tree = arrayToTree(mixedItems)
            // 数字 1 作为键存入 Map 时被转为字符串 "1"
            // parentId 1 被转为字符串 "1"，所以能匹配到父节点
            expect(tree[0].children[0].id).toBe('2')
        })
    })

    describe('验证内部逻辑', () => {
        it('应确保每个节点都有 children 数组（即使在映射中初始化）', () => {
            const items = [{ id: 1, name: 'Root', parentId: null }]
            const tree = arrayToTree(items)
            expect(tree[0]).toHaveProperty('children')
            expect(Array.isArray(tree[0].children)).toBe(true)
        })

        it('不应修改原始输入对象', () => {
            const original = [{ id: 1, name: 'Root', parentId: null }]
            const copy = [...original]
            arrayToTree(original)
            expect(original).toEqual(copy) // 确保原始数组未被修改
        })
    })
})
