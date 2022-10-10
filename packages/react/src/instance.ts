import PiwikTracker from '@amsterdam/piwik-tracker'
import { InstanceParams } from './types'

function createInstance(params: InstanceParams): PiwikTracker {
  return new PiwikTracker(params)
}

export default createInstance
