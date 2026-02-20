import PiwikTracker, { types } from '@amsterdam/piwik-tracker'

export interface PiwikInstance {
    trackPageView: PiwikTracker['trackPageView']
    trackLink: PiwikTracker['trackLink']
    trackLinkClick: PiwikTracker['trackLinkClick']
    trackAnchorLink: PiwikTracker['trackAnchorLink']
    trackSiteSearch: PiwikTracker['trackSiteSearch']
    trackSiteSearchResultClick: PiwikTracker['trackSiteSearchResultClick']
    trackDownload: PiwikTracker['trackDownload']
    trackMapInteraction: PiwikTracker['trackMapInteraction']
    trackVisibility: PiwikTracker['trackVisibility']
    pushInstruction: PiwikTracker['pushInstruction']
}

export type InstanceParams = types.UserOptions

export type TrackPageViewParams = types.TrackPageViewParams

export type TrackLinkParams = types.TrackLinkParams

export type TrackLinkClickParams = types.TrackLinkClickParams

export type TrackAnchorLinkParams = types.TrackAnchorLinkParams

export type TrackSiteSearchParams = types.TrackSiteSearchParams

export type TrackSiteSearchResultClickParams = types.TrackSiteSearchResultClickParams

export type TrackDownloadParams = types.TrackDownloadParams

export type TrackMapInteractionParams = types.TrackMapInteractionParams

export type TrackVisibilityParams = types.TrackVisibilityParams
