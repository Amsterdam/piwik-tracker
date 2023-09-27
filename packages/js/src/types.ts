export interface CustomDimension {
  id: string
  value: string
}

export interface UserOptions {
  urlBase?: string
  siteId: string
  disabled?: boolean
  heartBeat?: {
    active: boolean
    seconds?: number
  }
  nonce?: string
}

export interface TrackBaseParams {
  customDimensions?: CustomDimension[]
}

export interface TrackPageViewParams extends TrackBaseParams {
  href: string
}

export interface TrackLinkParams extends TrackBaseParams {
  href: string
  linkType?: 'download' | 'link'
  linkTitle: string
}

export interface TrackSiteSearchParams extends TrackBaseParams {
  keyword: string
  searchMachine: string
  count?: number
  type: 'autocomplete' | 'manueel'
}

export interface TrackSiteSearchResultClick extends TrackBaseParams {
  keyword: string // de zoekopdracht van de gebruiker (minimaal drie karakters)
  searchResult: {
    title: string // de titel van het aangeklikt element
    url: string // de url waarop wordt geklikt (zonder ? parameters)
    type: string // het type van het zoekresultaat (bijv. persbericht of nieuwsbericht.)
    position: number // het hoeveelste zoekresultaat wordt aangeklikt van boven
  }
  amountOfResults: number // aantal zoekresultaten op het moment
  amountOfResultsShown: number // hoeveel zoekresultaten had de gebruiker beschikbaar om te kiezen
  type: 'autocomplete' | 'manueel' // heeft iemand het zoekresultaat helemaal zelf getypt of via Autocomplete aangeklikt
}

export interface TrackDownloadParams extends TrackBaseParams {
  downloadKind: string // Het soort (functioneel) document (b.v. jaaropgave, wmo-besluit, vergunning, etc.)
  documentKind: string // Het type document
  downloadUrl: string // De download url
}

export interface Instruction {
  event: string
  meta: Record<string, string | number>
}

declare global {
  interface Window {
    dataLayer: Instruction[]
  }
}
