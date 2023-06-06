import React from 'react'
import { fireEvent, render, renderHook } from '@testing-library/react'
import PiwikTracker from '@amsterdam/piwik-tracker'
import createInstance from './instance'
import PiwikProvider from './PiwikProvider'
import usePiwik from './usePiwik'

jest.mock('@amsterdam/piwik-tracker')

describe('usePiwik', () => {
  function JustAComponent() {
    const { trackPageView, trackLink } = usePiwik()

    // Track page view after page load
    React.useEffect(() => {
      trackPageView({
        href: '/page',
      })
    }, [trackPageView])

    const handleOnClick = () => {
      trackLink({ href: '#test', linkTitle: 'Click me' })
    }

    return (
      <a href="#test" data-testid="btn" onClick={handleOnClick}>
        Click me
      </a>
    )
  }
  it('should render, call trackPageView once and call trackEvent when clicking a button', () => {
    const trackLinkMock = jest.fn()
    const trackPageViewMock = jest.fn()
    const mockedPiwikTracker = jest.mocked(PiwikTracker)
    mockedPiwikTracker.mockImplementation(
      () =>
        ({
          trackLink: trackLinkMock,
          trackPageView: trackPageViewMock,
        } as unknown as PiwikTracker),
    )

    const instance = createInstance({
      urlBase: 'https://LINK.TO.DOMAIN',
      siteId: '3',
    })

    function Component() {
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

    expect(trackLinkMock).toHaveBeenCalledWith({
      href: '#test',
      linkTitle: 'Click me',
    })
  })

  it('memoizes the methods between renders', () => {
    const instance = new PiwikTracker({
      urlBase: 'https://LINK.TO.DOMAIN',
      siteId: '3', // optional, default value: `1`
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
