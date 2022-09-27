import { TRACK_TYPES } from './constants'
import {
  CustomDimension,
  TrackEventParams,
  TrackLinkParams,
  TrackPageViewParams,
  TrackParams,
  TrackSiteSearchParams,
  UserOptions,
} from './types'

class PiwikTracker {
  mutationObserver?: MutationObserver

  constructor(userOptions: UserOptions) {
    if (!userOptions.urlBase) {
      throw new Error('Piwik urlBase is required.')
    }
    if (!userOptions.siteId) {
      throw new Error('Piwik siteId is required.')
    }

    this.initialize(userOptions)
  }

  private initialize({
    urlBase,
    siteId,
    userId,
    trackerUrl,
    srcUrl,
    disabled,
    heartBeat,
    linkTracking = true,
    configurations = {},
  }: UserOptions) {
    const normalizedUrlBase =
      urlBase[urlBase.length - 1] !== '/' ? `${urlBase}/` : urlBase

    if (typeof window === 'undefined') {
      return
    }

    window._paq = window._paq || []

    if (window._paq.length !== 0) {
      return
    }

    if (disabled) {
      return
    }

    this.pushInstruction(
      'setTrackerUrl',
      trackerUrl ?? `${normalizedUrlBase}ppms.php`,
    )

    this.pushInstruction('setSiteId', siteId)

    if (userId) {
      this.pushInstruction('setUserId', userId)
    }

    Object.entries(configurations).forEach(([name, instructions]) => {
      if (instructions instanceof Array) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this.pushInstruction(name, ...instructions)
      } else {
        this.pushInstruction(name, instructions)
      }
    })

    // accurately measure the time spent on the last pageview of a visit
    if (!heartBeat || (heartBeat && heartBeat.active)) {
      this.enableHeartBeatTimer((heartBeat && heartBeat.seconds) ?? 15)
    }

    // // measure outbound links and downloads
    // // might not work accurately on SPAs because new links (dom elements) are created dynamically without a server-side page reload.
    this.enableLinkTracking(linkTracking)

    const doc = document
    const scriptElement = doc.createElement('script')
    const scripts = doc.getElementsByTagName('script')[0]

    scriptElement.type = 'text/javascript'
    scriptElement.async = true
    scriptElement.defer = true
    scriptElement.src = srcUrl || `${normalizedUrlBase}piwik.js`

    if (scripts && scripts.parentNode) {
      scripts.parentNode.insertBefore(scriptElement, scripts)
    }
  }

  enableHeartBeatTimer(seconds: number): void {
    this.pushInstruction('enableHeartBeatTimer', seconds)
  }

  enableLinkTracking(active: boolean): void {
    this.pushInstruction('enableLinkTracking', active)
  }

  // Tracks events
  // https://developers.piwik.pro/en/latest/data_collection/web/javascript_tracking_client/api.html#trackEvent
  trackEvent({
    category,
    action,
    name,
    value,
    ...otherParams
  }: TrackEventParams): void {
    if (category && action) {
      this.track({
        data: [TRACK_TYPES.TRACK_EVENT, category, action, name, value],
        ...otherParams,
      })
    } else {
      throw new Error(`Error: category and action are required.`)
    }
  }

  // Tracks site search
  // https://developers.piwik.pro/en/latest/data_collection/web/javascript_tracking_client/api.html#trackSiteSearch
  trackSiteSearch({
    keyword,
    category,
    count,
    ...otherParams
  }: TrackSiteSearchParams): void {
    if (keyword) {
      this.track({
        data: [TRACK_TYPES.TRACK_SEARCH, keyword, category, count],
        ...otherParams,
      })
    } else {
      throw new Error(`Error: keyword is required.`)
    }
  }

  // Tracks outgoing links to other sites and downloads
  // https://developers.piwik.pro/en/latest/data_collection/web/javascript_tracking_client/api.html#trackLink
  trackLink({ href, linkType = 'link' }: TrackLinkParams): void {
    this.pushInstruction(TRACK_TYPES.TRACK_LINK, href, linkType)
  }

  // Tracks page views
  // https://developers.piwik.pro/en/latest/data_collection/web/javascript_tracking_client/api.html#trackPageView
  trackPageView(params?: TrackPageViewParams): void {
    this.track({ data: [TRACK_TYPES.TRACK_VIEW], ...params })
  }

  // Sends the tracked page/view/search to Piwik
  track({
    data = [],
    documentTitle = window.document.title,
    href,
    customDimensions = false,
  }: TrackParams): void {
    if (data.length) {
      if (
        customDimensions &&
        Array.isArray(customDimensions) &&
        customDimensions.length
      ) {
        customDimensions.map((customDimension: CustomDimension) =>
          this.pushInstruction(
            'setCustomDimensionValue',
            customDimension.id,
            customDimension.value,
          ),
        )
      }

      this.pushInstruction('setCustomUrl', href ?? window.location.href)
      this.pushInstruction('setDocumentTitle', documentTitle)
      this.pushInstruction(...(data as [string, ...any[]]))
    }
  }

  /**
   * Pushes an instruction to Piwik for execution, this is equivalent to pushing entries into the `_paq` array.
   *
   * For example:
   *
   * ```ts
   * pushInstruction('setDocumentTitle', document.title)
   * ```
   * Is the equivalent of:
   *
   * ```ts
   * _paq.push(['setDocumentTitle', document.title]);
   * ```
   *
   * @param name The name of the instruction to be executed.
   * @param args The arguments to pass along with the instruction.
   */
  pushInstruction(name: string, ...args: any[]): PiwikTracker {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line
      window._paq.push([name, ...args])
    }

    return this
  }
}

export default PiwikTracker
