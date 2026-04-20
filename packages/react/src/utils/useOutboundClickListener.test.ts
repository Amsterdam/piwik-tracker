/**
 * @jest-environment jsdom
 * @jest-environment-options {"url":"https://sub.example.com/current"}
 */

import { describe, it, expect } from "@jest/globals";
import { jest } from "@jest/globals";
import { renderHook } from "@testing-library/react";
import { forTesting } from "./useOutboundClickListener";
import useOutboundClickListener from "./useOutboundClickListener";
import type { PiwikInstance } from "../types";

describe("extractBaseDomain", () => {
  it("should return null for invalid inputs", () => {
    expect(forTesting.extractBaseDomain("")).toBeNull();
    expect(forTesting.extractBaseDomain("localhost")).toBeNull();
    expect(forTesting.extractBaseDomain("example")).toBeNull();
  });

  it("should extract base domain from simple domains", () => {
    expect(forTesting.extractBaseDomain("example.com")).toBe("example.com");
    expect(forTesting.extractBaseDomain("sub.example.com")).toBe("example.com");
    expect(forTesting.extractBaseDomain("a.b.c.example.com")).toBe(
      "example.com",
    );
  });

  it("should handle various valid domain formats", () => {
    expect(forTesting.extractBaseDomain("blog.example.org")).toBe(
      "example.org",
    );
    expect(forTesting.extractBaseDomain("api.service.example.net")).toBe(
      "example.net",
    );
    expect(forTesting.extractBaseDomain("x.y.z.example.io")).toBe("example.io");
  });
});

describe("useOutboundClickListener (internal/external detection)", () => {
  const makeInstance = (): PiwikInstance =>
    ({
      trackLinkClick: jest.fn(),
    }) as unknown as PiwikInstance;

  const clickLink = (targetUrl: string) => {
    const link = document.createElement("a");
    link.href = targetUrl;
    link.target = "_blank";
    link.innerText = "link title";
    document.body.appendChild(link);

    link.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      }),
    );

    return link;
  };

  it("does not track when window.location.href equals targetUrl", () => {
    const instance = makeInstance();
    renderHook(() => useOutboundClickListener(instance));

    clickLink(window.location.href);

    expect(instance.trackLinkClick).not.toHaveBeenCalled();
  });

  it("does not track when only the hostname is the same (same subdomain)", () => {
    const instance = makeInstance();
    renderHook(() => useOutboundClickListener(instance));

    clickLink("https://sub.example.com/other-path");

    expect(instance.trackLinkClick).not.toHaveBeenCalled();
  });

  it("tracks external links and marks them external when internalBaseDomain is not set", () => {
    const instance = makeInstance();
    renderHook(() => useOutboundClickListener(instance));

    clickLink("https://external.com/somewhere");

    expect(instance.trackLinkClick).toHaveBeenCalledTimes(1);
    expect(instance.trackLinkClick).toHaveBeenCalledWith(
      expect.objectContaining({
        isInternalDestination: false,
      }),
    );
  });

  it("tracks cross-subdomain links and marks them external when internalBaseDomain is not set", () => {
    const instance = makeInstance();
    renderHook(() => useOutboundClickListener(instance));

    clickLink("https://other.example.com/another");

    expect(instance.trackLinkClick).toHaveBeenCalledTimes(1);
    expect(instance.trackLinkClick).toHaveBeenCalledWith(
      expect.objectContaining({
        isInternalDestination: false,
      }),
    );
  });

  it("tracks cross-subdomain links and marks them internal when internalBaseDomain matches", () => {
    const instance = makeInstance();
    renderHook(() => useOutboundClickListener(instance, "example.com"));

    clickLink("https://other.example.com/another");

    expect(instance.trackLinkClick).toHaveBeenCalledTimes(1);
    expect(instance.trackLinkClick).toHaveBeenCalledWith(
      expect.objectContaining({
        isInternalDestination: true,
      }),
    );
  });

  it("tracks external links and marks them external when internalBaseDomain is set", () => {
    const instance = makeInstance();
    renderHook(() => useOutboundClickListener(instance, "example.com"));

    clickLink("https://external.com/somewhere");

    expect(instance.trackLinkClick).toHaveBeenCalledTimes(1);
    expect(instance.trackLinkClick).toHaveBeenCalledWith(
      expect.objectContaining({
        isInternalDestination: false,
      }),
    );
  });
});
