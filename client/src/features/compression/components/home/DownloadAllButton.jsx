/**
 * Download All Button Component
 * Shows "Download All as ZIP" button when multiple files are completed
 * 
 * @param {boolean} showDownloadAll - Whether to show the button
 * @param {Function} onDownloadAll - Click handler for download
 * @param {boolean} isProcessing - Whether ZIP is being generated
 */
export default function DownloadAllButton({ showDownloadAll, onDownloadAll, isProcessing }) {
    if (!showDownloadAll) return null;

    return (
        <div>
            <button
                className="download-btn"
                onClick={onDownloadAll}
                disabled={isProcessing}
            >
                {isProcessing ? "Zipping..." : "Download All as ZIP"}
            </button>
        </div>
    );
}
