import { PiwikTracker, type UserOptions } from "@amsterdam/piwik-tracker";

function createInstance(params: UserOptions): PiwikTracker {
  return new PiwikTracker(params);
}

export { createInstance };
