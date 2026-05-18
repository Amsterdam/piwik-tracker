import { createContext } from "react";
import { PiwikTracker } from "./types";

const PiwikContext = createContext<PiwikTracker | null>(null);

export { PiwikContext };
