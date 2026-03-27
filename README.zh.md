# tree

一个现代、轻量的 TS 树操作库，涵盖遍历（深度优先前序/后序、广度优先）、查找、转换、查询与修改等核心需求。纯函数设计确保数据不可变，支持自定义子节点字段，零依赖且类型完备，浏览器与 Node.js 均可使用。

[English Version (中文版本)](README.md)

## 特性

- 🚀 全面：涵盖树操作的常见场景
- 🔒 不可变：函数式编程，无副作用
- 🎯 灵活：支持自定义子节点字段名、遍历策略（DFS/BFS）和遍历顺序（前序，后序）
- 📦 轻量：无依赖，体积小巧（gzip后仅~3K），支持Tree-shaking
- 🌲 支持森林：可以处理多根节点的树（森林）
- 🛡️ 健壮：纯 TypeScript 编写，类型安全，测试用例覆盖全面

## 安装

```bash
npm i @suzilong/tree
# 或
yarn add @suzilong/tree
# 或
pnpm i @suzilong/tree
```

使用示例

#### Es Module

```js
import { forEach } from '@suzilong/tree'

forEach(tree, (node) => {
    console.log(node)
})
```

#### Node.js

```js
const { forEach } = require('@suzilong/tree')

forEach(tree, (node) => {
    console.log(node)
})
```

#### 直接在浏览器中使用

```html
<script src="https://unpkg.com/@suzilong/tree"></script>

<script>
    const { forEach } = window.Tree

    forEach(tree, (node) => {
        console.log(node)
    })
</script>
```

## API 文档

### 目录

- [1. 遍历 (traverse)](#1-遍历-traverse)
    - [forEach](#foreach)
    - [depthFirst](#depthfirst)
    - [breadthFirst](#breadthfirst)
- [2. 查找 (find)](#2-查找-find)
    - [find](#find)
    - [findAll](#findall)
    - [findPath](#findpath)
- [3. 修改 (modify)](#3-修改-modify)
    - [appendChild](#appendchild)
    - [prependChild](#prependchild)
    - [insertBefore](#insertbefore)
    - [insertAfter](#insertafter)
    - [remove](#remove)
    - [replace](#replace)
    - [move](#move)
- [4. 转换 (transform)](#4-转换-transform)
    - [arrayToTree](#arraytotree)
    - [treeToArray](#treearrayto)
    - [map](#map)
    - [filter](#filter)
    - [reduce](#reduce)
    - [flat](#flat)
- [5. 查询 (query)](#5-查询-query)
    - [getCount](#getcount)
    - [getLeafCount](#getleafcount)
    - [getDepth](#getdepth)
    - [getAncestors](#getancestors)
    - [getDescendants](#getdescendants)
    - [getSiblings](#getsiblings)
- [6. 其他 (orther)](#6-其他-orther)
    - [clone](#clone)
    - [every](#every)
    - [some](#some)
    - [print](#print)
- [7. 关系判断 (is)](#7-关系判断-is)
    - [isBrother](#isbrother)
- [类型定义](#类型定义)

---

### 1. 遍历 (traverse)

#### forEach

**功能**：对树中的每个节点执行一次给定的函数（无返回值，不中断）

**参数**：

- `tree`: TreeNode | TreeNode[] - 树或森林
- `callback`: (node: TreeNode, context: Context) => void - 对每个节点执行的函数
- `options`: Options - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'
    - `strategy`: 'dfs' | 'bfs' - 遍历策略，默认为 'dfs'（深度优先）
    - `order`: 'pre' | 'post' - 仅在深度优先遍历时有效，默认为 'pre'（前序遍历）

**示例**：

```js
import { forEach } from '@suzilong/tree'

const tree = {
    id: '1',
    children: [
        {
            id: '1-1',
            children: [{ id: '1-1-1' }],
        },
    ],
}

// 前序遍历（默认）
forEach(tree, (node, context) => {
    console.log(`节点: ${node.id}, 深度: ${context.depth}`)
    // 输出: 节点: 1, 深度: 0
    // 输出: 节点: 1-1, 深度: 1
    // 输出: 节点: 1-1-1, 深度: 2
})

// 广度优先遍历
forEach(
    tree,
    (node) => {
        console.log(node.id)
    },
    { strategy: 'bfs' }
)
// 输出: 1, 1-1, 1-1-1
```

#### depthFirst

**功能**：深度优先遍历树结构

**参数**：

- `tree`: TreeNode | TreeNode[] - 树或森林
- `callback`: (node: TreeNode, context: Context) => boolean | void - 对每个节点执行的函数，返回 false 可中断遍历
- `options`: DepthFirstOptions - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'
    - `order`: 'pre' | 'post' - 遍历顺序，默认为 'pre'（前序遍历）

**示例**：

```js
import { depthFirst } from '@suzilong/tree'

const tree = {
    id: '1',
    children: [
        {
            id: '1-1',
            children: [{ id: '1-1-1' }],
        },
    ],
}

// 前序遍历
console.log('前序遍历:')
depthFirst(tree, (node) => {
    console.log(node.id)
})
// 输出: 1, 1-1, 1-1-1

// 后序遍历
console.log('后序遍历:')
depthFirst(
    tree,
    (node) => {
        console.log(node.id)
    },
    { order: 'post' }
)
// 输出: 1-1-1, 1-1, 1
```

#### breadthFirst

**功能**：广度优先遍历树结构

**参数**：

- `tree`: TreeNode | TreeNode[] - 树或森林
- `callback`: (node: TreeNode, context: Context) => boolean | void - 对每个节点执行的函数，返回 false 可中断遍历
- `options`: BaseOptions - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'

**示例**：

```js
import { breadthFirst } from '@suzilong/tree'

const tree = {
    id: '1',
    children: [
        {
            id: '1-1',
            children: [{ id: '1-1-1' }],
        },
        {
            id: '1-2',
        },
    ],
}

breadthFirst(tree, (node) => {
    console.log(node.id)
})
// 输出: 1, 1-1, 1-2, 1-1-1
```

### 2. 查找 (find)

#### find

**功能**：在树结构中查找满足条件的节点

**参数**：

- `tree`: TreeNode | TreeNode[] - 树或森林
- `callback`: (node: TreeNode) => boolean - 条件函数，返回 true 表示找到目标节点
- `options`: FindOptions - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'
    - `strategy`: 'dfs' | 'bfs' - 遍历策略，默认为 'dfs'
    - `order`: 'pre' | 'post' - 仅在深度优先遍历时有效，默认为 'pre'

**返回值**：TreeNode | null - 满足条件的节点，如果未找到则返回 null

**示例**：

```js
import { find } from '@suzilong/tree'

const tree = {
    id: '1',
    children: [
        {
            id: '1-1',
            children: [{ id: '1-1-1' }],
        },
        {
            id: '1-2',
        },
    ],
}

const foundNode = find(tree, (node) => node.id === '1-2')
console.log(foundNode) // 输出: { id: '1-2' }

const notFoundNode = find(tree, (node) => node.id === '999')
console.log(notFoundNode) // 输出: null
```

#### findAll

**功能**：在树结构中查找所有满足条件的节点

**参数**：

- `tree`: TreeNode | TreeNode[] - 树或森林
- `callback`: (node: TreeNode) => boolean - 条件函数，返回 true 表示找到目标节点
- `options`: FindOptions - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'
    - `strategy`: 'dfs' | 'bfs' - 遍历策略，默认为 'dfs'
    - `order`: 'pre' | 'post' - 仅在深度优先遍历时有效，默认为 'pre'

**返回值**：TreeNode[] - 满足条件的节点数组，如果未找到则返回空数组

**示例**：

```js
import { findAll } from '@suzilong/tree'

const tree = {
    id: '1',
    type: 'parent',
    children: [
        {
            id: '1-1',
            type: 'child',
            children: [{ id: '1-1-1', type: 'child' }],
        },
        {
            id: '1-2',
            type: 'child',
        },
    ],
}

const childNodes = findAll(tree, (node) => node.type === 'child')
console.log(childNodes.length) // 输出: 3
console.log(childNodes.map((node) => node.id)) // 输出: ['1-1', '1-1-1', '1-2']
```

#### findPath

**功能**：在树结构中查找满足条件的节点，并返回从根节点到该节点的路径

**参数**：

- `tree`: TreeNode | TreeNode[] - 树或森林
- `callback`: (node: TreeNode) => boolean - 条件函数，返回 true 表示找到目标节点
- `options`: FindOptions - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'
    - `strategy`: 'dfs' | 'bfs' - 遍历策略，默认为 'dfs'
    - `order`: 'pre' | 'post' - 仅在深度优先遍历时有效，默认为 'pre'

**返回值**：TreeNode[] - 根节点到该节点的路径，如果未找到则返回空数组

**示例**：

```js
import { findPath } from '@suzilong/tree'

const tree = {
    id: '1',
    children: [
        {
            id: '1-1',
            children: [{ id: '1-1-1' }],
        },
    ],
}

const path = findPath(tree, (node) => node.id === '1-1-1')
console.log(path.map((node) => node.id)) // 输出: ['1', '1-1', '1-1-1']

const emptyPath = findPath(tree, (node) => node.id === '999')
console.log(emptyPath) // 输出: []
```

### 3. 修改 (modify)

#### appendChild

**功能**：向指定父节点追加一个子节点（作为最后一个子节点），只操作第一个匹配的父节点

**参数**：

- `tree`: TreeNode | TreeNode[] - 原树或森林
- `predicate`: (node: TreeNode) => boolean - 断言函数，用于定位父节点（只使用第一个匹配的节点）
- `newNode`: TreeNode - 要追加的新节点
- `options`: BaseOptions - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'

**返回值**：TreeNode | TreeNode[] - 新树（如果未找到父节点，则返回原树）

**示例**：

```js
import { appendChild } from '@suzilong/tree'

const tree = {
    id: '1',
    children: [{ id: '1-1' }],
}

const newTree = appendChild(tree, (node) => node.id === '1', { id: '1-2' })
console.log(newTree.children.map((node) => node.id)) // 输出: ['1-1', '1-2']
```

#### prependChild

**功能**：向指定父节点 prepend 一个子节点（作为第一个子节点），只操作第一个匹配的父节点

**参数**：

- `tree`: TreeNode | TreeNode[] - 原树或森林
- `predicate`: (node: TreeNode) => boolean - 断言函数，用于定位父节点（只使用第一个匹配的节点）
- `newNode`: TreeNode - 要 prepend 的新节点
- `options`: BaseOptions - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'

**返回值**：TreeNode | TreeNode[] - 新树（如果未找到父节点，则返回原树）

**示例**：

```js
import { prependChild } from '@suzilong/tree'

const tree = {
    id: '1',
    children: [{ id: '1-1' }],
}

const newTree = prependChild(tree, (node) => node.id === '1', { id: '1-0' })
console.log(newTree.children.map((node) => node.id)) // 输出: ['1-0', '1-1']
```

#### insertBefore

**功能**：在指定节点前插入一个新节点，只操作第一个匹配的目标节点

**参数**：

- `tree`: TreeNode | TreeNode[] - 原树或森林
- `predicate`: (node: TreeNode) => boolean - 断言函数，用于定位目标节点（只使用第一个匹配的节点）
- `newNode`: TreeNode - 要插入的新节点
- `options`: BaseOptions - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'

**返回值**：TreeNode | TreeNode[] - 新树（如果未找到目标节点，则返回原树）

**示例**：

```js
import { insertBefore } from '@suzilong/tree'

const tree = {
    id: '1',
    children: [{ id: '1-1' }, { id: '1-2' }],
}

const newTree = insertBefore(tree, (node) => node.id === '1-2', { id: '1-1.5' })
console.log(newTree.children.map((node) => node.id)) // 输出: ['1-1', '1-1.5', '1-2']
```

#### insertAfter

**功能**：在指定节点后插入一个新节点，只操作第一个匹配的目标节点

**参数**：

- `tree`: TreeNode | TreeNode[] - 原树或森林
- `predicate`: (node: TreeNode) => boolean - 断言函数，用于定位目标节点（只使用第一个匹配的节点）
- `newNode`: TreeNode - 要插入的新节点
- `options`: BaseOptions - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'

**返回值**：TreeNode | TreeNode[] - 新树（如果未找到目标节点，则返回原树）

**示例**：

```js
import { insertAfter } from '@suzilong/tree'

const tree = {
    id: '1',
    children: [{ id: '1-1' }, { id: '1-2' }],
}

const newTree = insertAfter(tree, (node) => node.id === '1-1', { id: '1-1.5' })
console.log(newTree.children.map((node) => node.id)) // 输出: ['1-1', '1-1.5', '1-2']
```

#### remove

**功能**：移除树中所有满足条件的节点

**参数**：

- `tree`: TreeNode | TreeNode[] - 原树或森林
- `predicate`: (node: TreeNode) => boolean - 断言函数，用于定位要移除的节点
- `options`: BaseOptions - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'

**返回值**：null | TreeNode | TreeNode[] - 新树（如果未找到要移除的节点，则返回原树）

**示例**：

```js
import { remove } from '@suzilong/tree'

const tree = {
    id: '1',
    children: [{ id: '1-1' }, { id: '1-2' }],
}

const newTree = remove(tree, (node) => node.id === '1-1')
console.log(newTree.children.map((node) => node.id)) // 输出: ['1-2']

const newTree2 = remove(tree, (node) => node.id === '1')
console.log(newTree2) // 输出: null
```

#### replace

**功能**：替换树中所有满足条件的节点

**参数**：

- `tree`: TreeNode | TreeNode[] - 原树或森林
- `predicate`: (node: TreeNode) => boolean - 断言函数，用于定位要替换的节点
- `newNode`: TreeNode - 新节点
- `options`: BaseOptions - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'

**返回值**：TreeNode | TreeNode[] - 新树（如果未找到要替换的节点，则返回原树）

**示例**：

```js
import { replace } from '@suzilong/tree'

const tree = {
    id: '1',
    children: [{ id: '1-1' }, { id: '1-2' }],
}

const newTree = replace(tree, (node) => node.id === '1-1', { id: '1-1-new' })
console.log(newTree.children.map((node) => node.id)) // 输出: ['1-1-new', '1-2']
```

#### move

**功能**：将一个节点移动到另一个节点的子节点列表中（作为最后一个子节点），只操作第一个匹配的源节点和目标节点

**参数**：

- `tree`: TreeNode | TreeNode[] - 原树或森林
- `sourcePredicate`: (node: TreeNode) => boolean - 断言函数，用于定位要移动的节点（只使用第一个匹配的节点）
- `targetPredicate`: (node: TreeNode) => boolean - 断言函数，用于定位目标父节点（只使用第一个匹配的节点）
- `options`: BaseOptions - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'

**返回值**：TreeNode | TreeNode[] - 新树（如果未找到源节点或目标节点，则返回原树）

**示例**：

```js
import { move } from '@suzilong/tree'

const tree = {
    id: '1',
    children: [
        { id: '1-1' },
        {
            id: '1-2',
            children: [],
        },
    ],
}

const newTree = move(
    tree,
    (node) => node.id === '1-1',
    (node) => node.id === '1-2'
)
console.log(newTree.children.map((node) => node.id)) // 输出: ['1-2']
console.log(newTree.children[0].children.map((node) => node.id)) // 输出: ['1-1']
```

### 4. 转换 (transform)

#### arrayToTree

**功能**：将扁平数组转换为树结构

**参数**：

- `array`: any[] - 扁平数组
- `options`: ArrayToTreeOptions - 配置选项
    - `idKey`: string - 节点唯一标识字段名，默认为 'id'
    - `parentIdKey`: string - 父节点标识字段名，默认为 'parentId'
    - `childrenKey`: string - 子节点数组字段名，默认为 'children'
    - `rootParentValue`: null | undefined | string | number - 根节点的父标识值，默认为 null 或 undefined

**返回值**：TreeNode[] - 转换后的树结构（森林）

**示例**：

```js
import { arrayToTree } from '@suzilong/tree'

const array = [
    { id: '1', name: '节点1', parentId: null },
    { id: '2', name: '节点2', parentId: '1' },
    { id: '3', name: '节点3', parentId: '1' },
    { id: '4', name: '节点4', parentId: '2' },
]

const tree = arrayToTree(array)
console.log(tree[0].id) // 输出: '1'
console.log(tree[0].children.length) // 输出: 2
console.log(tree[0].children[0].children[0].id) // 输出: '4'
```

#### treeToArray

**功能**：将树结构转换为扁平数组

**参数**：

- `tree`: TreeNode | TreeNode[] - 树或森林
- `options`: TreeToArrayOptions - 配置选项
    - `idKey`: string - 节点唯一标识字段名，默认为 'id'
    - `parentIdKey`: string - 输出中父节点标识字段名，默认为 'parentId'
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'
    - `rootParentValue`: null | undefined | string | number - 根节点的父标识值，默认为 null
    - `keepChildren`: boolean - 是否在输出中保留子节点数组，默认为 false（移除 children）
    - `strategy`: 'dfs' | 'bfs' - 遍历策略，默认为 'dfs'
    - `order`: 'pre' | 'post' - 遍历顺序，仅对 dfs 有效，默认为 'pre'

**返回值**：any[] - 转换后的扁平数组

**示例**：

```js
import { treeToArray } from '@suzilong/tree'

const tree = [
    {
        id: '1',
        children: [
            {
                id: '1-1',
                children: [{ id: '1-1-1' }],
            },
        ],
    },
]

const array = treeToArray(tree)
console.log(array.length) // 输出: 3
console.log(array.map((item) => item.id)) // 输出: ['1', '1-1', '1-1-1']
console.log(array.map((item) => item.parentId)) // 输出: [null, '1', '1-1']
```

#### map

**功能**：对树中的每个节点执行映射函数，返回新树

**参数**：

- `tree`: TreeNode | TreeNode[] - 树或森林
- `callback`: (node: TreeNode, context: Context) => TreeNode - 映射函数，返回新节点
- `options`: Options - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'
    - `strategy`: 'dfs' | 'bfs' - 遍历策略，默认为 'dfs'
    - `order`: 'pre' | 'post' - 仅在深度优先遍历时有效，默认为 'pre'

**返回值**：TreeNode | TreeNode[] - 映射后的新树

**示例**：

```js
import { map } from '@suzilong/tree'

const tree = {
    id: '1',
    value: 10,
    children: [
        {
            id: '1-1',
            value: 20,
        },
    ],
}

const newTree = map(tree, (node) => ({
    ...node,
    value: node.value * 2,
}))

console.log(newTree.value) // 输出: 20
console.log(newTree.children[0].value) // 输出: 40
```

#### filter

**功能**：过滤树中的节点，返回新树

**参数**：

- `tree`: TreeNode | TreeNode[] - 树或森林
- `callback`: (node: TreeNode, context: Context) => boolean - 过滤函数，返回 true 表示保留节点
- `options`: Options - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'
    - `strategy`: 'dfs' | 'bfs' - 遍历策略，默认为 'dfs'
    - `order`: 'pre' | 'post' - 仅在深度优先遍历时有效，默认为 'pre'

**返回值**：TreeNode | TreeNode[] - 过滤后的新树

**示例**：

```js
import { filter } from '@suzilong/tree'

const tree = {
    id: '1',
    type: 'parent',
    children: [
        {
            id: '1-1',
            type: 'child',
        },
        {
            id: '1-2',
            type: 'parent',
            children: [{ id: '1-2-1', type: 'child' }],
        },
    ],
}

const filteredTree = filter(tree, (node) => node.type === 'parent')
console.log(filteredTree.id) // 输出: '1'
console.log(filteredTree.children.length) // 输出: 1
console.log(filteredTree.children[0].id) // 输出: '1-2'
```

#### reduce

**功能**：对树中的节点执行归约函数，返回累加结果

**参数**：

- `tree`: TreeNode | TreeNode[] - 树或森林
- `callback`: (accumulator: any, node: TreeNode, context: Context) => any - 归约函数
- `initialValue`: any - 初始累加值
- `options`: Options - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'
    - `strategy`: 'dfs' | 'bfs' - 遍历策略，默认为 'dfs'
    - `order`: 'pre' | 'post' - 仅在深度优先遍历时有效，默认为 'pre'

**返回值**：any - 归约结果

**示例**：

```js
import { reduce } from '@suzilong/tree'

const tree = {
    id: '1',
    value: 10,
    children: [
        {
            id: '1-1',
            value: 20,
        },
        {
            id: '1-2',
            value: 30,
        },
    ],
}

const sum = reduce(tree, (acc, node) => acc + node.value, 0)
console.log(sum) // 输出: 60
```

#### flat

**功能**：将树结构扁平化为节点数组

**参数**：

- `tree`: TreeNode | TreeNode[] - 树或森林
- `options`: Options - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'
    - `strategy`: 'dfs' | 'bfs' - 遍历策略，默认为 'dfs'
    - `order`: 'pre' | 'post' - 仅在深度优先遍历时有效，默认为 'pre'

**返回值**：TreeNode[] - 扁平后的节点数组

**示例**：

```js
import { flat } from '@suzilong/tree'

const tree = {
    id: '1',
    children: [
        {
            id: '1-1',
            children: [{ id: '1-1-1' }],
        },
    ],
}

const nodes = flat(tree)
console.log(nodes.length) // 输出: 3
console.log(nodes.map((node) => node.id)) // 输出: ['1', '1-1', '1-1-1']
```

### 5. 查询 (query)

#### getCount

**功能**：获取树中节点的数量

**参数**：

- `tree`: TreeNode | TreeNode[] - 树或森林
- `options`: BaseOptions - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'

**返回值**：number - 节点数量

**示例**：

```js
import { getCount } from '@suzilong/tree'

const tree = {
    id: '1',
    children: [
        {
            id: '1-1',
            children: [{ id: '1-1-1' }],
        },
    ],
}

const count = getCount(tree)
console.log(count) // 输出: 3
```

#### getLeafCount

**功能**：获取树中叶子节点的数量

**参数**：

- `tree`: TreeNode | TreeNode[] - 树或森林
- `options`: BaseOptions - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'

**返回值**：number - 叶子节点数量

**示例**：

```js
import { getLeafCount } from '@suzilong/tree'

const tree = {
    id: '1',
    children: [
        {
            id: '1-1',
            children: [{ id: '1-1-1' }],
        },
        {
            id: '1-2',
        },
    ],
}

const leafCount = getLeafCount(tree)
console.log(leafCount) // 输出: 2
```

#### getDepth

**功能**：获取树的深度

**参数**：

- `tree`: TreeNode | TreeNode[] - 树或森林
- `options`: BaseOptions - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'

**返回值**：number - 树的深度

**示例**：

```js
import { getDepth } from '@suzilong/tree'

const tree = {
    id: '1',
    children: [
        {
            id: '1-1',
            children: [{ id: '1-1-1' }],
        },
    ],
}

const depth = getDepth(tree)
console.log(depth) // 输出: 3
```

#### getAncestors

**功能**：获取指定节点的所有祖先节点

**参数**：

- `tree`: TreeNode | TreeNode[] - 树或森林
- `predicate`: (node: TreeNode) => boolean - 断言函数，用于定位目标节点
- `options`: BaseOptions - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'

**返回值**：TreeNode[] - 祖先节点数组（从根节点到父节点）

**示例**：

```js
import { getAncestors } from '@suzilong/tree'

const tree = {
    id: '1',
    children: [
        {
            id: '1-1',
            children: [{ id: '1-1-1' }],
        },
    ],
}

const ancestors = getAncestors(tree, (node) => node.id === '1-1-1')
console.log(ancestors.map((node) => node.id)) // 输出: ['1', '1-1']
```

#### getDescendants

**功能**：获取指定节点的所有后代节点

**参数**：

- `tree`: TreeNode | TreeNode[] - 树或森林
- `predicate`: (node: TreeNode) => boolean - 断言函数，用于定位目标节点
- `options`: Options - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'
    - `strategy`: 'dfs' | 'bfs' - 遍历策略，默认为 'dfs'
    - `order`: 'pre' | 'post' - 仅在深度优先遍历时有效，默认为 'pre'

**返回值**：TreeNode[] - 后代节点数组

**示例**：

```js
import { getDescendants } from '@suzilong/tree'

const tree = {
    id: '1',
    children: [
        {
            id: '1-1',
            children: [{ id: '1-1-1' }],
        },
        {
            id: '1-2',
        },
    ],
}

const descendants = getDescendants(tree, (node) => node.id === '1')
console.log(descendants.length) // 输出: 3
console.log(descendants.map((node) => node.id)) // 输出: ['1-1', '1-1-1', '1-2']
```

#### getSiblings

**功能**：获取指定节点的所有兄弟节点（不包括自身）

**参数**：

- `tree`: TreeNode | TreeNode[] - 树或森林
- `predicate`: (node: TreeNode) => boolean - 断言函数，用于定位目标节点
- `options`: BaseOptions - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'

**返回值**：TreeNode[] - 兄弟节点数组

**示例**：

```js
import { getSiblings } from '@suzilong/tree'

const tree = {
    id: '1',
    children: [{ id: '1-1' }, { id: '1-2' }, { id: '1-3' }],
}

const siblings = getSiblings(tree, (node) => node.id === '1-2')
console.log(siblings.length) // 输出: 2
console.log(siblings.map((node) => node.id)) // 输出: ['1-1', '1-3']
```

### 6. 其他 (orther)

#### clone

**功能**：深拷贝树结构

**参数**：

- `tree`: TreeNode | TreeNode[] - 树或森林
- `options`: BaseOptions - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'

**返回值**：TreeNode | TreeNode[] - 拷贝后的新树

**示例**：

```js
import { clone } from '@suzilong/tree'

const tree = {
    id: '1',
    children: [{ id: '1-1' }],
}

const clonedTree = clone(tree)
console.log(clonedTree === tree) // 输出: false
console.log(clonedTree.children === tree.children) // 输出: false
console.log(clonedTree.children[0].id === tree.children[0].id) // 输出: true
```

#### every

**功能**：检查树中的所有节点是否都满足条件

**参数**：

- `tree`: TreeNode | TreeNode[] - 树或森林
- `callback`: (node: TreeNode, context: Context) => boolean - 条件函数
- `options`: Options - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'
    - `strategy`: 'dfs' | 'bfs' - 遍历策略，默认为 'dfs'
    - `order`: 'pre' | 'post' - 仅在深度优先遍历时有效，默认为 'pre'

**返回值**：boolean - 所有节点都满足条件返回 true，否则返回 false

**示例**：

```js
import { every } from '@suzilong/tree'

const tree = {
    id: '1',
    type: 'node',
    children: [
        {
            id: '1-1',
            type: 'node',
        },
    ],
}

const allNodes = every(tree, (node) => node.type === 'node')
console.log(allNodes) // 输出: true

const hasLeaf = every(tree, (node) => node.children)
console.log(hasLeaf) // 输出: false
```

#### some

**功能**：检查树中是否至少有一个节点满足条件

**参数**：

- `tree`: TreeNode | TreeNode[] - 树或森林
- `callback`: (node: TreeNode, context: Context) => boolean - 条件函数
- `options`: Options - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'
    - `strategy`: 'dfs' | 'bfs' - 遍历策略，默认为 'dfs'
    - `order`: 'pre' | 'post' - 仅在深度优先遍历时有效，默认为 'pre'

**返回值**：boolean - 至少有一个节点满足条件返回 true，否则返回 false

**示例**：

```js
import { some } from '@suzilong/tree'

const tree = {
    id: '1',
    type: 'parent',
    children: [
        {
            id: '1-1',
            type: 'child',
        },
    ],
}

const hasChild = some(tree, (node) => node.type === 'child')
console.log(hasChild) // 输出: true

const hasLeaf = some(tree, (node) => node.id === '999')
console.log(hasLeaf) // 输出: false
```

#### print

**功能**：在控制台打印tree，用于调试，打印结果类似Linux tree命令

**参数**：

- `tree`: TreeNode | TreeNode[] - 树或森林
- `options`: Options - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'

**返回值**：无

**示例**：

```js
import { print } from '@suzilong/tree'

const tree = {
    id: '1',
    type: 'parent',
    children: [
        {
            id: '1-1',
            type: 'child',
        },
    ],
}

print(tree, { childrenKey: 'children' })
```

### 7. 关系判断 (is)

#### isBrother

**功能**：判断两个节点是否为兄弟节点（即具有相同的父节点）

**参数**：

- `tree`: TreeNode | TreeNode[] - 树或森林
- `predicateA`: (node: TreeNode) => boolean - 定位第一个节点的断言函数
- `predicateB`: (node: TreeNode) => boolean - 定位第二个节点的断言函数
- `options`: BaseOptions - 配置选项
    - `childrenKey`: string - 自定义子节点字段名，默认为 'children'

**返回值**：boolean - 是兄弟则返回 true，否则 false

**示例**：

```js
import { isBrother } from '@suzilong/tree'

const tree = {
    id: '1',
    children: [
        { id: '2', name: 'a' },
        { id: '3', name: 'b' },
        { id: '4', name: 'c' }
    ]
}

// 检查 id 为 2 和 3 的节点是否为兄弟
const areBrothers = isBrother(
    tree,
    (node) => node.id === 2,
    (node) => node.id === 3
)
console.log(areBrothers) // 输出: true

// 检查 id 为 2 和 4 的节点是否为兄弟
const areBrothers2 = isBrother(
    tree,
    (node) => node.id === 2,
    (node) => node.id === 4
)
console.log(areBrothers2) // 输出: true

// 检查节点是否与自身为兄弟
const areBrothers3 = isBrother(
    tree,
    (node) => node.id === 2,
    (node) => node.id === 2
)
console.log(areBrothers3) // 输出: false
```

## 类型定义

### TreeNode

```typescript
type TreeNode<T = unknown, ChildKey extends string = 'children'> = {
    [key: string]: unknown // 允许任意其他属性
} & {
    [K in ChildKey]?: TreeNode<T, ChildKey>[] // 动态子节点字段
}
```

### Context

```typescript
interface Context {
    index: number // 当前节点在兄弟节点中的位置（从 0 开始）
    depth: number // 当前节点深度（根节点为 0）
    parent: TreeNode | null // 父节点，根节点为 null
    path: TreeNode[] // 从根到当前节点的路径
}
```

### Options

```typescript
interface Options extends BaseOptions {
    strategy?: 'dfs' | 'bfs' // 遍历策略，默认为 'dfs'（深度优先），可选 'bfs'（广度优先）
    order?: 'pre' | 'post' // 仅在深度优先遍历时有效，默认为 'pre'（前序遍历），可选 'post'（后序遍历）
}
```

### BaseOptions

```typescript
interface BaseOptions {
    childrenKey?: string // 自定义子节点字段名，默认为 'children'
}
```

### ArrayToTreeOptions

```typescript
interface ArrayToTreeOptions {
    /** 节点唯一标识字段名，默认为 'id' */
    idKey?: string
    /** 父节点标识字段名，默认为 'parentId' */
    parentIdKey?: string
    /** 子节点数组字段名，默认为 'children' */
    childrenKey?: string
    /** 根节点的父标识值，默认为 null 或 undefined */
    rootParentValue?: null | undefined | string | number
}
```

### TreeToArrayOptions

```typescript
interface TreeToArrayOptions {
    /** 节点唯一标识字段名，默认为 'id' */
    idKey?: string
    /** 输出中父节点标识字段名，默认为 'parentId' */
    parentIdKey?: string
    /** 自定义子节点字段名，默认为 'children' */
    childrenKey?: string
    /** 根节点的父标识值，默认为 null */
    rootParentValue?: null | undefined | string | number
    /** 是否在输出中保留子节点数组，默认为 false（移除 children） */
    keepChildren?: boolean
    /** 遍历策略，默认为 'dfs' */
    strategy?: 'dfs' | 'bfs'
    /** 遍历顺序，仅对 dfs 有效，默认为 'pre' */
    order?: 'pre' | 'post'
}
```
