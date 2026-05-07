import React from "react";
import { PiwikContext } from "./PiwikContext";
import { PiwikTracker } from "./types";

export interface PiwikProviderProps {
  children?: React.ReactNode;
  value: PiwikTracker;
}

function PiwikProvider({ children, value }: PiwikProviderProps) {
  const Context = PiwikContext;

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export { PiwikProvider };
