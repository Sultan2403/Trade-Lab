import { useRef, useState } from "react";
import {
  Check,
  Download,
  FileText,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useTrades from "../../../Hooks/useTrades";

const isCsvFile = (file) => {
  if (!file) return false;

  const fileType = file.type?.toLowerCase();
  const fileName = file.name?.toLowerCase() ?? "";

  return (
    fileType === "text/csv" ||
    fileType === "application/vnd.ms-excel" ||
    fileName.endsWith(".csv")
  );
};

function ImportResultModal({ isOpen, onClose, summary }) {
  if (!isOpen) return null;

  const hasFailures = summary.failedCount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 px-4">
      <div
        className="w-full max-w-xl rounded-panel border border-border bg-surface-card p-6 text-center shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-summary-title"
      >
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-state-success text-text-inverse">
          <Check size={30} />
        </span>

        <h2
          id="import-summary-title"
          className="mt-5 text-2xl font-semibold text-text-primary"
        >
          Import Complete!
        </h2>

        <div className="mx-auto mt-6 grid max-w-xs grid-cols-2 gap-4">
          <div>
            <p className="text-4xl font-semibold text-state-success">
              {summary.successCount}
            </p>
            <p className="mt-1 text-body text-text-secondary">
              Trades Imported
            </p>
          </div>
          <div>
            <p className="text-4xl font-semibold text-state-danger">
              {summary.failedCount}
            </p>
            <p className="mt-1 text-body text-text-secondary">Trades Failed</p>
          </div>
        </div>

        <p className="mt-6 text-caption text-text-secondary">
          {hasFailures
            ? "Failed trades were skipped due to validation errors."
            : "All rows were imported successfully."}
        </p>

        <div className="mt-6">
          <button
            type="button"
            onClick={onClose}
            className="ui-btn-primary w-full py-2 text-caption"
          >
            Done
          </button>
        </div>

        {hasFailures ? (
          <button
            type="button"
            className="mt-3 text-body font-medium text-brand-900 hover:underline"
            onClick={onClose}
          >
            View Details
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function ImportTrades() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const { loading, error, data, uploadCsvTrades } = useTrades();

  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [importSummary, setImportSummary] = useState({
    successCount: 0,
    failedCount: 0,
  });
  const [isResultOpen, setIsResultOpen] = useState(false);

  const resetFileSelection = () => {
    setSelectedFile(null);
    setValidationError("");

    if (fileRef.current) fileRef.current.value = "";
  };

  const handleFileSelect = (files) => {
    if (!files?.length) return;

    if (selectedFile) {
      setValidationError(
        "Remove the current file before selecting another one.",
      );
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
      setValidationError(
        "Remove the current file before dropping another one.",
      );
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
  };

  useEffect(() => {
    if (data?.success) {
      const { imported, skipped } = data;
      setImportSummary({
        successCount: imported,
        failedCount: skipped,
      });

      setIsResultOpen(true);
    }
  }, [data]);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-[980px] space-y-6 pb-10"
      >
        <section className="rounded-panel border border-border bg-surface-card p-6">
          <h2 className="text-body font-semibold text-text-primary">
            File Requirements
          </h2>
          <ul className="mt-3 space-y-2 flex flex-col text-caption text-text-secondary">
            <li className="inline-flex items-center gap-2">
              <FileText size={14} /> CSV files only
            </li>
            <li className="inline-flex items-center gap-2">
              <FileText size={14} /> Upload one file only
            </li>
          </ul>
        </section>

        <section className="rounded-panel border border-border bg-surface-card p-6">
          <p className="text-caption text-text-secondary">
            Upload your CSV file for processing.
          </p>

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
            <span
              className={`mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full ${selectedFile ? "bg-state-success/15 text-state-success" : "bg-brand-900/10 text-brand-900"}`}
            >
              {selectedFile ? <FileText size={22} /> : <Upload size={22} />}
            </span>

            <p className="mt-4 text-body font-semibold text-text-primary">
              {selectedFile
                ? "CSV file selected"
                : "Drag and drop your CSV file here"}
            </p>
            <p className="mt-1 text-caption text-text-secondary">
              {selectedFile ? selectedFile.name : "or click to browse"}
            </p>

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

            {validationError ? (
              <p className="mt-4 inline-flex items-center gap-2 text-caption text-state-danger">
                <XCircle size={14} /> {validationError}
              </p>
            ) : null}

            {!validationError && error ? (
              <p className="mt-4 text-caption text-state-danger">
                {error?.response?.data?.message ||
                  "Unable to import CSV right now."}
              </p>
            ) : null}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-caption font-medium text-text-secondary hover:text-text-primary"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="ui-btn-primary py-2 text-caption disabled:opacity-70"
              disabled={loading}
            >
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
              <p className="text-caption text-text-secondary">
                Not sure about the format? Download our sample template.
              </p>
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

      <ImportResultModal
        isOpen={isResultOpen}
        summary={importSummary}
        onClose={() => {
          setIsResultOpen(false);
          navigate("/trades");
        }}
      />
    </>
  );
}
