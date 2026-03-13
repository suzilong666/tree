import Tree from '../src/index.ts'

const treeData = [
    {
        key: '0',
        children: [
            {
                key: '0-0',
            },
            {
                key: '0-1',
            },
            {
                key: '0-2',
            },
        ],
    },
    {
        key: '1',
        children: [
            {
                key: '1-0',
            },
            {
                key: '1-1',
            },
            {
                key: '1-2',
            },
        ],
    },
]

Tree.depthFirst(treeData, (node) => {
    console.log(node)
})
