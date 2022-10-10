import { useCallback, useContext } from 'react'
import PiwikContext from './PiwikContext'
import {
  TrackEventParams,
  TrackLinkParams,
  TrackPageViewParams,
  TrackSiteSearchParams,
} from './types'
import useOutboundClickListener from './utils/useOutboundClickListener'

function usePiwik() {
  const instance = useContext(PiwikContext)

  const trackPageView = useCallback(
    (params?: TrackPageViewParams) => instance?.trackPageView(params),
    [instance],
  )

  const trackEvent = useCallback(
    (params: TrackEventParams) => instance?.trackEvent(params),
    [instance],
  )

  const trackSiteSearch = useCallback(
    (params: TrackSiteSearchParams) => instance?.trackSiteSearch(params),
    [instance],
  )

  const trackLink = useCallback(
    (params: TrackLinkParams) => instance?.trackLink(params),
    [instance],
  )

  const enableLinkTracking = useCallback(() => {
    if (instance) {
      useOutboundClickListener(instance)
    }
  }, [instance])

  const pushInstruction = useCallback(
    (name: string, ...args: any[]) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      instance?.pushInstruction(name, ...args)
    },
    [instance],
  )

  return {
    trackEvent,
    trackPageView,
    trackSiteSearch,
    trackLink,
    enableLinkTracking,
    pushInstruction,
  }
}

export default usePiwik
