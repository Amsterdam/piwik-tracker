# Piwik Pro Tracker (JavaScript)

Stand alone library for using Piwik tracking in frontend projects

## Installation

```sh
npm install @amsterdam/piwik-tracker
```

## Usage

Before you're able to use this Piwik Pro Tracker you need to initialize Piwik with your project specific details.

**Initialize:**

```ts
import PiwikTracker from '@amsterdam/piwik-tracker'

const tracker = new PiwikTracker({
  urlBase: 'https://LINK.TO.DOMAIN',
  siteId: 3,
  userId: 'UID76903202', // optional, default value: `undefined`.
  trackerUrl: 'https://LINK.TO.DOMAIN/ppms.php', // optional, default value: `${urlBase}ppms.php`
  srcUrl: 'https://LINK.TO.DOMAIN/piwik.js', // optional, default value: `${urlBase}piwik.js`
  disabled: false, // optional, false by default. Makes all tracking calls no-ops if set to true.
  heartBeat: { // optional, enabled by default
    active: true, // optional, default value: true
    seconds: 10 // optional, default value: `15
  },
  linkTracking: false, // optional, default value: true
  configurations: { // optional, default value: {}
    // any valid Piwik configuration, all below are optional
    disableCookies: true,
    setSecureCookie: true,
    setRequestMethod: 'POST'
  }
})
```

After initialization you can use the Piwik Tracker to track events and page views like this:

```ts
import PiwikTracker from '@amsterdam/piwik-tracker'

const tracker = new PiwikTracker({
  /* setup */
})

tracker.trackPageView()

tracker.trackEvent({
  category: 'sample-page',
  action: 'click-event',
  name: 'test', // optional
  value: 123, // optional, numerical value
})

tracker.trackLink({
  href: 'https://link-to-other-website.org',
})
```

## Advanced usage

By default the Piwik Tracker will send the window's document title and location, but you're able to send your own values. Also, [custom dimensions](https://help.piwik.pro/support/reports/custom-dimension/) can be used:

```ts
import PiwikTracker from '@amsterdam/piwik-tracker'

const tracker = new PiwikTracker({
  /* setup */
})

tracker.trackPageView({
  documentTitle: 'Page title', // optional
  href: 'https://LINK.TO.PAGE', // optional
  customDimensions: [
    {
      id: 1,
      value: 'loggedIn',
    },
  ], // optional
})

tracker.trackEvent({
  category: 'sample-page',
  action: 'click-event',
  name: 'test', // optional
  value: 123, // optional, numerical value
  documentTitle: 'Page title', // optional
  href: 'https://LINK.TO.PAGE', // optional
  customDimensions: [
    {
      id: 1,
      value: 'loggedIn',
    },
  ], // optional
})

tracker.trackLink({
  href: 'https://link-to-your-file.pdf',
  linkType: 'download', // optional, default value 'link'
})
```

Next to the tracking of events, this project also supports tracking site searches:

```ts
import PiwikTracker from '@amsterdam/piwik-tracker'

const tracker = new PiwikTracker({
  /* setup */
})

tracker.trackSiteSearch({
  keyword: 'test',
  category: 'blog', // optional
  count: 4, // optional
  documentTitle: 'Page title', // optional
  href: 'https://LINK.TO.PAGE', // optional
  customDimensions: [
    {
      id: 1,
      value: 'loggedIn',
    },
  ], // optional
})
```

## References

- [Piwik JavaScript Tracking Guide](https://developers.piwik.pro/en/latest/data_collection/web/guides.html)
