import useDomain from './src/useDomain'
import toCQRSWithHash from './src/toCQRSWithHash'
import {command, query, hashable} from './src/decorators'

export default useDomain
export {toCQRSWithHash, command, query, hashable}
