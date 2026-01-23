import { Lock, Download } from 'lucide-react';

/**
 * Result Item Component
 * Displays a single file compression result with multiple format downloads
 * 
 * @param {Array} items - Array of compression results for the same file
 * @param {Function} formatFileSize - File size formatter function
 */
export default function ResultItem({ items, formatFileSize }) {
    if (!items || items.length === 0) return null;

    // Use first item for common info
    const primaryItem = items[0];
    const file = primaryItem.file;

    // Determine overall status (prioritize: error > locked > uploading > compressing > done)
    let overallStatus = 'done';
    let overallProgress = 100;
    let errorMessage = null;

    for (const item of items) {
        if (item.status === 'error') {
            overallStatus = 'error';
            errorMessage = item.error;
            break;
        } else if (item.status === 'locked') {
            overallStatus = 'locked';
        } else if (item.status === 'uploading' || item.status === 'compressing') {
            if (overallStatus === 'done') {
                overallStatus = item.status;
                overallProgress = item.progress || 0;
            }
        }
    }

    // Get completed downloads
    const completedDownloads = items.filter(item => item.status === 'done' && item.downloadUrl);

    return (
        <div id={`result-${primaryItem.id}`} className="result-item">
            <div className="file-info">
                <div className="file-icon">
                    {overallStatus === 'locked'
                        ? <Lock size={24} color="#888" />
                        : file.name.split('.').pop().toUpperCase()
                    }
                </div>
                <div className="file-details">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{formatFileSize(file.size)}</span>
                </div>
            </div>

            <div className="status-area">
                {/* Uploading or Compressing */}
                {(overallStatus === 'uploading' || overallStatus === 'compressing') && (
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${overallProgress}%` }}></div>
                    </div>
                )}

                {/* Locked (quota exceeded) */}
                {overallStatus === 'locked' && (
                    <div className="locked-msg" style={{
                        width: '100%',
                        textAlign: 'center',
                        color: '#888',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px'
                    }}>
                        <span style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>
                            Maximum uploads reached
                        </span>
                        <span style={{ fontSize: '0.9rem' }}>
                            Optimize this file? <a
                                href="/checkout/web?tier=pro"
                                style={{ color: '#8cc63f', fontWeight: 'bold', textDecoration: 'none' }}
                            >
                                Get Web Pro!
                            </a>
                        </span>
                    </div>
                )}

                {/* Error */}
                {overallStatus === 'error' && (
                    <span className="error-msg">{errorMessage}</span>
                )}

                {/* Success - Multiple Download Buttons */}
                {overallStatus === 'done' && completedDownloads.length > 0 && (
                    <>
                        <span className="success-badge">Finished!</span>
                        <span className="file-size" style={{ color: 'var(--primary)' }}>
                            Saved {Math.round(completedDownloads[0].stats.saved)}% ({formatFileSize(completedDownloads[0].stats.compressed)})
                        </span>
                        <div>
                            {completedDownloads.map((item, index) => {
                                // Determine format label
                                let formatLabel = 'Original';
                                if (item.filename) {
                                    const ext = item.filename.split('.').pop().toUpperCase();
                                    formatLabel = ext;
                                }

                                return (
                                    <a
                                        key={index}
                                        href={item.downloadUrl}
                                        download={item.filename}
                                        className="download-btn"
                                    >
                                        <Download size={16} />
                                        {formatLabel}
                                    </a>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
