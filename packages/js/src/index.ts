import PiwikTracker from './PiwikTracker'
import * as types from './types'

declare global {
  interface Window {
    _paq: [string, ...any[]][]
  }
}

export default PiwikTracker

export { types }
