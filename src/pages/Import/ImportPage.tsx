import { useRef, useState } from 'react';
import { useImportCsv } from '../../adapters';
import styles from './ImportPage.module.css';

export function ImportPage() {
  const { importing, lastReport, importFile } = useImportCsv();
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    try {
      await importFile(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not import that file. Check the format and try again.');
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>Import transactions</h2>
      <p>
        Upload a CSV file with columns <code>date</code> (YYYY-MM-DD), <code>description</code> and{' '}
        <code>amount</code>. You can optionally include <code>type</code> (<code>income</code> or{' '}
        <code>expense</code>) and <code>account</code>. Rows that match a previously imported
        transaction are skipped automatically.
      </p>

      <div className={styles.field}>
        <label htmlFor="csv-file" className={styles.label}>
          CSV file
        </label>
        <input
          id="csv-file"
          ref={inputRef}
          type="file"
          accept=".csv"
          disabled={importing}
          onChange={handleChange}
        />
      </div>

      {importing && (
        <p role="status" className={styles.status}>
          Importing…
        </p>
      )}
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}

      {lastReport && !importing && (
        <section className={styles.report} aria-live="polite">
          <h3>Import results</h3>
          <ul className={styles.stats}>
            <li>Total rows read: {lastReport.totalRows}</li>
            <li>Imported: {lastReport.imported}</li>
            <li>Duplicates skipped: {lastReport.duplicates}</li>
            <li>Invalid rows: {lastReport.invalid}</li>
          </ul>
          {lastReport.invalid > 0 && (
            <details className={styles.details}>
              <summary>View invalid rows ({lastReport.invalid})</summary>
              <table className={styles.invalidTable}>
                <thead>
                  <tr>
                    <th scope="col">Row</th>
                    <th scope="col">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {lastReport.invalidDetails.map((detail) => (
                    <tr key={detail.rowNumber}>
                      <td>{detail.rowNumber}</td>
                      <td>{detail.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          )}
        </section>
      )}
    </div>
  );
}
