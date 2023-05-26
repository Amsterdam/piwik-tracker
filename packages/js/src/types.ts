export interface CustomDimension {
  id: string
  value: string
}

export interface UserOptions {
  urlBase: string
  siteId: number
  userId?: string
  trackerUrl?: string
  srcUrl?: string
  disabled?: boolean
  heartBeat?: {
    active: boolean
    seconds?: number
  }
}

export interface TrackBaseParams {
  customDimensions?: CustomDimension[]
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
