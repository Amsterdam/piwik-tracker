import type { PiwikTracker, UserOptions } from "@amsterdam/piwik-tracker";

export * from "@amsterdam/piwik-tracker";

export type PiwikInstance = InstanceType<typeof PiwikTracker>;

/**
 * @deprecated Use `UserOptions` instead. The `InstanceParams` type will be removed in a future release.
 */
export type InstanceParams = UserOptions;