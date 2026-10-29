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
      <header className={styles.header}>
        <h2>Import transactions</h2>
        <p className={styles.subtitle}>
          Upload a CSV of your bank transactions. Rows already imported are skipped automatically.
        </p>
      </header>

      <div className={styles.chips} role="group" aria-label="Expected CSV headers">
        <code className={styles.chip}>date</code>
        <code className={styles.chip}>description</code>
        <code className={styles.chip}>amount</code>
        <code className={`${styles.chip} ${styles.optional}`}>type?</code>
        <code className={`${styles.chip} ${styles.optional}`}>account?</code>
      </div>
      <p className={styles.hint}>
        Dates use YYYY-MM-DD. Headers ending in ? are optional. <code>type</code> is <code>income</code> or{' '}
        <code>expense</code>.
      </p>

      <label htmlFor="csv-file" className={`${styles.drop} ${importing ? styles.dropDisabled : ''}`}>
        <span className={styles.dropTitle}>{importing ? 'Importing…' : 'Choose a CSV file'}</span>
        <span className={styles.dropHint}>Click here or drag a .csv file onto this card</span>
        <input
          id="csv-file"
          ref={inputRef}
          className={styles.fileInput}
          type="file"
          accept=".csv"
          disabled={importing}
          onChange={handleChange}
        />
      </label>

      <p role="status" className={styles.status}>
        {importing ? 'Importing…' : ''}
      </p>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}

      {lastReport && !importing && (
        <section className={styles.report} aria-live="polite">
          <h3>Import results</h3>
          <p className={styles.status}>Total rows read: {lastReport.totalRows}</p>
          <ul className={styles.stats}>
            <li className={`${styles.tile} ${styles.ok}`}>
              <span className={styles.num}>{lastReport.imported}</span>
              <span>Imported</span>
            </li>
            <li className={`${styles.tile} ${styles.warn}`}>
              <span className={styles.num}>{lastReport.duplicates}</span>
              <span>Duplicates skipped</span>
            </li>
            <li className={`${styles.tile} ${styles.bad}`}>
              <span className={styles.num}>{lastReport.invalid}</span>
              <span>Invalid rows</span>
            </li>
          </ul>
          {lastReport.invalid > 0 && (
            <details className={styles.details}>
              <summary>View invalid rows ({lastReport.invalid})</summary>
              <div className={styles.tableWrap}>
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
              </div>
            </details>
          )}
        </section>
      )}
    </div>
  );
}
