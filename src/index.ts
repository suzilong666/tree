import * as traverse from './traverse/index'
import * as find from './find/index'
import * as transform from './transform/index'

const tree = {
    ...traverse,
    ...find,
    ...transform,
}

export default tree

export type * from './types'
