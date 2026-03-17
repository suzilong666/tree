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

export type * from './types'
