import { CUSTOM_EVENTS } from './constants';
import initializeDatalayer from './datalayer';
import {
  CustomDimension,
  Instruction,
  TrackDownloadParams,
  TrackLinkParams,
  TrackPageViewParams,
  TrackSiteSearchParams,
  TrackSiteSearchResultClickParams,
  UserOptions,
  type TrackAnchorLinkParams,
  type TrackLinkClickParams,
  type TrackMapInteractionParams,
  type TrackVisibilityParams,
} from './types';

class PiwikTracker {
  constructor(userOptions: UserOptions) {
    if (!userOptions.siteId) {
      throw new Error('Piwik siteId is required.');
    }

    this.initialize(userOptions);
  }

  private initialize({
    urlBase,
    siteId,
    disabled,
    heartBeat,
    nonce,
  }: UserOptions) {
    if (typeof window === 'undefined') {
      return;
    }

    window._paq = window._paq || [];

    if (window._paq.length !== 0) {
      return;
    }

    if (disabled) {
      return;
    }

    // accurately measure the time spent on the last pageview of a visit
    if (!heartBeat || (heartBeat && heartBeat.active)) {
      this.enableHeartBeatTimer((heartBeat && heartBeat.seconds) ?? 15);
    }

    initializeDatalayer(siteId, urlBase, nonce);
  }

  enableHeartBeatTimer(seconds: number): void {
    this.pushInstruction('enableHeartBeatTimer', seconds);
  }

  // Tracks site search
  trackSiteSearch({
    keyword,
    count,
    type,
    searchMachine,
    customDimensions,
  }: TrackSiteSearchParams) {
    if (keyword && keyword.length > 3) {
      this.pushCustomInstructionWithCustomDimensions(
        {
          event: CUSTOM_EVENTS.TRACK_SEARCH,
          meta: {
            search_term: keyword,
            search_result_amount: count || 0,
            search_type: type,
            search_machine: searchMachine,
          },
        },
        customDimensions
      );
    } else {
      throw new Error(
        'Error: keyword should atleast be three characters long.'
      );
    }
  }

  trackSiteSearchResultClick({
    keyword,
    searchResult: { title, url, type: resultType, position },
    amountOfResults,
    amountOfResultsShown,
    type,
    customDimensions,
  }: TrackSiteSearchResultClickParams) {
    if (keyword.length < 3) {
      throw new Error(
        'Error: keyword should be atleast three characters long.'
      );
    }

    let parsedUrl = url;

    if (parsedUrl.includes('?')) {
      parsedUrl = parsedUrl.substring(0, parsedUrl.indexOf('?'));
    }

    this.pushCustomInstructionWithCustomDimensions(
      {
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
      },
      customDimensions
    );
  }

  /**
   * Tracks outgoing links to other sites and downloads
   * @deprecated Since version 2.0. Will be removed in version 3.0. Use newMethod() instead.
   */
  trackLink({ href, linkTitle, customDimensions }: TrackLinkParams) {
    console.warn('trackLink() is deprecated and will be removed in a future version. Use trackLinkClick() or trackAnchorLink() instead.');
    this.pushCustomInstructionWithCustomDimensions(
      {
        event: CUSTOM_EVENTS.TRACK_LINK,
        meta: {
          category: CUSTOM_EVENTS.TRACK_LINK,
          action: `${linkTitle} - ${href}`,
          label: window.location.pathname,
        },
      },
      customDimensions
    );
  }
  
  // Tracks outgoing links to other sites and downloads
  trackLinkClick({ componentName, href, linkTitle, isInternalDestination, customDimensions }: TrackLinkClickParams) {
    this.pushCustomInstructionWithCustomDimensions(
      {
        event: CUSTOM_EVENTS.TRACK_LINK_CLICK,
        meta: {
          category: CUSTOM_EVENTS.TRACK_LINK_CLICK,
          action: `${componentName} - ${isInternalDestination ? 'intern' : 'extern'}`,
          label: `${linkTitle} - ${href}`,
        },
      },
      customDimensions
    );
  }

  // Tracks anchor links to elements on page
  trackAnchorLink({ anchor, linkTitle, customDimensions }: TrackAnchorLinkParams) {
    this.pushCustomInstructionWithCustomDimensions(
      {
        event: CUSTOM_EVENTS.TRACK_ANCHOR_LINK,
        meta: {
          category: CUSTOM_EVENTS.TRACK_ANCHOR_LINK,
          action: `${linkTitle} - ${anchor}`,
          label: window.location.pathname,
        },
      },
      customDimensions
    );
  }
  
  trackMapInteraction({ action, clickText, clickUrl, customDimensions }: TrackMapInteractionParams) {
    this.pushCustomInstructionWithCustomDimensions(
      {
        event: CUSTOM_EVENTS.TRACK_MAP_INTERACTION,
        meta: {
          category: CUSTOM_EVENTS.TRACK_MAP_INTERACTION,
          action,
          label: `${clickText}${clickUrl ? ` - ${clickUrl}` : ''}`,
        },
      },
      customDimensions
    );
  }

  trackVisibility({ action, nameOfElementBecameVisible, customDimensions }: TrackVisibilityParams) {
    this.pushCustomInstructionWithCustomDimensions(
      {
        event: CUSTOM_EVENTS.TRACK_VISIBILITY,
        meta: {
          category: CUSTOM_EVENTS.TRACK_VISIBILITY,
          action,
          label: `${nameOfElementBecameVisible} - ${window.location.pathname}`,
        },
      },
      customDimensions
    );
  }

  trackDownload({
    downloadDescription,
    fileType,
    downloadUrl,
    customDimensions,
  }: TrackDownloadParams) {
    this.pushCustomInstructionWithCustomDimensions(
      {
        event: CUSTOM_EVENTS.TRACK_DOWNLOAD,
        meta: {
          category: CUSTOM_EVENTS.TRACK_DOWNLOAD,
          action: `${downloadDescription} - ${fileType}`,
          label: `${downloadUrl} - ${window.location.pathname}`,
        },
      },
      customDimensions
    );
  }

  // Tracks page views
  trackPageView(params: TrackPageViewParams) {
    // Strip ? part of url, these params might contain privacy sensative data
    const indexOf = params.href.indexOf('?');
    const strippedUrl =
      indexOf > -1 ? params.href.substring(0, indexOf) : params.href;

    // Urls we track must end in a /
    const trackedHref =
      strippedUrl.lastIndexOf('/') === strippedUrl.length - 1
        ? strippedUrl
        : `${strippedUrl}/`;

    // Check if this is not a double pageview
    let lastPageviewIndex = -1;

    // Find last index of pageview event
    for (let index = window.dataLayer.length - 1; index > -1; index -= 1) {
      if (window.dataLayer[index].event === CUSTOM_EVENTS.TRACK_VIEW) {
        lastPageviewIndex = index;
        break;
      }
    }

    if (window.dataLayer[lastPageviewIndex]?.meta?.vpv_url === trackedHref) {
      console.warn(
        `To prevent double tracking of pageviews the pageview for url ${params.href} was not registered. This url is equal to the last registerd url.`
      );
      return;
    }

    this.pushCustomInstructionWithCustomDimensions(
      {
        event: CUSTOM_EVENTS.TRACK_VIEW,
        meta: { vpv_url: `${trackedHref}` },
      },
      params.customDimensions
    );
  }

  pushCustomInstructionWithCustomDimensions(
    instruction: Instruction,
    customDimensions: CustomDimension[] | undefined
  ) {
    if (
      customDimensions &&
      Array.isArray(customDimensions) &&
      customDimensions.length
    ) {
      customDimensions.forEach((customDimension: CustomDimension) => {
        // eslint-disable-next-line no-param-reassign
        instruction.meta[customDimension.id] = customDimension.value;
      });
    }

    this.pushCustomInstruction(instruction);
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
      window._paq.push([name, ...args]);
    }

    return this;
  }

  pushCustomInstruction(instruction: Instruction) {
    if (
      typeof window !== 'undefined' &&
      typeof window.dataLayer !== 'undefined'
    ) {
      // eslint-disable-next-line
      window.dataLayer.push(instruction);
    }

    return this;
  }
}

export default PiwikTracker;
