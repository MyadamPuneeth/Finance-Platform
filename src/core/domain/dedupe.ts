import { categorize } from './categorize';
import type { Transaction, TransactionType } from './types';
import type { ValidatedCsvRow } from '../validation/csvRowSchema';

export function buildDedupeKey(row: { date: string; amount: number; type: TransactionType; description: string }): string {
  return `${row.date}|${row.amount}|${row.type}|${row.description.trim().toLowerCase()}`;
}

export function planImport(
  rawRows: ValidatedCsvRow[],
  existingKeys: Set<string>,
): { toInsert: Transaction[]; duplicateCount: number } {
  const seen = new Set(existingKeys);
  const toInsert: Transaction[] = [];
  let duplicateCount = 0;

  for (const row of rawRows) {
    const dedupeKey = buildDedupeKey(row);
    if (seen.has(dedupeKey)) {
      duplicateCount += 1;
      continue;
    }
    seen.add(dedupeKey);
    toInsert.push({
      id: crypto.randomUUID(),
      date: row.date,
      description: row.description,
      amount: row.amount,
      type: row.type,
      category: categorize(row.description, row.type),
      categoryIsManual: false,
      account: row.account,
      dedupeKey,
      importedAt: new Date().toISOString(),
    });
  }

  return { toInsert, duplicateCount };
}
