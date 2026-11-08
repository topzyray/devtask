import { describe, expect, it } from 'vitest'
import { isValidDateOnly, toDateOnly } from './date.ts'

describe('isValidDateOnly', () => {
  it('accepts real calendar dates, including leap day', () => {
    expect(isValidDateOnly('2026-11-08')).toBe(true)
    expect(isValidDateOnly('2000-02-29')).toBe(true)
    expect(isValidDateOnly('0004-02-29')).toBe(true)
  })

  it('rejects impossible days, unpadded dates, and non-leap days', () => {
    expect(isValidDateOnly('2026-02-31')).toBe(false)
    expect(isValidDateOnly('2026-04-31')).toBe(false)
    expect(isValidDateOnly('2026-13-01')).toBe(false)
    expect(isValidDateOnly('2026-00-10')).toBe(false)
    expect(isValidDateOnly('1900-02-29')).toBe(false)
    expect(isValidDateOnly('0100-02-29')).toBe(false)
    expect(isValidDateOnly('2026-11-8')).toBe(false)
    expect(isValidDateOnly('')).toBe(false)
    expect(isValidDateOnly('08-11-2026')).toBe(false)
  })
})

describe('toDateOnly', () => {
  it('formats the local calendar date', () => {
    expect(toDateOnly(new Date(2026, 10, 8, 23, 30))).toBe('2026-11-08')
  })
})
