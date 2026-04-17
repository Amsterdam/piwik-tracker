import { useEffect } from "react";
import { PiwikInstance } from "../types";

// This only works for single-part top-level domains like .nl and .com
// and not for multi-part top-level domains like .co.uk
const extractBaseDomain = (hostname: string): string | null => {
    const hostNameParts = hostname.split(".");
    if (hostNameParts.length < 2) {
        return null;
    }
    const baseDomain = [hostNameParts.at(-2), hostNameParts.at(-1)].join(".");
    return baseDomain;
};

const useOutboundClickListener = (
    instance: PiwikInstance,
    internalBaseDomain?: string,
): void => {
    const handleOutboundClick = (event: MouseEvent) => {
        // The target is not guaranteed to be a link, it could be a child element.
        // Look up the element's parent until the anchor element is found.
        const findLinkElement = (
            el: EventTarget | null,
        ): HTMLElement | null => {
            if (el instanceof HTMLAnchorElement && el.href) {
                return el;
            }
            if (el instanceof HTMLElement && el.parentElement) {
                return findLinkElement(el.parentElement);
            }
            return null;
        };

        const target = findLinkElement(event.target);
        if (!(target instanceof HTMLAnchorElement)) {
            return;
        }

        let targetUrl: URL | null = null;
        try {
            targetUrl = new URL(target.href, window.location.href);
        } catch {
            return;
        }
        
        // Do not track non-links like mailto: and tel:
        if (!targetUrl.protocol.startsWith('https:') && !targetUrl.protocol.startsWith('http:')) {
            return;
        }
        
        // Only track outbound targets
        if (targetUrl && window.location.hostname && targetUrl.hostname === window.location.hostname) {
            return;
        }

        { 
            // When an outbound link is clicked, the navigations can happen before the tracking request is complete.
            // To avoid losing the last event we delay navigation.
            event.preventDefault();
            const navigate = () => window.location.assign(target.href)
            window.setTimeout(navigate, 300);

            const targetBaseDomain = extractBaseDomain(targetUrl.hostname);
            const sourceBaseDomain = internalBaseDomain || window.location.hostname
            instance.trackLinkClick({
                componentName: "otherLinks",
                href: target.href,
                linkTitle: target.innerText,
                isInternalDestination: targetBaseDomain === sourceBaseDomain,
            });
        }
    };

    useEffect(() => {
        window.document.addEventListener("click", handleOutboundClick, {
            capture: true,
        });

        return () =>
            window.document.removeEventListener("click", handleOutboundClick, {
                capture: true,
            });
    }, [instance, internalBaseDomain]);
};

export const forTesting = {
    extractBaseDomain,
};

export default useOutboundClickListener;
