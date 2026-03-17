import * as traverse from './traverse/index'
import * as find from './find/index'
import * as transform from './transform/index'
import * as query from './query/index'

const tree = {
    ...traverse,
    ...find,
    ...transform,
    ...query,
}

export default tree

export type * from './types'
