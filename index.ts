import { print, remove, TreeNode } from './src/index'

const forest: TreeNode[] = [
    { id: 1, children: [{ id: 2 }, { id: 3 }] },
    { id: 4, children: [{ id: 5 }] },
]
debugger
const newForest = remove(forest, (node) => node.id === 2 || node.id === 5)

print(forest)
print(newForest)
