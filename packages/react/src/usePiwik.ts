import { useCallback, useContext } from 'react';
import PiwikContext from './PiwikContext';
import {
  TrackDownloadParams,
  TrackLinkParams,
  TrackPageViewParams,
  TrackSiteSearchParams,
} from './types';
import useOutboundClickListener from './utils/useOutboundClickListener';

function usePiwik() {
  const instance = useContext(PiwikContext);

  const trackPageView = useCallback(
    (params: TrackPageViewParams) => instance?.trackPageView(params),
    [instance]
  );

  const trackSiteSearch = useCallback(
    (params: TrackSiteSearchParams) => instance?.trackSiteSearch(params),
    [instance]
  );

  const trackLink = useCallback(
    (params: TrackLinkParams) => instance?.trackLink(params),
    [instance]
  );

  const trackDownload = useCallback(
    (params: TrackDownloadParams) => instance?.trackDownload(params),
    [instance]
  );

  const enableLinkTracking = useCallback(() => {
    if (instance) {
      useOutboundClickListener(instance);
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
    trackSiteSearch,
    trackLink,
    trackDownload,
    enableLinkTracking,
    pushInstruction,
  };
}

export default usePiwik;
