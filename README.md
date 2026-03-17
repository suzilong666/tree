# tree

一个功能全面的树结构操作库，提供遍历、查找、转换、查询、修改等数十种方法，支持深度优先(前序，后序)、广度优先遍历，自定义子节点字段，纯函数无副作用等特性。

## 特性

- 🚀 全面：涵盖树操作的常见场景
- 🔒 不可变：所有操作均返回新树，不修改原数据
- 🎯 灵活：支持自定义子节点字段名、遍历策略（DFS/BFS）和遍历顺序（前序，后序）
- 📦 轻量：无依赖，纯 TypeScript 编写，类型安全
- 🌲 支持森林：可以处理多根节点的树（森林）
- 🛡️ 健壮：防御性编程，处理各种边界情况

## 安装

```bash
npm i @suzilong/tree
# 或
yarn add @suzilong/tree
# 或
pnpm i @suzilong/tree
```

使用示例

```js
import { forEach } from '@suzilong/tree'

const data = [
    {
        id: '1',
        children: [
            {
                id: '1-1',
                children: [
                    {
                        id: '1-1-1',
                    },
                ],
            },
        ],
    },
    {
        id: '2',
    },
]

forEach(data, (item) => {
    console.log(item)
})
```
