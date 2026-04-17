import type { UrlTransformMeta, UrlTransformer } from "./types";

const digitCount = (value: string): number => (value.match(/\d/g) ?? []).length;

const redactIdLikePathSegments: UrlTransformer = (
  _meta: UrlTransformMeta,
  inputUrl: string,
) => {
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
  redactIdLikePathSegments,
};
