import { defaultUrlTransformer } from './urlTransformers';

describe('defaultUrlTransformer', () => {
  it('replaces any path segment with more than one digit by **', () => {
    expect(defaultUrlTransformer({ method: 'trackPageView' }, '/foo/12/bar')).toBe(
      '/foo/12/bar'
    );
    expect(defaultUrlTransformer({ method: 'trackPageView' }, '/foo/123/bar')).toBe(
      '/foo/**/bar'
    );
    expect(defaultUrlTransformer({ method: 'trackPageView' }, '/foo/a1b23/bar')).toBe(
      '/foo/**/bar'
    );
  });

  it('preserves query and hash on absolute urls', () => {
    expect(
      defaultUrlTransformer(
        { method: 'trackLinkClick' },
        'https://example.com/foo/123/bar?x=123#section'
      )
    ).toBe('https://example.com/foo/**/bar?x=123#section');
  });

  it('preserves relative paths without forcing a leading slash', () => {
    expect(defaultUrlTransformer({ method: 'trackDownload' }, 'foo/123/bar')).toBe(
      'foo/**/bar'
    );
  });
});
