import PiwikTracker from '@amsterdam/piwik-tracker'
import { fireEvent, render, renderHook } from '@testing-library/react'
import React from 'react'
import createInstance from './instance'
import PiwikProvider from './PiwikProvider'
import usePiwik from './usePiwik'

jest.mock('@amsterdam/piwik-tracker')

describe('usePiwik', () => {
  function JustAComponent() {
    const { trackPageView, trackEvent } = usePiwik()

    // Track page view after page load
    React.useEffect(() => {
      trackPageView({
        documentTitle: 'Hello',
      })
    }, [trackPageView])

    const handleOnClick = () => {
      trackEvent({ category: 'sample-page', action: 'click-event' })
    }

    return (
      <button type="button" data-testid="btn" onClick={handleOnClick}>
        Click me
      </button>
    )
  }
  it('should render, call trackPageView once and call trackEvent when clicking a button', () => {
    const trackEventMock = jest.fn()
    const trackPageViewMock = jest.fn()
    const mockedPiwikTracker = jest.mocked(PiwikTracker)
    mockedPiwikTracker.mockImplementation(
      () =>
        ({
          trackEvent: trackEventMock,
          trackPageView: trackPageViewMock,
        } as unknown as PiwikTracker),
    )

    const instance = createInstance({
      urlBase: 'https://LINK.TO.DOMAIN',
      siteId: 3,
    })

    const Component = function () {
      return (
        <PiwikProvider value={instance}>
          <JustAComponent />
        </PiwikProvider>
      )
    }
    expect(PiwikTracker).toHaveBeenCalled()

    const { getByTestId } = render(<Component />)
    expect(trackPageViewMock).toHaveBeenCalled()

    fireEvent.click(getByTestId('btn'))

    expect(trackEventMock).toHaveBeenCalledWith({
      category: 'sample-page',
      action: 'click-event',
    })
  })

  it('memoizes the methods between renders', () => {
    const instance = new PiwikTracker({
      urlBase: 'https://LINK.TO.DOMAIN',
      siteId: 3, // optional, default value: `1`
    })

    const { result, rerender } = renderHook(() => usePiwik(), {
      wrapper: ({ children }) => (
        <PiwikProvider value={instance}>{children}</PiwikProvider>
      ),
    })

    const originalMethods = result.current

    rerender()

    expect(Object.values(originalMethods)).toEqual(
      Object.values(result.current),
    )
  })
})
