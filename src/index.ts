import * as traverse from './traverse/index'
import * as find from './find/index'
import * as transform from './transform/index'
import * as get from './get/index'

const tree = {
    ...traverse,
    ...find,
    ...transform,
    ...get,
}

export default tree

export type * from './types'
