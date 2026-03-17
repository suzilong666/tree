// transform/reduce.ts
import { depthFirst, breadthFirst } from '../traverse'
import { TreeNode, Options, Context } from '../types'
import { DEFAULT_CHILDREN_KEY } from '../constants'

/**
 * 对树进行归约，从左到右累积值（类似数组的 reduce）
 * @param tree 原树或森林
 * @param reducer 归约函数，接收累积值和当前节点，返回新的累积值
 * @param initialValue 初始累积值
 * @param options 配置选项
 * @returns 归约结果
 */
export function reduce<T>(
    tree: TreeNode | TreeNode[],
    reducer: (accumulator: T, node: TreeNode, context: Context) => T,
    initialValue: T,
    options: Options = {}
): T {
    const {
        childrenKey = DEFAULT_CHILDREN_KEY,
        strategy = 'dfs',
        order = 'pre',
    } = options
    const traverse = strategy === 'bfs' ? breadthFirst : depthFirst

    let accumulator: T = initialValue as T

    traverse(
        tree,
        (node, context) => {
            accumulator = reducer(accumulator!, node, context)
        },
        { childrenKey, order }
    )

    return accumulator!
}
