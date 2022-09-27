import React from 'react'
import PiwikContext from './PiwikContext'
import { PiwikInstance } from './types'

export interface PiwikProviderProps {
  children?: React.ReactNode
  value: PiwikInstance
}

function PiwikProvider({ children, value }: PiwikProviderProps) {
  const Context = PiwikContext

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export default PiwikProvider
