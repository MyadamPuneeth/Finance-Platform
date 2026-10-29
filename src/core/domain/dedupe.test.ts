import { describe, expect, it } from 'vitest';
import { buildDedupeKey, planImport } from './dedupe';
import type { ValidatedCsvRow } from '../validation/csvRowSchema';

function row(overrides: Partial<ValidatedCsvRow> = {}): ValidatedCsvRow {
  return {
    date: '2024-05-01',
    description: 'Starbucks Coffee',
    amount: 5.5,
    type: 'expense',
    ...overrides,
  };
}

describe('buildDedupeKey', () => {
  it('builds a stable composite key', () => {
    expect(buildDedupeKey(row())).toBe('2024-05-01|5.5|expense|starbucks coffee');
  });

  it('normalizes description case and whitespace', () => {
    expect(buildDedupeKey(row({ description: '  Starbucks Coffee  ' }))).toBe(
      '2024-05-01|5.5|expense|starbucks coffee',
    );
  });
});

describe('planImport', () => {
  it('inserts valid rows and categorizes them', () => {
    const { toInsert, duplicateCount } = planImport([row()], new Set());
    expect(toInsert).toHaveLength(1);
    expect(duplicateCount).toBe(0);
    expect(toInsert[0].category).toBe('Food');
    expect(toInsert[0].categoryIsManual).toBe(false);
    expect(toInsert[0].dedupeKey).toBe('2024-05-01|5.5|expense|starbucks coffee');
  });

  it('skips rows that duplicate an existing key', () => {
    const existing = new Set([buildDedupeKey(row())]);
    const { toInsert, duplicateCount } = planImport([row()], existing);
    expect(toInsert).toHaveLength(0);
    expect(duplicateCount).toBe(1);
  });

  it('skips duplicates within the same batch', () => {
    const { toInsert, duplicateCount } = planImport([row(), row()], new Set());
    expect(toInsert).toHaveLength(1);
    expect(duplicateCount).toBe(1);
  });
});
