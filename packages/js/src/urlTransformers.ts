import type { UrlTransformer } from "./types";

const digitCount = (value: string): number => (value.match(/\d/g) ?? []).length;

const redactIdLikeSegmentsInUrl: UrlTransformer = (_meta, inputUrl) => {
  if (!inputUrl || inputUrl.startsWith("?") || inputUrl.startsWith("#")) {
    return inputUrl;
  }

  const isAbsoluteUrl =
    inputUrl.startsWith("https://") || inputUrl.startsWith("http://");
  const url = isAbsoluteUrl
    ? new URL(inputUrl)
    : new URL(inputUrl, "http://placeholder/");

  const pathnameSegments = url.pathname
    .split("/")
    .map((segment) => (digitCount(segment) > 2 ? "**" : segment));

  url.pathname = pathnameSegments.join("/");

  const searchParams = new URLSearchParams(url.search);
  for (const [key, value] of searchParams.entries()) {
    if (digitCount(value) > 2) {
      searchParams.set(key, "**");
    }
  }
  url.search = searchParams.toString();

  if (url.hash) {
    const hashSegments = url.hash
      .slice(1)
      .split("/")
      .map((segment) => (digitCount(segment) > 2 ? "**" : segment));
    url.hash = hashSegments.length > 0 ? `#${hashSegments.join("/")}` : "";
  }

  if (isAbsoluteUrl) {
    return url.toString();
  }

  const result = `${url.pathname}${url.search}${url.hash}`;

  if (!inputUrl.startsWith("/") && result.startsWith("/")) {
    return result.slice(1);
  }

  return result;
};

export const urlTransformers = {
  redactIdLikeSegmentsInUrl,
};
