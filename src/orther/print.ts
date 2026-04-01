// utils/printTree.ts
import { BaseOptions } from '../types'
import { DEFAULT_CHILDREN_KEY } from '../constants'
import { ensureArray } from '../utils/array'

/**
 * 以 Linux tree 命令风格打印树，直接输出节点对象（可点击展开）
 * @param tree 树或森林
 * @param options 配置选项
 */
export function print(tree: unknown, options: BaseOptions = {}): void {
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options

    const nodes = ensureArray(tree)

    /**
     * 递归打印单个节点及其子树
     * @param node 当前节点
     * @param prefix 从祖先累积的前缀（不包含当前层的线条）
     * @param isLast 当前节点是否是父节点的最后一个子节点（用于决定当前层的线条和子节点的前缀）
     */
    const printNode = (node: unknown, prefix: string, isLast: boolean) => {
        // 打印当前节点
        if (prefix === '') {
            // 根节点直接输出对象，不加前缀线条
            console.log(node)
        } else {
            // 非根节点，根据是否是最后一个加上相应的线条
            console.log(prefix + (isLast ? '└── ' : '├── '), node)
        }

        const children = (node as Record<string, unknown>)?.[childrenKey]
        if (Array.isArray(children) && children.length > 0) {
            // 为子节点构建新前缀
            const childPrefix = prefix + (isLast ? '    ' : '│   ')
            for (let i = 0; i < children.length; i++) {
                const child = children[i]
                const childIsLast = i === children.length - 1
                printNode(child, childPrefix, childIsLast)
            }
        }
    }

    // 打印所有根节点
    console.group('print tree')
    for (let i = 0; i < nodes.length; i++) {
        const root = nodes[i]
        // 根节点之间无连接，用空前缀且标记为最后一个（使子节点使用空格缩进）
        printNode(root, '', true)
    }
    console.groupEnd()
}
