import PiwikTracker from './PiwikTracker'
import { UserOptions } from './types'

const URL_BASE = 'https://example.com'

describe('PiwikTracker', () => {
  it('should build the window._paq correctly on initialisation', () => {
    window._paq = []
    // eslint-disable-next-line no-new
    new PiwikTracker({
      siteId: 1,
      urlBase: 'https://foo.bar',
      configurations: { setCustomDimension: [1, 'someValue'], foo: 'bar' },
    })
    expect(window._paq).toEqual([
      ['setTrackerUrl', 'https://foo.bar/ppms.php'],
      ['setSiteId', 1],
      ['setCustomDimension', 1, 'someValue'],
      ['foo', 'bar'],
      ['enableHeartBeatTimer', 15],
      ['enableLinkTracking', true],
    ])
  })

  it('throws an error if no urlBase is passed in options', () => {
    expect(() => new PiwikTracker({ siteId: 1 } as UserOptions)).toThrow()
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
        siteId: 1,
      })

      window._paq = []
      piwik.pushInstruction('foo', 'bar', 1)

      expect(window._paq).toEqual([['foo', 'bar', 1]])
    })
  })
})