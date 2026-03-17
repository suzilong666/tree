import * as find from './find/index'
import * as modify from './modify/index'
import * as orther from './orther/index'
import * as query from './query/index'
import * as transform from './transform/index'
import * as traverse from './traverse/index'

const tree = {
    ...find,
    ...modify,
    ...orther,
    ...query,
    ...transform,
    ...traverse,
}

export default tree

// 命名导出：让用户按需导入
export * from './find/index'
export * from './modify/index'
export * from './orther/index'
export * from './query/index'
export * from './transform/index'
export * from './traverse/index'

export type * from './types'
