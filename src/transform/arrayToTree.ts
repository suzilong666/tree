// transform/arrayToTree.ts
import { ArrayToTreeOptions, TreeNode } from '../types'
import { DEFAULT_CHILDREN_KEY } from '../constants/index'

/**
 * 将扁平数组转换为树形结构
 * @param items 扁平数组，每个元素应包含 id 和 parentId 字段
 * @param options 配置选项
 * @returns 树形结构（根节点数组）
 */
export function arrayToTree(
    items: TreeNode[],
    options: ArrayToTreeOptions = {}
): TreeNode[] {
    const {
        idKey = 'id',
        parentIdKey = 'parentId',
        childrenKey = DEFAULT_CHILDREN_KEY,
        rootParentValue = null,
    } = options

    // 建立 id 到节点的映射，并为每个节点初始化 children 数组
    const itemMap = new Map<string, TreeNode>()
    items.forEach((item) => {
        const id = item[idKey]
        if (id !== undefined && id !== null) {
            // 确保每个节点都有 children 属性（初始为空数组）
            itemMap.set(String(id), { ...item, [childrenKey]: [] })
        }
    })

    const roots: TreeNode[] = []

    // 第二次遍历，建立父子关系
    items.forEach((item) => {
        const id = item[idKey]
        const parentId = item[parentIdKey]
        const currentNode = itemMap.get(String(id))

        if (!currentNode) return // 理论上不会发生，但防御性编程

        if (parentId === rootParentValue) {
            // 根节点
            roots.push(currentNode)
        } else {
            // 非根节点，找到父节点并添加
            const parentNode = itemMap.get(String(parentId))
            if (parentNode && Array.isArray(parentNode[childrenKey])) {
                parentNode[childrenKey].push(currentNode)
            } else {
                // 如果父节点不存在（数据不一致），可选择作为根节点或忽略
                // 这里作为根节点处理，避免丢失节点
                roots.push(currentNode)
            }
        }
    })

    return roots
}
