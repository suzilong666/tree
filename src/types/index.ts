export interface TreeNode<T = unknown> {
    [key: string]: unknown
    children?: TreeNode<T>[]
}

export interface BaseOptions {
    childrenKey?: string // 自定义子节点字段名，默认为 'children'
}

export interface Options extends BaseOptions {
    strategy?: 'dfs' | 'bfs' // 遍历策略，默认为 'dfs'（深度优先），可选 'bfs'（广度优先）
    order?: 'pre' | 'post' // 仅在深度优先遍历时有效，默认为 'pre'（前序遍历），可选 'post'（后序遍历）
}

export interface DepthFirstOptions extends BaseOptions {
    order?: 'pre' | 'post'
}

export interface FindOptions extends BaseOptions {
    strategy?: 'dfs' | 'bfs'
    order?: 'pre' | 'post'
}

export interface TraversalContext {
    depth: number // 当前节点深度（根节点为 0）
    parent: TreeNode | null // 父节点，根节点为 null
    path: TreeNode[] // 从根到当前节点的路径
}
