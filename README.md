# tree

A modern, lightweight TypeScript tree manipulation library that covers core requirements such as traversal (depth-first pre-order/post-order, breadth-first), searching, transformation, querying, and modification. Pure function design ensures immutable data, supports custom child node fields, has zero dependencies, and is fully typed, usable in both browsers and Node.js.

[中文版本 (Chinese Version)](README.zh.md)

## Features

- 🚀 Comprehensive: Covers common tree operation scenarios
- 🔒 Immutable: Functional programming with no side effects
- 🎯 Flexible: Supports custom child node field names, traversal strategies (DFS/BFS), and traversal orders (pre-order, post-order)
- 📦 Lightweight: Zero dependencies, small size (~3K gzipped), supports Tree-shaking
- 🌲 Forest Support: Can handle trees with multiple root nodes (forests)
- 🛡️ Robust: Pure TypeScript implementation, type-safe, comprehensive test coverage

## Installation

```bash
npm i @suzilong/tree
# or
yarn add @suzilong/tree
# or
pnpm i @suzilong/tree
```

Usage Examples

#### ES Module

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

#### Directly in Browser

```html
<script src="https://unpkg.com/@suzilong/tree"></script>

<script>
    const { forEach } = window.Tree

    forEach(tree, (node) => {
        console.log(node)
    })
</script>
```

## API Documentation

### Table of Contents

- [1. Traversal (traverse)](#1-traversal-traverse)
    - [forEach](#foreach)
    - [depthFirst](#depthfirst)
    - [breadthFirst](#breadthfirst)
- [2. Search (find)](#2-search-find)
    - [find](#find)
    - [findAll](#findall)
    - [findPath](#findpath)
- [3. Modification (modify)](#3-modification-modify)
    - [appendChild](#appendchild)
    - [prependChild](#prependchild)
    - [insertBefore](#insertbefore)
    - [insertAfter](#insertafter)
    - [remove](#remove)
    - [replace](#replace)
    - [move](#move)
    - [swap](#swap)
- [4. Transformation (transform)](#4-transformation-transform)
    - [arrayToTree](#arraytotree)
    - [treeToArray](#treearrayto)
    - [map](#map)
    - [filter](#filter)
    - [reduce](#reduce)
    - [flat](#flat)
- [5. Query (query)](#5-query-query)
    - [getCount](#getcount)
    - [getLeafCount](#getleafcount)
    - [getDepth](#getdepth)
    - [getAncestors](#getancestors)
    - [getDescendants](#getdescendants)
    - [getSiblings](#getsiblings)
    - [getParent](#getparent)
    - [getChildren](#getchildren)
- [6. Other (other)](#6-other-other)
    - [clone](#clone)
    - [every](#every)
    - [some](#some)
    - [print](#print)
- [7. Relationship (is)](#7-relationship-is)
    - [isSibling](#isSibling)
    - [isAncestorOf](#isancestorof)
    - [isDescendantOf](#isdescendantof)
    - [isParentOf](#isparentof)
    - [isChildOf](#ischildof)
    - [isRoot](#isroot)
    - [isLeaf](#isleaf)
    - [isSameDepth](#issamedepth)
    - [isEqual](#isequal)
- [Type Definitions](#type-definitions)

---

### 1. Traversal (traverse)

#### forEach

**Function**: Executes a given function once for each node in the tree (no return value, no interruption)

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `callback`: (node: TreeNode, context: Context) => void - Function to execute for each node
- `options`: Options - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'
    - `strategy`: 'dfs' | 'bfs' - Traversal strategy, default is 'dfs' (depth-first)
    - `order`: 'pre' | 'post' - Only valid for depth-first traversal, default is 'pre' (pre-order traversal)

**Example**:

```js
import { forEach } from '@suzilong/tree'

const tree = {
    id: '1',
    children: [{ id: '1-1', children: [{ id: '1-1-1' }] }],
}

forEach(tree, (node, context) => {
    console.log(`Node: ${node.id}, Depth: ${context.depth}`)
})
// Output: Node: 1, Depth: 0
//         Node: 1-1, Depth: 1
//         Node: 1-1-1, Depth: 2
```

#### depthFirst

**Function**: Depth-first traversal of the tree structure

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `callback`: (node: TreeNode, context: Context) => boolean | void - Function to execute for each node, return false to interrupt traversal
- `options`: DepthFirstOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'
    - `order`: 'pre' | 'post' - Traversal order, default is 'pre' (pre-order traversal)

**Example**:

```js
import { depthFirst } from '@suzilong/tree'

const tree = { id: '1', children: [{ id: '1-1', children: [{ id: '1-1-1' }] }] }

depthFirst(tree, (node) => {
    console.log(node.id)
})
// Output: 1, 1-1, 1-1-1
```

// Post-order traversal
console.log('Post-order traversal:')
depthFirst(
tree,
(node) => {
console.log(node.id)
},
{ order: 'post' }
)
// Output: 1-1-1, 1-1, 1

````

#### breadthFirst

**Function**: Breadth-first traversal of the tree structure

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `callback`: (node: TreeNode, context: Context) => boolean | void - Function to execute for each node, return false to interrupt traversal
- `options`: BaseOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'

**Example**:

```js
import { breadthFirst } from '@suzilong/tree'

const tree = { id: '1', children: [{ id: '1-1' }, { id: '1-2' }] }

breadthFirst(tree, (node) => {
    console.log(node.id)
})
// Output: 1, 1-1, 1-2
````

### 2. Search (find)

#### find

**Function**: Finds a node in the tree structure that meets the condition

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `callback`: (node: TreeNode) => boolean - Condition function, returns true to indicate the target node is found
- `options`: FindOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'
    - `strategy`: 'dfs' | 'bfs' - Traversal strategy, default is 'dfs'
    - `order`: 'pre' | 'post' - Only valid for depth-first traversal, default is 'pre'

**Return Value**: TreeNode | null - The node that meets the condition, returns null if not found

**Example**:

```js
import { find } from '@suzilong/tree'

const tree = { id: '1', children: [{ id: '1-1' }, { id: '1-2' }] }

const foundNode = find(tree, (node) => node.id === '1-2')
console.log(foundNode) // Output: { id: '1-2' }
```

#### findAll

**Function**: Finds all nodes in the tree structure that meet the condition

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `callback`: (node: TreeNode) => boolean - Condition function, returns true to indicate the target node is found
- `options`: FindOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'
    - `strategy`: 'dfs' | 'bfs' - Traversal strategy, default is 'dfs'
    - `order`: 'pre' | 'post' - Only valid for depth-first traversal, default is 'pre'

**Return Value**: TreeNode[] - Array of nodes that meet the condition, returns empty array if none found

**Example**:

```js
import { findAll } from '@suzilong/tree'

const tree = {
    id: '1',
    type: 'parent',
    children: [
        { id: '1-1', type: 'child' },
        { id: '1-2', type: 'child' },
    ],
}

const childNodes = findAll(tree, (node) => node.type === 'child')
console.log(childNodes.map((node) => node.id)) // Output: ['1-1', '1-2']
```

#### findPath

**Function**: Finds a node in the tree structure that meets the condition and returns the path from the root node to that node

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `callback`: (node: TreeNode) => boolean - Condition function, returns true to indicate the target node is found
- `options`: FindOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'
    - `strategy`: 'dfs' | 'bfs' - Traversal strategy, default is 'dfs'
    - `order`: 'pre' | 'post' - Only valid for depth-first traversal, default is 'pre'

**Return Value**: TreeNode[] - Path from root to the node, returns empty array if not found

**Example**:

```js
import { findPath } from '@suzilong/tree'

const tree = { id: '1', children: [{ id: '1-1', children: [{ id: '1-1-1' }] }] }

const path = findPath(tree, (node) => node.id === '1-1-1')
console.log(path.map((node) => node.id)) // Output: ['1', '1-1', '1-1-1']
```

### 3. Modification (modify)

#### appendChild

**Function**: Appends a child node to the specified parent node (as the last child), only operates on the first matching parent node

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Original tree or forest
- `predicate`: (node: TreeNode) => boolean - Predicate function to locate the parent node (only uses the first matching node)
- `newNode`: TreeNode - New node to append
- `options`: BaseOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'

**Return Value**: TreeNode | TreeNode[] - New tree (returns original tree if parent node not found)

**Example**:

```js
import { appendChild } from '@suzilong/tree'

const tree = { id: '1', children: [{ id: '1-1' }] }

const newTree = appendChild(tree, (node) => node.id === '1', { id: '1-2' })
console.log(newTree.children.map((node) => node.id)) // Output: ['1-1', '1-2']
```

#### prependChild

**Function**: Prepends a child node to the specified parent node (as the first child), only operates on the first matching parent node

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Original tree or forest
- `predicate`: (node: TreeNode) => boolean - Predicate function to locate the parent node (only uses the first matching node)
- `newNode`: TreeNode - New node to prepend
- `options`: BaseOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'

**Return Value**: TreeNode | TreeNode[] - New tree (returns original tree if parent node not found)

**Example**:

```js
import { prependChild } from '@suzilong/tree'

const tree = { id: '1', children: [{ id: '1-1' }] }

const newTree = prependChild(tree, (node) => node.id === '1', { id: '1-0' })
console.log(newTree.children.map((node) => node.id)) // Output: ['1-0', '1-1']
```

#### insertBefore

**Function**: Inserts a new node before the specified node, only operates on the first matching target node

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Original tree or forest
- `predicate`: (node: TreeNode) => boolean - Predicate function to locate the target node (only uses the first matching node)
- `newNode`: TreeNode - New node to insert
- `options`: BaseOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'

**Return Value**: TreeNode | TreeNode[] - New tree (returns original tree if target node not found)

**Example**:

```js
import { insertBefore } from '@suzilong/tree'

const tree = { id: '1', children: [{ id: '1-1' }, { id: '1-2' }] }

const newTree = insertBefore(tree, (node) => node.id === '1-2', { id: '1-1.5' })
console.log(newTree.children.map((node) => node.id)) // Output: ['1-1', '1-1.5', '1-2']
```

#### insertAfter

**Function**: Inserts a new node after the specified node, only operates on the first matching target node

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Original tree or forest
- `predicate`: (node: TreeNode) => boolean - Predicate function to locate the target node (only uses the first matching node)
- `newNode`: TreeNode - New node to insert
- `options`: BaseOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'

**Return Value**: TreeNode | TreeNode[] - New tree (returns original tree if target node not found)

**Example**:

```js
import { insertAfter } from '@suzilong/tree'

const tree = { id: '1', children: [{ id: '1-1' }, { id: '1-2' }] }

const newTree = insertAfter(tree, (node) => node.id === '1-1', { id: '1-1.5' })
console.log(newTree.children.map((node) => node.id)) // Output: ['1-1', '1-1.5', '1-2']
```

#### remove

**Function**: Removes all nodes in the tree that meet the condition

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Original tree or forest
- `predicate`: (node: TreeNode) => boolean - Predicate function to locate nodes to remove
- `options`: BaseOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'

**Return Value**: null | TreeNode | TreeNode[] - New tree (returns original tree if no nodes to remove)

**Example**:

```js
import { remove } from '@suzilong/tree'

const tree = { id: '1', children: [{ id: '1-1' }, { id: '1-2' }] }

const newTree = remove(tree, (node) => node.id === '1-1')
console.log(newTree.children.map((node) => node.id)) // Output: ['1-2']
```

#### replace

**Function**: Replaces all nodes in the tree that meet the condition

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Original tree or forest
- `predicate`: (node: TreeNode) => boolean - Predicate function to locate nodes to replace
- `newNode`: TreeNode - New node
- `options`: BaseOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'

**Return Value**: TreeNode | TreeNode[] - New tree (returns original tree if no nodes to replace)

**Example**:

```js
import { replace } from '@suzilong/tree'

const tree = { id: '1', children: [{ id: '1-1' }, { id: '1-2' }] }

const newTree = replace(tree, (node) => node.id === '1-1', { id: '1-1-new' })
console.log(newTree.children.map((node) => node.id)) // Output: ['1-1-new', '1-2']
```

#### move

**Function**: Moves a node to the child node list of another node (as the last child), only operates on the first matching source node and target node

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Original tree or forest
- `sourcePredicate`: (node: TreeNode) => boolean - Predicate function to locate the node to move (only uses the first matching node)
- `targetPredicate`: (node: TreeNode) => boolean - Predicate function to locate the target parent node (only uses the first matching node)
- `options`: BaseOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'

**Return Value**: TreeNode | TreeNode[] - New tree (returns original tree if source node or target node not found)

**Example**:

```js
import { move } from '@suzilong/tree'

const tree = {
    id: '1',
    children: [{ id: '1-1' }, { id: '1-2', children: [] }],
}

const newTree = move(
    tree,
    (node) => node.id === '1-1',
    (node) => node.id === '1-2'
)
console.log(newTree.children[0].children.map((node) => node.id)) // Output: ['1-1']
```

#### swap

**Function**: Swaps the positions of two nodes in the tree, only operates on the first matching nodes

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Original tree or forest
- `predicate1`: (node: TreeNode) => boolean - Predicate function to locate the first node
- `predicate2`: (node: TreeNode) => boolean - Predicate function to locate the second node
- `options`: BaseOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'

**Return Value**: TreeNode | TreeNode[] - New tree (returns original tree if nodes not found or cannot be swapped)

**Example**:

```js
import { swap } from '@suzilong/tree'

const tree = {
    id: '1',
    children: [
        { id: 'A', value: 1 },
        { id: 'B', value: 2 },
    ],
}

const newTree = swap(
    tree,
    (node) => node.id === 'A',
    (node) => node.id === 'B'
)
console.log(newTree.children.map((node) => node.value)) // Output: [2, 1]
```

### 4. Transformation (transform)

#### arrayToTree

**Function**: Converts a flat array to a tree structure

**Parameters**:

- `array`: any[] - Flat array
- `options`: ArrayToTreeOptions - Configuration options
    - `idKey`: string - Node unique identifier field name, default is 'id'
    - `parentIdKey`: string - Parent node identifier field name, default is 'parentId'
    - `childrenKey`: string - Child node array field name, default is 'children'
    - `rootParentValue`: null | undefined | string | number - Root node parent identifier value, default is null or undefined

**Return Value**: TreeNode[] - Converted tree structure (forest)

**Example**:

```js
import { arrayToTree } from '@suzilong/tree'

const array = [
    { id: '1', name: 'Node 1', parentId: null },
    { id: '2', name: 'Node 2', parentId: '1' },
]

const tree = arrayToTree(array)
console.log(tree[0].children.length) // Output: 1
```

#### treeToArray

**Function**: Converts a tree structure to a flat array

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `options`: TreeToArrayOptions - Configuration options
    - `idKey`: string - Node unique identifier field name, default is 'id'
    - `parentIdKey`: string - Parent node identifier field name in output, default is 'parentId'
    - `childrenKey`: string - Custom child node field name, default is 'children'
    - `rootParentValue`: null | undefined | string | number - Root node parent identifier value, default is null
    - `keepChildren`: boolean - Whether to keep child node array in output, default is false (remove children)
    - `strategy`: 'dfs' | 'bfs' - Traversal strategy, default is 'dfs'
    - `order`: 'pre' | 'post' - Traversal order, only valid for dfs, default is 'pre'

**Return Value**: any[] - Converted flat array

**Example**:

```js
import { treeToArray } from '@suzilong/tree'

const tree = [{ id: '1', children: [{ id: '1-1' }, { id: '1-2' }] }]

const array = treeToArray(tree)
console.log(array.map((item) => item.id)) // Output: ['1', '1-1', '1-2']
```

#### map

**Function**: Executes a mapping function on each node in the tree, returns a new tree

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `callback`: (node: TreeNode, context: Context) => TreeNode - Mapping function, returns new node
- `options`: Options - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'
    - `strategy`: 'dfs' | 'bfs' - Traversal strategy, default is 'dfs'
    - `order`: 'pre' | 'post' - Only valid for depth-first traversal, default is 'pre'

**Return Value**: TreeNode | TreeNode[] - New mapped tree

**Example**:

```js
import { map } from '@suzilong/tree'

const tree = { id: '1', value: 10, children: [{ id: '1-1', value: 20 }] }

const newTree = map(tree, (node) => ({
    ...node,
    value: node.value * 2,
}))
console.log(newTree.value) // Output: 20
```

#### filter

**Function**: Filters nodes in the tree, returns a new tree

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `callback`: (node: TreeNode, context: Context) => boolean - Filter function, returns true to keep node
- `options`: Options - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'
    - `strategy`: 'dfs' | 'bfs' - Traversal strategy, default is 'dfs'
    - `order`: 'pre' | 'post' - Only valid for depth-first traversal, default is 'pre'

**Return Value**: TreeNode | TreeNode[] - New filtered tree

**Example**:

```js
import { filter } from '@suzilong/tree'

const tree = {
    id: '1',
    type: 'parent',
    children: [
        { id: '1-1', type: 'child' },
        { id: '1-2', type: 'parent' },
    ],
}

const filteredTree = filter(tree, (node) => node.type === 'parent')
console.log(filteredTree.children.length) // Output: 1
```

#### reduce

**Function**: Executes a reduce function on nodes in the tree, returns the accumulated result

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `callback`: (accumulator: any, node: TreeNode, context: Context) => any - Reduce function
- `initialValue`: any - Initial accumulated value
- `options`: Options - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'
    - `strategy`: 'dfs' | 'bfs' - Traversal strategy, default is 'dfs'
    - `order`: 'pre' | 'post' - Only valid for depth-first traversal, default is 'pre'

**Return Value**: any - Reduced result

**Example**:

```js
import { reduce } from '@suzilong/tree'

const tree = { id: '1', value: 10, children: [{ id: '1-1', value: 20 }] }

const sum = reduce(tree, (acc, node) => acc + node.value, 0)
console.log(sum) // Output: 30
```

#### flat

**Function**: Flattens a tree structure into an array of nodes

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `options`: Options - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'
    - `strategy`: 'dfs' | 'bfs' - Traversal strategy, default is 'dfs'
    - `order`: 'pre' | 'post' - Only valid for depth-first traversal, default is 'pre'

**Return Value**: TreeNode[] - Flattened node array

**Example**:

```js
import { flat } from '@suzilong/tree'

const tree = { id: '1', children: [{ id: '1-1' }, { id: '1-2' }] }

const nodes = flat(tree)
console.log(nodes.map((node) => node.id)) // Output: ['1', '1-1', '1-2']
```

### 5. Query (query)

#### getCount

**Function**: Gets the number of nodes in the tree

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `options`: BaseOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'

**Return Value**: number - Number of nodes

**Example**:

```js
import { getCount } from '@suzilong/tree'

const tree = { id: '1', children: [{ id: '1-1' }, { id: '1-2' }] }

const count = getCount(tree)
console.log(count) // Output: 3
```

#### getLeafCount

**Function**: Gets the number of leaf nodes in the tree

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `options`: BaseOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'

**Return Value**: number - Number of leaf nodes

**Example**:

```js
import { getLeafCount } from '@suzilong/tree'

const tree = { id: '1', children: [{ id: '1-1' }, { id: '1-2' }] }

const leafCount = getLeafCount(tree)
console.log(leafCount) // Output: 2
```

#### getDepth

**Function**: Gets the depth of the tree

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `options`: BaseOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'

**Return Value**: number - Tree depth

**Example**:

```js
import { getDepth } from '@suzilong/tree'

const tree = { id: '1', children: [{ id: '1-1' }, { id: '1-2' }] }

const depth = getDepth(tree)
console.log(depth) // Output: 2
```

#### getAncestors

**Function**: Gets all ancestor nodes of the specified node

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `predicate`: (node: TreeNode) => boolean - Predicate function to locate the target node
- `options`: BaseOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'

**Return Value**: TreeNode[] - Ancestor node array (from root to parent node)

**Example**:

```js
import { getAncestors } from '@suzilong/tree'

const tree = { id: '1', children: [{ id: '1-1' }, { id: '1-2' }] }

const ancestors = getAncestors(tree, (node) => node.id === '1-1')
console.log(ancestors.map((node) => node.id)) // Output: ['1']
```

#### getDescendants

**Function**: Gets all descendant nodes of the specified node

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `predicate`: (node: TreeNode) => boolean - Predicate function to locate the target node
- `options`: Options - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'
    - `strategy`: 'dfs' | 'bfs' - Traversal strategy, default is 'dfs'
    - `order`: 'pre' | 'post' - Only valid for depth-first traversal, default is 'pre'

**Return Value**: TreeNode[] - Descendant node array

**Example**:

```js
import { getDescendants } from '@suzilong/tree'

const tree = { id: '1', children: [{ id: '1-1' }, { id: '1-2' }] }

const descendants = getDescendants(tree, (node) => node.id === '1')
console.log(descendants.map((node) => node.id)) // Output: ['1-1', '1-2']
```

#### getSiblings

**Function**: Gets all sibling nodes of the specified node (excluding itself)

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `predicate`: (node: TreeNode) => boolean - Predicate function to locate the target node
- `options`: BaseOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'

**Return Value**: TreeNode[] - Sibling node array

**Example**:

```js
import { getSiblings } from '@suzilong/tree'

const tree = {
    id: '1',
    children: [{ id: '1-1' }, { id: '1-2' }, { id: '1-3' }],
}

const siblings = getSiblings(tree, (node) => node.id === '1-2')
console.log(siblings.map((node) => node.id)) // Output: ['1-1', '1-3']
```

#### getParent

**Function**: Gets the parent node of the specified node

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `predicate`: (node: TreeNode) => boolean - Predicate function to locate the target node
- `options`: BaseOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'

**Return Value**: TreeNode | null - Parent node, returns null if the target doesn't exist or is a root node

**Example**:

```js
import { getParent } from '@suzilong/tree'

const tree = { id: '1', children: [{ id: '1-1' }, { id: '1-2' }] }

const parent = getParent(tree, (node) => node.id === '1-1')
console.log(parent?.id) // Output: '1'
```

#### getChildren

**Function**: Gets all child nodes of the specified node

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `predicate`: (node: TreeNode) => boolean - Predicate function to locate the target node
- `options`: BaseOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'

**Return Value**: TreeNode[] - Child node array, returns empty array if the target doesn't exist or has no children

**Example**:

```js
import { getChildren } from '@suzilong/tree'

const tree = { id: '1', children: [{ id: '1-1' }, { id: '1-2' }] }

const children = getChildren(tree, (node) => node.id === '1')
console.log(children.map((node) => node.id)) // Output: ['1-1', '1-2']
```

### 6. Other (other)

#### clone

**Function**: Deep copies the tree structure

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `options`: BaseOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'

**Return Value**: TreeNode | TreeNode[] - New copied tree

**Example**:

```js
import { clone } from '@suzilong/tree'

const tree = { id: '1', children: [{ id: '1-1' }] }

const clonedTree = clone(tree)
console.log(clonedTree !== tree && clonedTree.children !== tree.children) // Output: true
```

#### every

**Function**: Checks if all nodes in the tree meet the condition

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `callback`: (node: TreeNode, context: Context) => boolean - Condition function
- `options`: Options - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'
    - `strategy`: 'dfs' | 'bfs' - Traversal strategy, default is 'dfs'
    - `order`: 'pre' | 'post' - Only valid for depth-first traversal, default is 'pre'

**Return Value**: boolean - Returns true if all nodes meet the condition, otherwise false

**Example**:

```js
import { every } from '@suzilong/tree'

const tree = { id: '1', type: 'node', children: [{ id: '1-1', type: 'node' }] }

const allNodes = every(tree, (node) => node.type === 'node')
console.log(allNodes) // Output: true
```

#### some

**Function**: Checks if at least one node in the tree meets the condition

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `callback`: (node: TreeNode, context: Context) => boolean - Condition function
- `options`: Options - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'
    - `strategy`: 'dfs' | 'bfs' - Traversal strategy, default is 'dfs'
    - `order`: 'pre' | 'post' - Only valid for depth-first traversal, default is 'pre'

**Return Value**: boolean - Returns true if at least one node meets the condition, otherwise false

**Example**:

```js
import { some } from '@suzilong/tree'

const tree = {
    id: '1',
    type: 'parent',
    children: [{ id: '1-1', type: 'child' }],
}

const hasChild = some(tree, (node) => node.type === 'child')
console.log(hasChild) // Output: true
```

#### print

**Function**: Prints the tree in the console for debugging, similar to the Linux tree command

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `options`: Options - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'

**Return Value**: None

**Example**:

```js
import { print } from '@suzilong/tree'

const tree = { id: '1', children: [{ id: '1-1' }] }

print(tree)
// Output:
// └── 1
//     └── 1-1
```

### 7. Relationship (is)

#### isSibling

**Function**: Determines if two nodes are brothers (i.e., have the same parent)

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `predicateA`: (node: TreeNode) => boolean - Predicate function to locate the first node
- `predicateB`: (node: TreeNode) => boolean - Predicate function to locate the second node
- `options`: BaseOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'

**Return Value**: boolean - Returns true if the nodes are brothers, otherwise false

**Example**:

```js
import { isSibling } from '@suzilong/tree'

const tree = {
    id: '1',
    children: [{ id: '2' }, { id: '3' }, { id: '4' }],
}

const areBrothers = isSibling(
    tree,
    (node) => node.id === 2,
    (node) => node.id === 3
)
console.log(areBrothers) // Output: true
```

#### isAncestorOf

**Function**: Determines if ancestor node is an ancestor of descendant node (i.e., ancestor is on the path from root to descendant)

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `ancestorPredicate`: (node: TreeNode) => boolean - Predicate function to locate the ancestor node
- `descendantPredicate`: (node: TreeNode) => boolean - Predicate function to locate the descendant node
- `options`: BaseOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'

**Return Value**: boolean - Returns true if the ancestor relationship exists, otherwise false

**Example**:

```js
import { isAncestorOf } from '@suzilong/tree'

const tree = { id: '1', children: [{ id: '1-1', children: [{ id: '1-1-1' }] }] }

const isRootAncestor = isAncestorOf(
    tree,
    (node) => node.id === '1',
    (node) => node.id === '1-1-1'
)
console.log(isRootAncestor) // Output: true
```

#### isDescendantOf

**Function**: Determines if descendant node is a descendant of ancestor node (i.e., descendant is in the subtree of ancestor)

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `descendantPredicate`: (node: TreeNode) => boolean - Predicate function to locate the descendant node
- `ancestorPredicate`: (node: TreeNode) => boolean - Predicate function to locate the ancestor node
- `options`: BaseOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'

**Return Value**: boolean - Returns true if the descendant relationship exists, otherwise false

**Example**:

```js
import { isDescendantOf } from '@suzilong/tree'

const tree = { id: '1', children: [{ id: '1-1', children: [{ id: '1-1-1' }] }] }

const isLeafDescendant = isDescendantOf(
    tree,
    (node) => node.id === '1-1-1',
    (node) => node.id === '1'
)
console.log(isLeafDescendant) // Output: true
```

#### isParentOf

**Function**: Determines if parent node is the direct parent of child node

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `parentPredicate`: (node: TreeNode) => boolean - Predicate function to locate the parent node
- `childPredicate`: (node: TreeNode) => boolean - Predicate function to locate the child node
- `options`: BaseOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'

**Return Value**: boolean - Returns true if it's a direct parent-child relationship, otherwise false

**Example**:

```js
import { isParentOf } from '@suzilong/tree'

const tree = { id: '1', children: [{ id: '1-1', children: [{ id: '1-1-1' }] }] }

const isDirectParent = isParentOf(
    tree,
    (node) => node.id === '1',
    (node) => node.id === '1-1'
)
console.log(isDirectParent) // Output: true
```

#### isChildOf

**Function**: Determines if child node is the direct child of parent node

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `childPredicate`: (node: TreeNode) => boolean - Predicate function to locate the child node
- `parentPredicate`: (node: TreeNode) => boolean - Predicate function to locate the parent node
- `options`: BaseOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'

**Return Value**: boolean - Returns true if it's a direct parent-child relationship, otherwise false

**Example**:

```js
import { isChildOf } from '@suzilong/tree'

const tree = { id: '1', children: [{ id: '1-1', children: [{ id: '1-1-1' }] }] }

const isDirectChild = isChildOf(
    tree,
    (node) => node.id === '1-1',
    (node) => node.id === '1'
)
console.log(isDirectChild) // Output: true
```

#### isRoot

**Function**: Determines if a node is a root node (i.e., has no parent)

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `predicate`: (node: TreeNode) => boolean - Predicate function to locate the node
- `options`: BaseOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'

**Return Value**: boolean - Returns true if the node is a root node, otherwise false

**Example**:

```js
import { isRoot } from '@suzilong/tree'

const tree = { id: '1', children: [{ id: '1-1' }] }

const isRootNode = isRoot(tree, (node) => node.id === '1')
console.log(isRootNode) // Output: true
```

#### isLeaf

**Function**: Determines if a node is a leaf node (i.e., has no child nodes)

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `predicate`: (node: TreeNode) => boolean - Predicate function to locate the node
- `options`: BaseOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'

**Return Value**: boolean - Returns true if the node is a leaf node, otherwise false

**Example**:

```js
import { isLeaf } from '@suzilong/tree'

const tree = { id: '1', children: [{ id: '1-1' }] }

const isLeafNode = isLeaf(tree, (node) => node.id === '1-1')
console.log(isLeafNode) // Output: true
```

#### isSameDepth

**Parameters**:

- `tree`: TreeNode | TreeNode[] - Tree or forest
- `predicateA`: (node: TreeNode) => boolean - Predicate function to locate the first node
- `predicateB`: (node: TreeNode) => boolean - Predicate function to locate the second node
- `options`: BaseOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'

**Return Value**: boolean - Returns true if both nodes are at the same depth, otherwise false

**Example**:

```js
import { isSameDepth } from '@suzilong/tree'

const tree = { id: '1', children: [{ id: '1-1' }, { id: '1-2' }] }

const sameDepth = isSameDepth(
    tree,
    (node) => node.id === '1-1',
    (node) => node.id === '1-2'
)
console.log(sameDepth) // Output: true
```

#### isEqual

**Function**: Compares two trees for equality using a custom comparison function

**Parameters**:

- `tree1`: TreeNode | TreeNode[] - First tree or forest
- `tree2`: TreeNode | TreeNode[] - Second tree or forest
- `compare`: (node1: TreeNode, node2: TreeNode) => boolean - Node comparison function
- `options`: BaseOptions - Configuration options
    - `childrenKey`: string - Custom child node field name, default is 'children'

**Return Value**: boolean - Returns true if both trees have the same structure and all corresponding nodes satisfy the comparison function, otherwise false

**Example**:

```js
import { isEqual } from '@suzilong/tree'

const tree1 = { id: '1', children: [{ id: '1-1', value: 10 }] }
const tree2 = { id: '1', children: [{ id: '1-1', value: 99 }] }

const equalById = isEqual(tree1, tree2, (n1, n2) => n1.id === n2.id)
console.log(equalById) // Output: true
```

## Type Definitions

### TreeNode

```typescript
type TreeNode<T = unknown, ChildKey extends string = 'children'> = {
    [key: string]: unknown // Allow any other properties
} & {
    [K in ChildKey]?: TreeNode<T, ChildKey>[] // Dynamic child node field
}
```

### Context

```typescript
interface Context {
    index: number // Current node's position among siblings (starting from 0)
    depth: number // Current node depth (root node is 0)
    parent: TreeNode | null // Parent node, root node is null
    path: TreeNode[] // Path from root to current node
}
```

### Options

```typescript
interface Options extends BaseOptions {
    strategy?: 'dfs' | 'bfs' // Traversal strategy, default is 'dfs' (depth-first), optional 'bfs' (breadth-first)
    order?: 'pre' | 'post' // Only valid for depth-first traversal, default is 'pre' (pre-order), optional 'post' (post-order)
}
```

### BaseOptions

```typescript
interface BaseOptions {
    childrenKey?: string // Custom child node field name, default is 'children'
}
```

### ArrayToTreeOptions

```typescript
interface ArrayToTreeOptions {
    /** Node unique identifier field name, default is 'id' */
    idKey?: string
    /** Parent node identifier field name, default is 'parentId' */
    parentIdKey?: string
    /** Child node array field name, default is 'children' */
    childrenKey?: string
    /** Root node parent identifier value, default is null or undefined */
    rootParentValue?: null | undefined | string | number
}
```

### TreeToArrayOptions

```typescript
interface TreeToArrayOptions {
    /** Node unique identifier field name, default is 'id' */
    idKey?: string
    /** Parent node identifier field name in output, default is 'parentId' */
    parentIdKey?: string
    /** Custom child node field name, default is 'children' */
    childrenKey?: string
    /** Root node parent identifier value, default is null */
    rootParentValue?: null | undefined | string | number
    /** Whether to keep child node array in output, default is false (remove children) */
    keepChildren?: boolean
    /** Traversal strategy, default is 'dfs' */
    strategy?: 'dfs' | 'bfs'
    /** Traversal order, only valid for dfs, default is 'pre' */
    order?: 'pre' | 'post'
}
```
