# Piwik Tracker (React)

Stand alone library for using Piwik tracking in React projects.
This package contains React bindings for `@amsterdam/piwik-tracker` package. It is therefor not compatible with default Piwik implementations.

## Installation

```sh
npm install @amsterdam/piwik-tracker-react
```

## Usage

Before you're able to use this Piwik Tracker you need to create a Piwik instance with your project specific details and wrap your application with the `PiwikProvider` that this package exposes.

```tsx
import { PiwikProvider, createInstance } from '@amsterdam/piwik-tracker-react'

const instance = createInstance({
  urlBase: 'https://LINK.TO.DOMAIN',
  siteId: '3',
  disabled: false, // optional, false by default. Makes all tracking calls no-ops if set to true.
  heartBeat: {
    // optional, enabled by default
    active: true, // optional, default value: true
    seconds: 10, // optional, default value: `15
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
  const { trackPageView } = usePiwik()

  // Track page view
  React.useEffect(() => {
    trackPageView({
      href: 'https://LINK.TO.PAGE',
    })
  }, [])

  return (
    <button type="button" onClick={handleOnClick}>
      Click me
    </button>
  )
}
```

## Advanced usage

[Custom dimensions](https://help.piwik.pro/support/reports/custom-dimension/) can be used:

```tsx
import React from 'react'
import { usePiwik } from '@amsterdam/piwik-tracker-react'

const MyPage = () => {
  const { trackPageView } = usePiwik()

  // Track page view
  React.useEffect(() => {
    trackPageView({
      href: 'https://LINK.TO.PAGE',
      customDimensions: [
        {
          id: 1,
          value: 'loggedIn',
        },
      ], // optional
    })
  }, [])

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
