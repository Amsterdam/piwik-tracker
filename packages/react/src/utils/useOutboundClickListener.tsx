import { useEffect } from 'react'
import { PiwikInstance } from '../types'

// This only works for single-part top-level domains like .nl and .com
// and not for multi-part top-level domains like .co.uk
const extractBaseDomain = (hostname: string): string | null => {
    const hostNameParts = hostname.split(".")
    if (hostNameParts.length < 2) { 
        return null
    }
    const baseDomain = [hostNameParts.at(-2), hostNameParts.at(-1)].join(".")
    return baseDomain
}

const useOutboundClickListener = (instance: PiwikInstance, internalBaseDomain?: string): void => {
  const handleOutboundClick = (event: MouseEvent) => {
    // The target is not guaranteed to be a link, it could be a child element.
    // Look up the element's parent until the anchor element is found.
    const findLinkElement = (el: EventTarget | null): HTMLElement | null => {
      if (el instanceof HTMLAnchorElement && el.href) {
        return el
      }
      if (el instanceof HTMLElement && el.parentElement) {
        return findLinkElement(el.parentElement)
      }
      return null
    }

    const target = findLinkElement(event.target)

    if (!(target instanceof HTMLAnchorElement)) {
      return
    }

    const { href } = target

    // Check if the click target differs from the current hostname, meaning it's outbound
    if (
      // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
      !href.match(
        new RegExp(
          `^(http://www.|https://www.|http://|https://)+(${window.location.hostname})`,
        ),
      )
    ) {
      let isInternalDestination = false
      if (internalBaseDomain) {
        const targetBaseDomain = extractBaseDomain(window.location.hostname || "")
        isInternalDestination = targetBaseDomain === internalBaseDomain
      }

      instance.trackLinkClick({ componentName: 'otherLinks', href, linkTitle: target.innerText, isInternalDestination })
    }
  }

  useEffect(() => {
    window.document.addEventListener('click', handleOutboundClick, {
      capture: true,
    })

    return () =>
      window.document.removeEventListener('click', handleOutboundClick, {
        capture: true,
      })
  }, [])
}

export const forTesting = {
    extractBaseDomain
}

export default useOutboundClickListener