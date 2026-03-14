import { useMemo, useRef, useState } from "react";
import { CheckCircle2, Download, FileText, Trash2, Upload, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useTrades from "../../../Hooks/useTrades";

const REQUIRED_COLUMNS = [
  "pair",
  "direction",
  "status",
  "entry_price",
  "exit_price",
  "size",
  "openedAt",
  "closedAt",
];

const PREVIEW_COLUMNS = ["pair", "direction", "status", "entry_price", "exit_price", "size"];

const isCsvFile = (file) => {
  if (!file) return false;

  const fileType = file.type?.toLowerCase();
  const fileName = file.name?.toLowerCase() ?? "";

  return fileType === "text/csv" || fileType === "application/vnd.ms-excel" || fileName.endsWith(".csv");
};

function ImportPreviewModal({ isOpen, onClose, summary }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 px-4">
      <div
        className="w-full max-w-3xl rounded-panel border border-border bg-surface-card p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-summary-title"
      >
        <h2 id="import-summary-title" className="text-xl font-semibold text-text-primary">
          Import Complete
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="rounded-panel border border-state-success/30 bg-state-success/10 p-4">
            <p className="text-caption text-text-secondary">Successfully Imported</p>
            <p className="mt-1 text-xl font-semibold text-state-success">{summary.successCount}</p>
          </div>
          <div className="rounded-panel border border-state-danger/30 bg-state-danger/10 p-4">
            <p className="text-caption text-text-secondary">Failed</p>
            <p className="mt-1 text-xl font-semibold text-state-danger">{summary.failedCount}</p>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-body font-semibold text-text-primary">Trade preview (up to 5)</h3>

          {summary.previewTrades.length > 0 ? (
            <div className="mt-3 overflow-hidden rounded-md border border-border">
              <table className="min-w-full divide-y divide-border text-left">
                <thead className="bg-surface-muted">
                  <tr>
                    {PREVIEW_COLUMNS.map((column) => (
                      <th key={column} className="px-3 py-2 text-caption font-semibold uppercase tracking-wide text-text-secondary">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white text-caption">
                  {summary.previewTrades.map((trade, index) => (
                    <tr key={`${trade.pair ?? "trade"}-${index}`}>
                      {PREVIEW_COLUMNS.map((column) => (
                        <td key={column} className="px-3 py-2 text-text-primary">
                          {trade?.[column] ?? "--"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-2 text-caption text-text-secondary">No preview trades were returned by the API.</p>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button type="button" onClick={onClose} className="ui-btn-primary py-2 text-caption">
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ImportTrades() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const { loading, error, uploadCsvTrades } = useTrades();

  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [importSummary, setImportSummary] = useState({
    successCount: 0,
    failedCount: 0,
    previewTrades: [],
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const instructions = useMemo(
    () => `Upload your trades CSV. Required columns: ${REQUIRED_COLUMNS.join(", ")}.`,
    [],
  );

  const resetFileSelection = () => {
    setSelectedFile(null);
    setValidationError("");

    if (fileRef.current) fileRef.current.value = "";
  };

  const handleFileSelect = (files) => {
    if (!files?.length) return;

    if (selectedFile) {
      setValidationError("Remove the current file before selecting another one.");
      return;
    }

    if (files.length > 1) {
      setValidationError("Please upload one CSV file at a time.");
      return;
    }

    const [file] = files;

    if (!isCsvFile(file)) {
      setValidationError("Only .csv files are allowed.");
      setSelectedFile(null);
      return;
    }

    setValidationError("");
    setSelectedFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    if (selectedFile) {
      setValidationError("Remove the current file before dropping another one.");
      return;
    }

    handleFileSelect(event.dataTransfer.files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setValidationError("Please select a CSV file before importing.");
      return;
    }

    if (!isCsvFile(selectedFile)) {
      setValidationError("Only .csv files are allowed.");
      return;
    }

    setValidationError("");

    const response = await uploadCsvTrades(selectedFile);

    if (!response?.data?.success) return;

    const payload = response.data;

    setImportSummary({
      successCount: payload.imported ?? payload.successCount ?? payload.summary?.imported ?? 0,
      failedCount: payload.skipped ?? payload.failedCount ?? payload.summary?.failed ?? 0,
      previewTrades: (payload.previewTrades ?? payload.trades ?? payload.data?.previewTrades ?? []).slice(0, 5),
    });

    setIsPreviewOpen(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-[980px] space-y-6 pb-10">
        <section className="rounded-panel border border-border bg-surface-card p-6">
          <h2 className="text-body font-semibold text-text-primary">File Requirements</h2>
          <ul className="mt-3 space-y-2 text-caption text-text-secondary">
            <li className="inline-flex items-center gap-2">
              <FileText size={14} /> CSV files only
            </li>
            <li className="inline-flex items-center gap-2">
              <FileText size={14} /> Upload one file only
            </li>
          </ul>
        </section>

        <section className="rounded-panel border border-border bg-surface-card p-6">
          <p className="text-caption text-text-secondary">{instructions}</p>

          <div
            className={`mt-4 rounded-panel border-2 border-dashed p-10 text-center transition-colors ${
              isDragging ? "border-brand-700 bg-brand-50" : "border-border"
            }`}
            onDragOver={(event) => {
              event.preventDefault();
              if (!selectedFile) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-900/10 text-brand-900">
              <Upload size={22} />
            </span>

            <p className="mt-4 text-body font-semibold text-text-primary">Drag and drop your CSV file here</p>
            <p className="mt-1 text-caption text-text-secondary">or click to browse</p>

            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={(event) => handleFileSelect(event.target.files)}
              aria-label="Upload CSV file"
              disabled={Boolean(selectedFile)}
            />

            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="ui-btn-primary py-2 text-caption disabled:cursor-not-allowed disabled:opacity-60"
                disabled={Boolean(selectedFile)}
              >
                Choose File
              </button>

              {selectedFile ? (
                <button
                  type="button"
                  onClick={resetFileSelection}
                  className="rounded-pill border border-border px-4 py-2 text-caption font-medium text-text-secondary transition-colors hover:bg-surface-muted"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Trash2 size={14} /> Remove File
                  </span>
                </button>
              ) : null}
            </div>

            {selectedFile ? (
              <p className="mt-4 inline-flex items-center gap-2 text-caption text-state-success">
                <CheckCircle2 size={14} /> {selectedFile.name}
              </p>
            ) : null}

            {validationError ? (
              <p className="mt-4 inline-flex items-center gap-2 text-caption text-state-danger">
                <XCircle size={14} /> {validationError}
              </p>
            ) : null}

            {!validationError && error ? (
              <p className="mt-4 text-caption text-state-danger">
                {error?.response?.data?.message || "Unable to import CSV right now."}
              </p>
            ) : null}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <button
              type="button"
              onClick={() => navigate("/trades")}
              className="text-caption font-medium text-text-secondary hover:text-text-primary"
            >
              Cancel
            </button>

            <button type="submit" className="ui-btn-primary py-2 text-caption disabled:opacity-70" disabled={loading}>
              {loading ? "Importing..." : "Import"}
            </button>
          </div>
        </section>

        <section className="flex items-center justify-between rounded-panel border border-border bg-surface-card px-6 py-5">
          <div className="inline-flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-900 text-text-inverse">
              <Download size={16} />
            </span>

            <div>
              <h2 className="text-body font-semibold">Download CSV Template</h2>
              <p className="text-caption text-text-secondary">Not sure about the format? Download our sample template.</p>
            </div>
          </div>

          <a
            href="/assets/templates/trade-import-template.csv"
            download
            className="rounded-pill border border-brand-900 px-4 py-2 text-caption font-medium text-brand-900 hover:bg-brand-50"
          >
            Download
          </a>
        </section>
      </form>

      <ImportPreviewModal
        isOpen={isPreviewOpen}
        summary={importSummary}
        onClose={() => {
          setIsPreviewOpen(false);
          navigate("/trades");
        }}
      />
    </>
  );
}
