import Papa from 'papaparse';
import type { Transaction } from '../domain/types';

export function downloadBlob(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function buildTransactionsCsv(transactions: Transaction[]): string {
  return Papa.unparse(transactions);
}
