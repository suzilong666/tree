export interface TreeNode<T = unknown> {
    [key: string]: unknown
    children?: TreeNode<T>[]
}

export type TreeOptions = {
    childrenKey?: string // 自定义子节点字段名，默认为 'children'
    order?: 'pre' | 'post' // 遍历顺序，默认为 'pre'（前序遍历），可选 'post'（后序遍历）
    strategy?: 'dfs' | 'bfs' // 遍历策略，默认为 'dfs'（深度优先），可选 'bfs'（广度优先）
}

export interface TraversalContext {
    depth: number // 当前节点深度（根节点为 0）
    parent: TreeNode | null // 父节点，根节点为 null
    path: TreeNode[] // 从根到当前节点的路径
}
