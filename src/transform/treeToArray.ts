// transform/treeToArray.ts
import { depthFirst, breadthFirst } from '../traverse'
import { TreeNode, TreeToArrayOptions } from '../types'
import { DEFAULT_CHILDREN_KEY } from '../constants'

/**
 * 将树结构转换为扁平数组（每个节点包含父节点标识）
 * @param tree 树或森林
 * @param options 配置选项
 * @returns 扁平数组，每个元素包含节点数据及 parentId 字段
 */
export function treeToArray(
    tree: TreeNode | TreeNode[],
    options: TreeToArrayOptions = {}
): TreeNode[] {
    const {
        idKey = 'id',
        parentIdKey = 'parentId',
        childrenKey = DEFAULT_CHILDREN_KEY,
        rootParentValue = null,
        keepChildren = false,
        strategy = 'dfs',
        order = 'pre',
    } = options

    const traverse = strategy === 'bfs' ? breadthFirst : depthFirst
    const result: TreeNode[] = []

    traverse(
        tree,
        (node, { parent }) => {
            // 复制节点，避免影响原对象
            const item: TreeNode = { ...node }

            // 根据 keepChildren 决定是否移除 children 字段
            if (!keepChildren) {
                delete item[childrenKey]
            }

            // 设置父节点 ID
            if (parent) {
                item[parentIdKey] = parent[idKey] ?? null
            } else {
                item[parentIdKey] = rootParentValue
            }

            result.push(item)
        },
        { childrenKey, order } // 传递给遍历器的选项
    )

    return result
}
