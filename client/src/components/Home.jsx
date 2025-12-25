import { useState, useRef } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { UploadCloud } from 'lucide-react';
import FAQ from './FAQ';

export default function Home() {
    const [items, setItems] = useState([]);
    const [downloadAllVisible, setDownloadAllVisible] = useState(false);
    const fileInputRef = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Constants
    const MAX_LIMIT = 20;
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB

    // Helper to format file size
    const formatFileSize = (bytes) => {
        if (bytes >= 1024 * 1024) {
            return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        }
        return (bytes / 1024).toFixed(1) + ' KB';
    };

    const checkLimit = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/check-limit");
            const data = await res.json();
            return data.remaining;
        } catch (e) {
            console.error("Failed to check limit", e);
            return MAX_LIMIT; // Fail open
        }
    };

    const handleFiles = async (files) => {
        if (!files || files.length === 0) return;

        // Validate size first
        const validFiles = Array.from(files).filter(file => {
            if (file.size > MAX_SIZE) {
                alert(`${file.name} is too large (max 10MB).`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        // Check backend limit
        const remaining = await checkLimit();
        if (remaining <= 0) {
            alert("Daily limit reached. Please upgrade to Pro.");
            return;
        }

        const filesToProcess = validFiles.slice(0, remaining);
        if (filesToProcess.length < validFiles.length) {
            alert(`Daily limit nearing. Only the first ${remaining} files will be processed.`);
        }

        // Add to state and start uploading
        filesToProcess.forEach(file => uploadFile(file));
    };

    const uploadFile = async (file) => {
        const id = Math.random().toString(36).substring(7);
        const newItem = {
            id,
            file,
            status: 'uploading', // uploading, compressing, done, error
            progress: 0,
            stats: null,
            error: null,
            blob: null,
            downloadUrl: null,
            filename: null
        };

        setItems(prev => [newItem, ...prev]);

        // Simulate progress
        updateItem(id, { progress: 20 });

        const formData = new FormData();
        formData.append("image", file);

        try {
            updateItem(id, { progress: 50, status: 'compressing' });
            const response = await fetch("http://localhost:5000/api/compress", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                let errorMessage = "Compression failed";
                try {
                    const err = await response.json();
                    errorMessage = err.error || errorMessage;
                } catch (e) { /* ignore */ }
                throw new Error(errorMessage);
            }

            // Stats
            const originalSize = response.headers.get("X-Original-Size");
            const compressedSize = response.headers.get("X-Compressed-Size");
            const savedPercent = response.headers.get("X-Saved-Percent");

            const blob = await response.blob();
            const downloadUrl = URL.createObjectURL(blob);

            const originalName = file.name;
            const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf(".")) || originalName;
            const originalExt = originalName.split(".").pop();
            const finalName = `${nameWithoutExt}-min.${originalExt}`;

            updateItem(id, {
                status: 'done',
                progress: 100,
                blob,
                downloadUrl,
                filename: finalName,
                stats: {
                    original: originalSize,
                    compressed: compressedSize,
                    saved: savedPercent
                }
            });

        } catch (error) {
            updateItem(id, { status: 'error', error: error.message });
        }
    };

    const updateItem = (id, updates) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    };

    const handleDownloadAll = async () => {
        const completedItems = items.filter(i => i.status === 'done' && i.blob);
        if (completedItems.length === 0) return;

        setIsProcessing(true);
        const zip = new JSZip();
        completedItems.forEach(item => {
            zip.file(item.filename, item.blob);
        });

        try {
            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, "smart-compress-images.zip");
        } catch (err) {
            console.error(err);
            alert("Failed to zip files");
        } finally {
            setIsProcessing(false);
        }
    };

    const doneCount = items.filter(i => i.status === 'done').length;
    const showDownloadAll = doneCount >= 2;

    return (
        <main>
            <section className="hero">
                <div className="hero-content">
                    <h1>Smart WebP, PNG and JPEG compression</h1>
                    <p>More than 1 billion images optimized! SmartCompress uses smart lossy compression techniques to reduce the file size of your images.</p>
                </div>

                <div
                    className="upload-zone"
                    onClick={() => fileInputRef.current.click()}
                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragover'); }}
                    onDragLeave={(e) => { e.currentTarget.classList.remove('dragover'); }}
                    onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('dragover');
                        handleFiles(e.dataTransfer.files);
                    }}
                >
                    <div className="dotted-border">
                        <div className="upload-icon">
                            <UploadCloud size={48} />
                        </div>
                        <p className="drop-text">Drop your WebP, PNG or JPEG files here!</p>
                        <p className="limit-text">Up to 10 MB each.</p>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden-input"
                        multiple
                        onChange={(e) => {
                            handleFiles(e.target.files);
                            e.target.value = ''; // Reset so we can select same file again
                        }}
                    />
                </div>
            </section>

            {showDownloadAll && (
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <button
                        className="download-btn"
                        style={{ fontSize: '1rem', padding: '12px 24px' }}
                        onClick={handleDownloadAll}
                        disabled={isProcessing}
                    >
                        {isProcessing ? "Zipping..." : "Download All as ZIP"}
                    </button>
                </div>
            )}

            <section className="results-container">
                {items.map(item => (
                    <div key={item.id} className="result-item">
                        <div className="file-info">
                            <div className="file-icon">{item.file.name.split('.').pop().toUpperCase()}</div>
                            <div className="file-details">
                                <span className="file-name">{item.file.name}</span>
                                <span className="file-size">{formatFileSize(item.file.size)}</span>
                            </div>
                        </div>

                        <div className="status-area">
                            {item.status === 'uploading' || item.status === 'compressing' ? (
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${item.progress}%` }}></div>
                                </div>
                            ) : item.status === 'error' ? (
                                <span className="error-msg">{item.error}</span>
                            ) : (
                                <>
                                    <span className="success-badge">Finished!</span>
                                    <span className="file-size" style={{ color: 'var(--primary)' }}>
                                        -Saved {Math.round(item.stats.saved)}% ({formatFileSize(item.stats.compressed)})
                                    </span>
                                    <a href={item.downloadUrl} download={item.filename} className="download-btn">Download</a>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </section>

            <FAQ />
        </main>
    );
}
