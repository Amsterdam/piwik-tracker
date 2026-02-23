import { describe, it, expect } from '@jest/globals'
import { forTesting } from './useOutboundClickListener'

describe('extractBaseDomain', () => {
  it('should return null for invalid inputs', () => {
    expect(forTesting.extractBaseDomain('')).toBeNull()
    expect(forTesting.extractBaseDomain('localhost')).toBeNull()
    expect(forTesting.extractBaseDomain('example')).toBeNull()
  })

  it('should extract base domain from simple domains', () => {
    expect(forTesting.extractBaseDomain('example.com')).toBe('example.com')
    expect(forTesting.extractBaseDomain('sub.example.com')).toBe('example.com')
    expect(forTesting.extractBaseDomain('a.b.c.example.com')).toBe('example.com')
  })

  it('should handle various valid domain formats', () => {
    expect(forTesting.extractBaseDomain('blog.example.org')).toBe('example.org')
    expect(forTesting.extractBaseDomain('api.service.example.net')).toBe('example.net')
    expect(forTesting.extractBaseDomain('x.y.z.example.io')).toBe('example.io')
  })
})