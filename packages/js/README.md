# Piwik Pro Tracker (JavaScript)

Stand alone library for using Piwik tracking in frontend projects.
This package implements the 'aansluitgids - Piwik Pro' of the Amsterdam municipality.
It is not compatible with a standard Piwik implementation.

## Installation

```sh
npm install @amsterdam/piwik-tracker
```

## Usage

Before you're able to use this Piwik Pro Tracker you need to initialize Piwik with your project specific details.

**Initialize:**

```ts
import PiwikTracker, { urlTransformers } from '@amsterdam/piwik-tracker'

const tracker = new PiwikTracker({
  urlBase: 'https://LINK.TO.DOMAIN',
  siteId: '3',
  disabled: false, // optional, false by default. Makes all tracking calls no-ops if set to true.
  urlTransformer: urlTransformers.redactIdLikePathSegments, // optional, transform/mask URLs before they are pushed to `dataLayer`
  heartBeat: {
    // optional, enabled by default
    active: true, // optional, default value: true
    seconds: 10, // optional, default value: `15`
  },
})
```

After initialization you can use the Piwik Tracker to track events and page views like this:

```ts
import PiwikTracker from '@amsterdam/piwik-tracker'

const tracker = new PiwikTracker({
  /* setup */
})

tracker.trackPageView({ href: '/link-to-page' })

tracker.trackLinkClick({
  componentName: 'nameOfComponent',
  href: 'https://link-to-other-website.org',
  linkTitle: 'titel of link',
  isInternalDestination: false,
})
```

## URL transformation

To mask or normalize URLs before they’re pushed to the `dataLayer`, pass a `urlTransformer` function.

The library exports `urlTransformers.redactIdLikePathSegments`, which masks any URL path segment that contains 3 or more digits (e.g. `/users/123/profile` becomes `/users/**/profile`).

If you need different behavior you can provide your own transformer:

```ts
import PiwikTracker, { type types } from '@amsterdam/piwik-tracker'

const urlTransformer: types.UrlTransformer = ({ method }, url) => {
  if (method === 'trackPageView') {
    return url.replace(/\d+/g, '**')
  }
  return url
}

const tracker = new PiwikTracker({
  siteId: '3',
  urlBase: 'https://LINK.TO.DOMAIN',
  urlTransformer,
})
```

## Advanced usage

Next to the tracking of events, this project also supports tracking site searches:

```ts
import PiwikTracker from '@amsterdam/piwik-tracker'

const tracker = new PiwikTracker({
  /* setup */
})

tracker.trackSiteSearch({
  keyword: 'test',
  searchMachine: 'siteSearch', // optional, describes which search option was used
  count: 4, // indicates what number this result is (e.g. number 4 out of 10) (count from top to bottom)
  type: 'manueel', // or 'autocomplete'
  customDimensions: [
    {
      id: 1,
      value: 'loggedIn',
    },
  ], // optional, note: customDimension id values must be predefined in piwik
})

```
