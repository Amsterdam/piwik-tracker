import type { UserOptions, PiwikTracker } from "@amsterdam/piwik-tracker";

export * from "@amsterdam/piwik-tracker";
export type { PiwikTracker } from "@amsterdam/piwik-tracker";

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
