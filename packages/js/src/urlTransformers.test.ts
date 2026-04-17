import { urlTransformers } from './urlTransformers';

describe('urlTransformers.redactIdLikePathSegments', () => {
  it('replaces any path segment with more than one digit by **', () => {
    expect(urlTransformers.redactIdLikePathSegments({ method: 'trackPageView' }, '/foo/12/bar')).toBe(
      '/foo/12/bar'
    );
    expect(urlTransformers.redactIdLikePathSegments({ method: 'trackPageView' }, '/foo/123/bar')).toBe(
      '/foo/**/bar'
    );
    expect(urlTransformers.redactIdLikePathSegments({ method: 'trackPageView' }, '/foo/a1b23/bar')).toBe(
      '/foo/**/bar'
    );
  });

  it('preserves query and hash on absolute urls', () => {
    expect(
      urlTransformers.redactIdLikePathSegments(
        { method: 'trackLinkClick' },
        'https://example.com/foo/123/bar?x=123#section'
      )
    ).toBe('https://example.com/foo/**/bar?x=123#section');
  });

  it('preserves relative paths without forcing a leading slash', () => {
    expect(urlTransformers.redactIdLikePathSegments({ method: 'trackDownload' }, 'foo/123/bar')).toBe(
      'foo/**/bar'
    );
  });
});
