import PiwikTracker from './PiwikTracker'
import * as types from './types'

declare global {
  interface Window {
    _paq: any[]
  }
}

export default PiwikTracker

export { types }
