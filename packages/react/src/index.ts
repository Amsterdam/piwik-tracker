import type { UserOptions, PiwikTracker } from "@amsterdam/piwik-tracker";

export { urlTransformers } from "@amsterdam/piwik-tracker";
export type { PiwikTracker } from "@amsterdam/piwik-tracker";

export type {
  CustomDimension,
  TrackAnchorLinkParams,
  TrackDownloadParams,
  TrackLinkClickParams,
  TrackLinkParams,
  TrackMapInteractionParams,
  TrackPageViewParams,
  TrackSiteSearchParams,
  TrackSiteSearchResultClick,
  TrackSiteSearchResultClickParams,
  TrackVisibilityParams,
  UserOptions,
} from "./types";

export { PiwikContext } from "./PiwikContext";
export { PiwikProvider } from "./PiwikProvider";
export { createInstance } from "./instance";
export { usePiwik } from "./usePiwik";

/**
 * @deprecated Use `PiwikTracker` instead. The `PiwikInstance` type will be removed in a future release.
 */
export type PiwikInstance = PiwikTracker;

/**
 * @deprecated Use `UserOptions` instead. The `InstanceParams` type will be removed in a future release.
 */
export type InstanceParams = UserOptions;
