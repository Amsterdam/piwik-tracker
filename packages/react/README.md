# Piwik Tracker (React)

Stand alone library for using Piwik tracking in React projects

## Installation

```sh
npm install @amsterdam/piwik-tracker-react
```

## Usage

Before you're able to use this Piwik Tracker you need to create a Piwik instance with your project specific details, and wrap your application with the `PiwikProvider` that this package exposes.

```tsx
import { PiwikProvider, createInstance } from '@amsterdam/piwik-tracker-react'

const instance = createInstance({
  urlBase: 'https://LINK.TO.DOMAIN',
  siteId: 3,
  userId: 'UID76903202', // optional, default value: `undefined`.
  trackerUrl: 'https://LINK.TO.DOMAIN/ppms.php', // optional, default value: `${urlBase}ppms.php`
  srcUrl: 'https://LINK.TO.DOMAIN/piwik.js', // optional, default value: `${urlBase}piwik.js`
  disabled: false, // optional, false by default. Makes all tracking calls no-ops if set to true.
  heartBeat: {
    // optional, enabled by default
    active: true, // optional, default value: true
    seconds: 10, // optional, default value: `15
  },
  linkTracking: false, // optional, default value: true
  configurations: {
    // optional, default value: {}
    // any valid Piwik configuration, all below are optional
    disableCookies: true,
    setSecureCookie: true,
    setRequestMethod: 'POST',
  },
})

ReactDOM.render(
  <PiwikProvider value={instance}>
    <MyApp />
  </PiwikProvider>,
)
```

After wrapping your application with the `PiwikProvider` you can use the `usePiwik` hook to track your application from anywhere within the PiwikProvider component tree:

```tsx
import React from 'react'
import { usePiwik } from '@amsterdam/piwik-tracker-react'

const MyPage = () => {
  const { trackPageView, trackEvent } = usePiwik()

  // Track page view
  React.useEffect(() => {
    trackPageView()
  }, [])

  const handleOnClick = () => {
    // Track click on button
    trackEvent({ category: 'sample-page', action: 'click-event' })
  }

  return (
    <button type="button" onClick={handleOnClick}>
      Click me
    </button>
  )
}
```

## Advanced usage

By default the Piwik Tracker will send the window's document title and location, or send your own values. Also, [custom dimensions](https://help.piwik.pro/support/reports/custom-dimension/) can be used:

```tsx
import React from 'react'
import { usePiwik } from '@amsterdam/piwik-tracker-react'

const MyPage = () => {
  const { trackPageView, trackEvent } = usePiwik()

  // Track page view
  React.useEffect(() => {
    trackPageView({
      documentTitle: 'Page title', // optional
      href: 'https://LINK.TO.PAGE', // optional
      customDimensions: [
        {
          id: 1,
          value: 'loggedIn',
        },
      ], // optional
    })
  }, [])

  const handleOnClick = () => {
    // Track click on button
    trackEvent({ category: 'sample-page', action: 'click-event' })
  }

  return (
    <button type="button" onClick={handleOnClick}>
      Click me
    </button>
  )
}
```

And you can do the same for the `trackEvent` method:

```tsx
import React from 'react'
import { usePiwik } from '@amsterdam/piwik-tracker-react'

const MyPage = () => {
  const { trackEvent } = usePiwik()

  const handleOnClick = () => {
    // Track click on button
    trackEvent({
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
  }

  return (
    <button type="button" onClick={handleOnClick}>
      Click me
    </button>
  )
}
```

The `usePiwik` hook also exposes the following methods:

- `trackSiteSearch()`
- `trackLink()`
- `pushInstruction()`

For example, the `pushInstruction()` function can be used to push instructions to Piwik for execution. This
is equivalent to pushing entries into the `_paq` array.

```javascript
const { pushInstruction } = usePiwik()
pushInstruction('setUserId', 'USER_ID_HERE')
```

## SPA Link Tracking

Piwik provides the option to track outbound link, however, this implementation is flaky for a SPA (Single Page Application) **without** SSR (Server Side Rendering) across different versions of Piwik. Therefore you can use the `enableLinkTracking` method to listen to outbound clicks on anchor elements. This method should be placed on a component directly below your `PiwikProvider` on a component that's rendered on every page view. Also, make sure to disable the `linkTracking` option on the instance passed to the provider to prevent Piwik from catching some link clicks:

```tsx
import { PiwikProvider, createInstance, usePiwik } from '@amsterdam/piwik-tracker-react'

const instance = createInstance({
  urlBase: "https://LINK.TO.DOMAIN",
  linkTracking: false // Important!
});

ReactDOM.render(
  <PiwikProvider value={instance}>
    <MyApp />
  </PiwikProvider>
)

const MyApp = () => {
  const { enableLinkTracking } = usePiwik()

  enableLinkTracking()

  return (
    // Render components
  )
}

```

## References

- [Piwik JavaScript Tracking Guide](https://developers.piwik.pro/en/latest/data_collection/web/guides.html)
