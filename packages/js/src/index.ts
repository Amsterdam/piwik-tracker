import { PiwikTracker } from "./PiwikTracker";

declare global {
  interface Window {
    _paq: any[];
  }
}

export { PiwikTracker } from "./PiwikTracker";

/**
 * @deprecated Default export is deprecated. Use named export instead: `import { PiwikTracker } from "@amsterdam/piwik-tracker";`
 */
export default PiwikTracker;

export * from "./types";

/**
 * @deprecated The types export is deprecated. Types are exported directly at top-level
 */
export * as types from "./types";

export { urlTransformers } from "./urlTransformers";
