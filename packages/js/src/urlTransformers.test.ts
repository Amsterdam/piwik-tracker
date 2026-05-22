import { urlTransformers } from "./urlTransformers";

describe("urlTransformers.redactIdLikeSegmentsInUrl", () => {
  it("redacts path segment with more than two digits with **", () => {
    expect(
      urlTransformers.redactIdLikeSegmentsInUrl(
        { method: "trackPageView" },
        "/foo/12/bar",
      ),
    ).toBe("/foo/12/bar");
    expect(
      urlTransformers.redactIdLikeSegmentsInUrl(
        { method: "trackPageView" },
        "/foo/123/bar",
      ),
    ).toBe("/foo/**/bar");
    expect(
      urlTransformers.redactIdLikeSegmentsInUrl(
        { method: "trackPageView" },
        "/foo/a1b23/bar",
      ),
    ).toBe("/foo/**/bar");
  });

  it("redacts query param values with more than two digits with **", () => {
    expect(
      urlTransformers.redactIdLikeSegmentsInUrl(
        { method: "trackPageView" },
        "/foo?id=123&name=test",
      ),
    ).toBe("/foo?id=**&name=test");
    expect(
      urlTransformers.redactIdLikeSegmentsInUrl(
        { method: "trackPageView" },
        "https://example.com/foo/123/bar?x=456&y=12",
      ),
    ).toBe("https://example.com/foo/**/bar?x=**&y=12");
  });

  it("redacts hash segments with more than two digits", () => {
    expect(
      urlTransformers.redactIdLikeSegmentsInUrl(
        { method: "trackPageView" },
        "/foo#section123",
      ),
    ).toBe("/foo#**");
    expect(
      urlTransformers.redactIdLikeSegmentsInUrl(
        { method: "trackPageView" },
        "/foo#section/123/bar",
      ),
    ).toBe("/foo#section/**/bar");
    expect(
      urlTransformers.redactIdLikeSegmentsInUrl(
        { method: "trackPageView" },
        "https://example.com/foo/123/bar?x=456#section/789",
      ),
    ).toBe("https://example.com/foo/**/bar?x=**#section/**");
  });

  it("preserves relative paths without forcing a leading slash", () => {
    expect(
      urlTransformers.redactIdLikeSegmentsInUrl(
        { method: "trackDownload" },
        "foo/123/bar",
      ),
    ).toBe("foo/**/bar");
  });
});