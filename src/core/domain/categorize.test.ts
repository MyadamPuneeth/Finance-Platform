import { describe, expect, it } from 'vitest';
import { categorize } from './categorize';

describe('categorize', () => {
  it('always returns Income for income transactions regardless of description', () => {
    expect(categorize('Monthly paycheck', 'income')).toBe('Income');
    expect(categorize('Uber ride', 'income')).toBe('Income');
  });

  it('matches keywords for each non-income category', () => {
    expect(categorize('Starbucks Coffee', 'expense')).toBe('Food');
    expect(categorize('Amazon.com order', 'expense')).toBe('Shopping');
    expect(categorize('Uber trip home', 'expense')).toBe('Transport');
    expect(categorize('Verizon phone bill', 'expense')).toBe('Bills');
    expect(categorize('Monthly rent payment', 'expense')).toBe('Rent');
    expect(categorize('CVS pharmacy', 'expense')).toBe('Healthcare');
  });

  it('is case-insensitive', () => {
    expect(categorize('STARBUCKS COFFEE', 'expense')).toBe('Food');
    expect(categorize('wAlMaRt', 'expense')).toBe('Shopping');
  });

  it('falls back to Other when nothing matches', () => {
    expect(categorize('Mystery charge XYZ123', 'expense')).toBe('Other');
  });
});
