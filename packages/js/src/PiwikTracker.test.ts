import PiwikTracker from './PiwikTracker'
import { UserOptions } from './types'

const URL_BASE = 'https://example.com'

describe('PiwikTracker', () => {
  it('should build the window._paq correctly on initialisation', () => {
    window._paq = []
    // eslint-disable-next-line no-new
    new PiwikTracker({
      siteId: '1',
      urlBase: 'https://foo.bar',
    })

    expect(window._paq).toEqual([['enableHeartBeatTimer', 15]])
  })

  it('should be possible to turn of hearBeatTimer', () => {
    window._paq = []
    // eslint-disable-next-line no-new
    new PiwikTracker({
      siteId: '1',
      urlBase: 'https://foo.bar',
      heartBeat: {
        active: false,
      },
    })

    expect(window._paq).toEqual([])
  })

  it('throws an error if no siteId is passed in options', () => {
    expect(
      () => new PiwikTracker({ urlBase: URL_BASE } as UserOptions),
    ).toThrow()
  })

  describe('pushInstruction', () => {
    it('should push the instruction', () => {
      const piwik = new PiwikTracker({
        urlBase: URL_BASE,
        siteId: '1',
      })

      window._paq = []
      piwik.pushInstruction('foo', 'bar', 1)

      expect(window._paq).toEqual([['foo', 'bar', 1]])
    })
  })

  describe('trackPageView', () => {
    it('should push the correct instruction', () => {
      const piwik = new PiwikTracker({
        urlBase: URL_BASE,
        siteId: '1',
      })

      window._paq = []
      piwik.trackPageView({
        href: '/pagina',
        customDimensions: [
          {
            id: 'user_city',
            value: 'Amsterdam',
          },
        ],
      })

      expect(window._paq).toEqual([
        {
          event: 'interaction.component.virtualPageview',
          meta: {
            user_city: 'Amsterdam',
            vpv_url: '/pagina',
          },
        },
      ])
    })
  })

  describe('trackLink', () => {
    it('should push the correct instruction', () => {
      const piwik = new PiwikTracker({
        urlBase: URL_BASE,
        siteId: '1',
      })

      window._paq = []
      piwik.trackLink({
        href: '/pagina',
        linkTitle: 'pagina titel',
        customDimensions: [
          {
            id: 'user_city',
            value: 'Amsterdam',
          },
        ],
      })

      expect(window._paq).toEqual([
        {
          event: 'interaction.generic.component.anchorLink',
          meta: {
            user_city: 'Amsterdam',
            action: 'pagina titel - /pagina',
            category: 'interaction.generic.component.anchorLink',
            label: '/',
          },
        },
      ])
    })
  })
})
