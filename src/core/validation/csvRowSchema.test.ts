import { describe, expect, it } from 'vitest';
import { parseCsvRow } from './csvRowSchema';

describe('parseCsvRow', () => {
  it('accepts a valid ISO-date row and passes fields through', () => {
    const result = parseCsvRow({ date: '2024-05-01', description: 'Starbucks', amount: '5.50', type: 'expense' }, 1);
    expect(result).toEqual({
      ok: true,
      row: { date: '2024-05-01', description: 'Starbucks', amount: 5.5, type: 'expense', account: undefined },
    });
  });

  it('normalizes MM/DD/YYYY to ISO yyyy-mm-dd', () => {
    const result = parseCsvRow({ date: '05/01/2024', description: 'Starbucks', amount: '5.50' }, 1);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.row.date).toBe('2024-05-01');
  });

  it('rejects an invalid calendar date', () => {
    const result = parseCsvRow({ date: '13/45/2024', description: 'x', amount: '5' }, 3);
    expect(result).toEqual({ ok: false, reason: "row 3: invalid date '13/45/2024'" });
  });

  it('rejects a missing/empty description', () => {
    const result = parseCsvRow({ date: '2024-05-01', description: '  ', amount: '5' }, 2);
    expect(result.ok).toBe(false);
  });

  it('rejects a non-numeric or zero amount', () => {
    expect(parseCsvRow({ date: '2024-05-01', description: 'x', amount: 'abc' }, 1).ok).toBe(false);
    expect(parseCsvRow({ date: '2024-05-01', description: 'x', amount: '0' }, 1).ok).toBe(false);
  });

  it('derives type from the amount sign when the type column is absent', () => {
    const expense = parseCsvRow({ date: '2024-05-01', description: 'x', amount: '-20' }, 1);
    const income = parseCsvRow({ date: '2024-05-01', description: 'x', amount: '20' }, 1);
    expect(expense.ok && expense.row.type).toBe('expense');
    expect(expense.ok && expense.row.amount).toBe(20);
    expect(income.ok && income.row.type).toBe('income');
  });
});
