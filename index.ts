import { appendChild, print, TreeNode } from './src/index'

const originalTree: TreeNode = {
    id: 1,
    name: 'root',
    children: [
        { id: 2, name: 'a', children: [{ id: 4, name: 'a1' }] },
        { id: 3, name: 'b' },
    ],
}

const newNode = { id: 5, name: 'new' }
const newTree = appendChild(originalTree, (node) => node.id === 2, newNode)

print(originalTree)
print(newTree)
