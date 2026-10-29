import { z } from 'zod';
import type { TransactionType } from '../domain/types';

export interface ValidatedCsvRow {
  date: string; // ISO yyyy-mm-dd
  description: string;
  amount: number; // unsigned magnitude
  type: TransactionType;
  account?: string;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/** Accepts 'YYYY-MM-DD' or 'MM/DD/YYYY', validates the calendar date, returns ISO 'yyyy-mm-dd' or null. */
function normalizeDate(raw: string): string | null {
  const trimmed = raw.trim();

  let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (m) {
    const [, y, mo, d] = m;
    const year = Number(y);
    const month = Number(mo);
    const day = Number(d);
    if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) return null;
    return trimmed;
  }

  m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed);
  if (m) {
    const [, mo, d, y] = m;
    const year = Number(y);
    const month = Number(mo);
    const day = Number(d);
    if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) return null;
    return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  return null;
}

const rawCsvRowSchema = z
  .object({
    date: z.string(),
    description: z.string(),
    amount: z.string(),
    type: z.string().optional(),
    account: z.string().optional(),
  })
  .transform((val, ctx): ValidatedCsvRow => {
    const isoDate = normalizeDate(val.date);
    if (!isoDate) {
      ctx.addIssue({ code: 'custom', message: `invalid date '${val.date}'` });
      return z.NEVER;
    }

    const description = val.description.trim();
    if (!description) {
      ctx.addIssue({ code: 'custom', message: 'description is required' });
      return z.NEVER;
    }

    const amount = Number(val.amount);
    if (!Number.isFinite(amount) || amount === 0) {
      ctx.addIssue({ code: 'custom', message: `invalid amount '${val.amount}'` });
      return z.NEVER;
    }

    // `type` column wins when present/valid; otherwise derive from the amount's sign —
    // the common bank-export convention where negative = money out (expense), positive = money in (income).
    const rawType = val.type?.trim().toLowerCase();
    const type: TransactionType =
      rawType === 'income' || rawType === 'expense' ? rawType : amount < 0 ? 'expense' : 'income';

    return {
      date: isoDate,
      description,
      amount: Math.abs(amount),
      type,
      account: val.account?.trim() || undefined,
    };
  });

export function parseCsvRow(
  raw: Record<string, string>,
  rowNumber: number,
): { ok: true; row: ValidatedCsvRow } | { ok: false; reason: string } {
  const result = rawCsvRowSchema.safeParse(raw);
  if (result.success) return { ok: true, row: result.data };
  const issue = result.error.issues[0];
  return { ok: false, reason: `row ${rowNumber}: ${issue?.message ?? 'invalid row'}` };
}
