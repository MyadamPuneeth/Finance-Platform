import { useCallback, useState } from 'react';
import { planImport } from '../core/domain/dedupe';
import { addTransactionsBulk, getAllDedupeKeys } from '../core/services/transactionsRepo';
import { parseCsvFile } from '../core/utils/csv';
import { parseCsvRow } from '../core/validation/csvRowSchema';
import type { ValidatedCsvRow } from '../core/validation/csvRowSchema';

export interface ImportReport {
  totalRows: number;
  imported: number;
  duplicates: number;
  invalid: number;
  invalidDetails: { rowNumber: number; reason: string; raw: Record<string, string> }[];
}

export function useImportCsv() {
  const [importing, setImporting] = useState(false);
  const [lastReport, setLastReport] = useState<ImportReport | null>(null);

  const importFile = useCallback(async (file: File): Promise<ImportReport> => {
    setImporting(true);
    try {
      const rawRows = await parseCsvFile(file);
      const validRows: ValidatedCsvRow[] = [];
      const invalidDetails: ImportReport['invalidDetails'] = [];

      rawRows.forEach((raw, i) => {
        const result = parseCsvRow(raw, i + 1);
        if (result.ok) validRows.push(result.row);
        else invalidDetails.push({ rowNumber: i + 1, reason: result.reason, raw });
      });

      const existingKeys = await getAllDedupeKeys();
      const { toInsert, duplicateCount } = planImport(validRows, existingKeys);
      await addTransactionsBulk(toInsert);

      const report: ImportReport = {
        totalRows: rawRows.length,
        imported: toInsert.length,
        duplicates: duplicateCount,
        invalid: invalidDetails.length,
        invalidDetails,
      };
      setLastReport(report);
      return report;
    } finally {
      setImporting(false);
    }
  }, []);

  return { importing, lastReport, importFile };
}
