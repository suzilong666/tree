import tree from './src/index'

const data = [
    { id: 1, name: 'First', parentId: null },
    { id: 1, name: 'Second', parentId: null },
]

const res = tree.arrayToTree(data)

console.log(res)
