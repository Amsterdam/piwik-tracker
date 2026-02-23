import { useCallback, useContext } from 'react';
import PiwikContext from './PiwikContext';
import {
  TrackDownloadParams,
  TrackLinkParams,
  TrackPageViewParams,
  TrackSiteSearchParams,
  type TrackAnchorLinkParams,
  type TrackLinkClickParams,
  type TrackMapInteractionParams,
  type TrackSiteSearchResultClickParams,
  type TrackVisibilityParams,
} from './types';
import useOutboundClickListener from './utils/useOutboundClickListener';

function usePiwik() {
  const instance = useContext(PiwikContext);

  const trackPageView = useCallback(
    (params: TrackPageViewParams) => instance?.trackPageView(params),
    [instance]
  );

  const trackLink = useCallback(
    (params: TrackLinkParams) => instance?.trackLink(params),
    [instance]
  );

  const trackLinkClick = useCallback(
    (params: TrackLinkClickParams) => instance?.trackLinkClick(params),
    [instance]
  );

  const trackAnchorLink = useCallback(
    (params: TrackAnchorLinkParams) => instance?.trackAnchorLink(params),
    [instance]
  );

  const trackSiteSearch = useCallback(
    (params: TrackSiteSearchParams) => instance?.trackSiteSearch(params),
    [instance]
  );

  const trackSiteSearchResultClick = useCallback(
    (params: TrackSiteSearchResultClickParams) => instance?.trackSiteSearchResultClick(params),
    [instance]
  );

  const trackDownload = useCallback(
    (params: TrackDownloadParams) => instance?.trackDownload(params),
    [instance]
  );
  
  const trackMapInteraction = useCallback(
    (params: TrackMapInteractionParams) => instance?.trackMapInteraction(params),
    [instance]
  );

  const trackVisibility = useCallback(
    (params: TrackVisibilityParams) => instance?.trackVisibility(params),
    [instance]
  );

  const enableLinkTracking = useCallback((internalBaseDomain?: string) => {
    if (instance) {
      useOutboundClickListener(instance, internalBaseDomain);
    }
  }, [instance]);

  const pushInstruction = useCallback(
    (name: string, ...args: any[]) => {
      instance?.pushInstruction(name, ...args);
    },
    [instance]
  );

  return {
    trackPageView,
    trackLink,
    trackLinkClick,
    trackAnchorLink,
    trackSiteSearch,
    trackSiteSearchResultClick,
    trackDownload,
    trackMapInteraction,
    trackVisibility,
    enableLinkTracking,
    pushInstruction,
  };
}

export default usePiwik;
