import PiwikTracker from './PiwikTracker';
import { UserOptions } from './types';

const URL_BASE = 'https://example.com';

declare global {
  interface Window {
    _paq: any[];
  }
}

describe('PiwikTracker', () => {
  it('should build the window._paq correctly on initialisation', () => {
    window._paq = [];

    // eslint-disable-next-line no-new
    new PiwikTracker({
      siteId: '1',
      urlBase: 'https://foo.bar',
    });

    expect(window._paq).toEqual([['enableHeartBeatTimer', 15]]);
  });

  it('should be possible to turn off hearBeatTimer', () => {
    window.dataLayer = [];
    // eslint-disable-next-line no-new
    new PiwikTracker({
      siteId: '1',
      urlBase: 'https://foo.bar',
      heartBeat: {
        active: false,
      },
    });

    expect(window.dataLayer).toEqual([]);
  });

  it('throws an error if no siteId is passed in options', () => {
    expect(
      () => new PiwikTracker({ urlBase: URL_BASE } as UserOptions)
    ).toThrow();
  });

  describe('pushInstruction', () => {
    it('should push the instruction', () => {
      const piwik = new PiwikTracker({
        urlBase: URL_BASE,
        siteId: '1',
      });

      window._paq = [];
      piwik.pushInstruction('foo', 'bar', 1);

      expect(window._paq).toEqual([['foo', 'bar', 1]]);
    });
  });

  describe('trackPageView', () => {
    it('should push the correct instruction', () => {
      const piwik = new PiwikTracker({
        urlBase: URL_BASE,
        siteId: '1',
      });

      window.dataLayer = [];
      piwik.trackPageView({
        href: '/pagina',
        customDimensions: [
          {
            id: 'user_city',
            value: 'Amsterdam',
          },
        ],
      });

      expect(window.dataLayer).toEqual([
        {
          event: 'interaction.component.virtualPageview',
          meta: {
            user_city: 'Amsterdam',
            vpv_url: '/pagina/',
          },
        },
      ]);
    });

    it('should add a / to the end of a url when not present', () => {
      const piwik = new PiwikTracker({
        urlBase: URL_BASE,
        siteId: '1',
      });

      window.dataLayer = [];
      piwik.trackPageView({
        href: '/pagina',
      });

      expect(window.dataLayer[0].meta.vpv_url).toEqual('/pagina/');

      piwik.trackPageView({
        href: '/pagina2?some=data&other=data',
      });

      expect(window.dataLayer[1].meta.vpv_url).toEqual('/pagina2/');
    });

    it('should prevent double pageviews', () => {
      console.warn = jest.fn();
      const piwik = new PiwikTracker({
        urlBase: URL_BASE,
        siteId: '1',
      });
      const href = '/pagina';

      window.dataLayer = [];
      piwik.trackPageView({
        href,
        customDimensions: [
          {
            id: 'user_city',
            value: 'Amsterdam',
          },
        ],
      });

      // Assert one datalayer entry, and console warn was not called
      expect(window.dataLayer.length).toEqual(1);
      expect(window.dataLayer[0].meta.vpv_url).toEqual(`${href}/`);
      expect(console.warn).not.toHaveBeenCalled();

      piwik.trackPageView({
        href,
        customDimensions: [
          {
            id: 'user_city',
            value: 'Amsterdam',
          },
        ],
      });

      // Trying to register same page again, assert datalayer stil at 1 and warn was called
      expect(window.dataLayer.length).toEqual(1);
      expect(console.warn).toHaveBeenCalled();

      piwik.trackPageView({
        href: '/iets-anders',
        customDimensions: [
          {
            id: 'user_city',
            value: 'Amsterdam',
          },
        ],
      });

      // Registering new page, datalayer should be at 2 and warn still at 1
      expect(window.dataLayer.length).toEqual(2);
      expect(console.warn).toHaveBeenCalledTimes(1);

      piwik.trackPageView({
        href,
        customDimensions: [
          {
            id: 'user_city',
            value: 'Amsterdam',
          },
        ],
      });

      // Registering original page again (which is allowed), datalayer should be at 3 and warn still at 1
      expect(window.dataLayer.length).toEqual(3);
      expect(console.warn).toHaveBeenCalledTimes(1);

      piwik.trackPageView({
        href,
        customDimensions: [
          {
            id: 'user_city',
            value: 'Amsterdam',
          },
        ],
      });

      // Registering same page again, datalayer should remain at 3 and warn should be at 2
      expect(window.dataLayer.length).toEqual(3);
      expect(console.warn).toHaveBeenCalledTimes(2);
    });
  });

  describe('trackLink', () => {
    it('should push the correct instruction', () => {
      const piwik = new PiwikTracker({
        urlBase: URL_BASE,
        siteId: '1',
      });

      window.dataLayer = [];
      piwik.trackLink({
        href: '/pagina',
        linkTitle: 'pagina titel',
        customDimensions: [
          {
            id: 'user_city',
            value: 'Amsterdam',
          },
        ],
      });

      expect(window.dataLayer).toMatchInlineSnapshot(`
        [
          {
            "event": "interaction.generic.component.anchorLink",
            "meta": {
              "action": "pagina titel - /pagina",
              "category": "interaction.generic.component.anchorLink",
              "label": "/",
              "user_city": "Amsterdam",
            },
          },
        ]
      `);
    });
  });

  describe('trackDownload', () => {
    it('should push the correct instructions', () => {
      const piwik = new PiwikTracker({
        urlBase: URL_BASE,
        siteId: '1',
      });

      window.dataLayer = [];
      piwik.trackDownload({
        downloadDescription: 'vergunning',
        fileType: 'pdf',
        downloadUrl: '/downloads/bestand.pdf',
        customDimensions: [
          {
            id: 'user_city',
            value: 'Amsterdam',
          },
        ],
      });

      expect(window.dataLayer).toMatchInlineSnapshot(`
        [
          {
            "event": "interaction.generic.component.download",
            "meta": {
              "action": "vergunning - pdf",
              "category": "interaction.generic.component.download",
              "label": "/downloads/bestand.pdf - /",
              "user_city": "Amsterdam",
            },
          },
        ]
      `);
    });
  });
});
