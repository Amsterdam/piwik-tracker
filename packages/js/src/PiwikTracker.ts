import { CUSTOM_EVENTS, TRACK_TYPES } from './constants'
import {
  CustomDimension,
  TrackEventParams,
  TrackLinkParams,
  TrackPageViewParams,
  TrackParams,
  TrackSiteSearchParams,
  TrackSiteSearchResultClick,
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

    // accurately measure the time spent on the last pageview of a visit
    if (!heartBeat || (heartBeat && heartBeat.active)) {
      this.enableHeartBeatTimer((heartBeat && heartBeat.seconds) ?? 15)
    }

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

  // Tracks events
  // https://developers.piwik.pro/en/latest/data_collection/web/javascript_tracking_client/api.html#trackEvent
  // trackEvent({
  //   category,
  //   action,
  //   name,
  //   value,
  //   ...otherParams
  // }: TrackEventParams): void {
  //   if (category && action) {
  //     this.track({
  //       data: [TRACK_TYPES.TRACK_EVENT, category, action, name, value],
  //       ...otherParams,
  //     })
  //   } else {
  //     throw new Error(`Error: category and action are required.`)
  //   }
  // }

  // Tracks site search
  trackSiteSearch({
    keyword,
    count,
    type,
    searchMachine,
  }: TrackSiteSearchParams) {
    if (keyword && keyword.length > 3) {
      this.pushCustomInstruction({
        event: CUSTOM_EVENTS.TRACK_SEARCH,
        meta: {
          search_term: keyword,
          search_result_amount: count,
          search_type: type,
          search_machine: searchMachine,
        },
      })
    } else {
      throw new Error('Error: keyword should atleast be three characters long.')
    }
  }

  trackSiteSearchResultClick({
    keyword,
    searchResult: { title, url, type: resultType, position },
    amountOfResults,
    amountOfResultsShown,
    type,
  }: TrackSiteSearchResultClick) {
    if (keyword.length < 3) {
      throw new Error('Error: keyword should be atleast three characters long.')
    }

    let parsedUrl = url

    if (parsedUrl.includes('?')) {
      parsedUrl = parsedUrl.substring(0, parsedUrl.indexOf('?'))
    }

    this.pushCustomInstruction({
      event: CUSTOM_EVENTS.TRACK_SEARCH_RESULT,
      meta: {
        search_term: keyword,
        search_result_title: title,
        search_result_url: parsedUrl,
        search_result_type: resultType,
        search_result_selected: position,
        search_result_shown: amountOfResultsShown,
        search_result_amount: amountOfResults,
        search_type: type,
      },
    })
  }

  // Tracks outgoing links to other sites and downloads
  trackLink({ href, linkTitle }: TrackLinkParams) {
    this.pushCustomInstruction({
      event: CUSTOM_EVENTS.TRACK_LINK,
      meta: {
        category: CUSTOM_EVENTS.TRACK_LINK,
        action: `${linkTitle} - ${href}`,
        label: window.location.pathname,
      },
    })
  }

  // Tracks page views
  trackPageView(params: TrackPageViewParams) {
    this.pushCustomInstruction({
      event: CUSTOM_EVENTS.TRACK_VIEW,
      meta: { vpv_url: params.href },
    })
  }

  // Sends the tracked page/view/search to Piwik
  // track({
  //   data = [],
  //   documentTitle = window.document.title,
  //   href,
  //   customDimensions = false,
  // }: TrackParams): void {
  //   if (data.length) {
  //     if (
  //       customDimensions &&
  //       Array.isArray(customDimensions) &&
  //       customDimensions.length
  //     ) {
  //       customDimensions.map((customDimension: CustomDimension) =>
  //         this.pushInstruction(
  //           'setCustomDimensionValue',
  //           customDimension.id,
  //           customDimension.value,
  //         ),
  //       )
  //     }

  //     this.pushInstruction('setCustomUrl', href ?? window.location.href)
  //     this.pushInstruction('setDocumentTitle', documentTitle)
  //     this.pushInstruction(...(data as [string, ...any[]]))
  //   }
  // }

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

  pushCustomInstruction(instruction: Record<string, any>) {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line
      window._paq.push(instruction)
    }

    return this
  }
}

export default PiwikTracker
