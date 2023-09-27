import PiwikTracker, { types } from '@amsterdam/piwik-tracker'

export interface PiwikInstance {
  trackPageView: PiwikTracker['trackPageView']
  trackSiteSearch: PiwikTracker['trackSiteSearch']
  trackLink: PiwikTracker['trackLink']
  trackDownload: PiwikTracker['trackDownload']
  pushInstruction: PiwikTracker['pushInstruction']
}

export type InstanceParams = types.UserOptions

export type TrackPageViewParams = types.TrackPageViewParams

export type TrackSiteSearchParams = types.TrackSiteSearchParams

export type TrackLinkParams = types.TrackLinkParams

export type TrackDownloadParams = types.TrackDownloadParams
