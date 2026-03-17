// query/some.ts
import { TreeNode, Options } from '../types'
import { depthFirst, breadthFirst } from '../traverse'
import { DEFAULT_CHILDREN_KEY } from '../constants'

/**
 * 判断树中是否存在至少一个节点满足条件
 * @param tree 树或森林
 * @param predicate 断言函数，返回 true 表示节点满足条件
 * @param options 配置选项
 * @returns 存在则返回 true，否则 false
 */
export function some(
    tree: TreeNode | TreeNode[],
    predicate: (node: TreeNode) => boolean,
    options: Options = {}
): boolean {
    const {
        childrenKey = DEFAULT_CHILDREN_KEY,
        strategy = 'dfs',
        order = 'pre',
    } = options
    const traverse = strategy === 'bfs' ? breadthFirst : depthFirst
    let found = false

    traverse(
        tree,
        (node) => {
            if (predicate(node)) {
                found = true
                return false // 停止遍历
            }
        },
        { childrenKey, order }
    )

    return found
}
