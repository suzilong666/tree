/**
 * 基础树节点，不预设子节点字段名
 * 通过泛型 `ChildKey` 指定子节点字段名，默认为 'children'
 */
export type TreeNode<T = unknown, ChildKey extends string = 'children'> = {
    [key: string]: unknown // 允许任意其他属性
} & {
    [K in ChildKey]?: TreeNode<T, ChildKey>[] // 动态子节点字段
}

export interface TraversalContext {
    depth: number // 当前节点深度（根节点为 0）
    parent: TreeNode | null // 父节点，根节点为 null
    path: TreeNode[] // 从根到当前节点的路径
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

export interface ArrayToTreeOptions {
    /** 节点唯一标识字段名，默认为 'id' */
    idKey?: string
    /** 父节点标识字段名，默认为 'parentId' */
    parentIdKey?: string
    /** 子节点数组字段名，默认为 'children' */
    childrenKey?: string
    /** 根节点的父标识值，默认为 null 或 undefined */
    rootParentValue?: null | undefined | string | number
}
