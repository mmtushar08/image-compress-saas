import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { UploadCloud } from 'lucide-react';
import gsap from 'gsap';
import FAQ from './FAQ';

export default function Home() {
    const [items, setItems] = useState([]);
    const [downloadAllVisible, setDownloadAllVisible] = useState(false);
    const fileInputRef = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [limitInfo, setLimitInfo] = useState({ remaining: 10, maxFileSize: 5 * 1024 * 1024, plan: 'guest' });

    // Initial limit check
    useEffect(() => {
        checkLimit().then(setLimitInfo);
    }, []);

    // Helper to format file size
    const formatFileSize = (bytes) => {
        if (bytes >= 1024 * 1024) {
            return (bytes / (1024 * 1024)).toFixed(0) + ' MB';
        }
        return (bytes / 1024).toFixed(0) + ' KB';
    };

    const getApiKey = () => {
        try {
            const auth = JSON.parse(localStorage.getItem('trimixo_auth'));
            return auth ? auth.apiKey : null;
        } catch (e) {
            return null;
        }
    };

    const checkLimit = async () => {
        try {
            const apiKey = getApiKey();
            const headers = apiKey ? { 'x-api-key': apiKey } : {};

            const res = await fetch("/api/check-limit", { headers });
            const data = await res.json();
            return {
                remaining: data.remaining,
                maxFileSize: data.maxFileSize || 5 * 1024 * 1024,
                plan: data.plan
            };
        } catch (e) {
            console.error("Failed to check limit", e);
            return { remaining: 10, maxFileSize: 5 * 1024 * 1024, plan: 'guest' };
        }
    };

    const handleFiles = async (files) => {
        try {
            console.log("handleFiles called with", files);
            if (!files || files.length === 0) return;

            // Fetch limits from server first (to be plan-aware)
            let currentLimitInfo;
            try {
                currentLimitInfo = await checkLimit();
            } catch (err) {
                console.error("Check limit failed, using defaults", err);
                currentLimitInfo = { remaining: 10, maxFileSize: 5 * 1024 * 1024, plan: 'guest' };
            }

            // Update state to match new info
            setLimitInfo(currentLimitInfo);

            // Validate size first
            const validFiles = Array.from(files).filter(file => {
                if (file.size > currentLimitInfo.maxFileSize) {
                    const limitMb = currentLimitInfo.maxFileSize / (1024 * 1024);
                    // Add a dummy 'error' item to show the message in the UI instead of Alert
                    const id = Math.random().toString(36).substring(7);
                    setItems(prev => [{
                        id,
                        file,
                        status: 'error',
                        error: `File too large (Max ${limitMb} MB). Please upgrade.`,
                        progress: 100,
                        blob: null,
                        downloadUrl: null,
                        filename: file.name,
                        stats: null
                    }, ...prev]);
                    return false;
                }
                return true;
            });

            if (validFiles.length === 0) return;

            if (currentLimitInfo.remaining <= 0) {
                // Show limit error as a special banner or just an error item
                alert("Daily limit reached. Please upgrade for more."); // Keeping this single alert as it's a hard block
                return;
            }

            const filesToProcess = validFiles.slice(0, currentLimitInfo.remaining);

            // Add to state and start uploading
            filesToProcess.forEach(file => uploadFile(file));

        } catch (error) {
            console.error("Error in handleFiles:", error);
            alert("An unexpected error occurred while processing your files: " + error.message);
        }
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
            const apiKey = getApiKey();
            const headers = apiKey ? { 'x-api-key': apiKey } : {};

            updateItem(id, { progress: 50, status: 'compressing' });
            const response = await fetch("/api/compress", {
                method: "POST",
                headers,
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

            // Handle Response (Detect JSON vs Blob)
            const contentType = response.headers.get("content-type");
            let downloadUrl = "";
            let stats = {
                original: response.headers.get("X-Original-Size"),
                compressed: response.headers.get("X-Compressed-Size"),
                saved: response.headers.get("X-Saved-Percent")
            };

            let blob = null;
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                downloadUrl = data.output.url;
                stats = {
                    original: data.input.size,
                    compressed: data.output.size,
                    saved: data.stats.saved_percent
                };
                // Fetch blob with auth headers too
                const apiKey = getApiKey();
                const headers = apiKey ? { 'x-api-key': apiKey } : {};
                blob = await fetch(downloadUrl, { headers }).then(r => r.blob());
            } else {
                // Fallback for direct binary stream
                blob = await response.blob();
                downloadUrl = URL.createObjectURL(blob);
            }

            updateItem(id, {
                status: 'done',
                progress: 100,
                blob,
                downloadUrl,
                filename: file.name,
                stats
            });

            // Animate only this specific item when done
            // We use a small timeout to let React render the DOM update first
            setTimeout(() => {
                const element = document.getElementById(`result-${id}`);
                if (element) {
                    // Flash effect
                    gsap.fromTo(element,
                        { backgroundColor: "#e8f5e9", scale: 1.02 },
                        { backgroundColor: "#fff", scale: 1, duration: 0.5, ease: "power2.out" }
                    );

                    // Confetti-like bounce for the success badge
                    const badge = element.querySelector('.success-badge');
                    if (badge) {
                        gsap.fromTo(badge,
                            { scale: 0, rotation: -20 },
                            { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)" }
                        );
                    }
                }
            }, 100);

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
            saveAs(content, "trimixo-images.zip");
        } catch (err) {
            console.error(err);
            alert("Failed to zip files");
        } finally {
            setIsProcessing(false);
        }
    };

    const doneCount = items.filter(i => i.status === 'done').length;
    const showDownloadAll = doneCount >= 2;

    const containerRef = useRef(null);

    return (
        <main ref={containerRef}>
            <section className="hero">
                <div className="hero-content">
                    <h1>Trimixo - Smart WebP, PNG and JPEG compression</h1>
                    <p>More than 1 billion images optimized! Trimixo uses smart lossy compression techniques to reduce the file size of your images.</p>
                </div>

                <div
                    className="upload-zone"
                    onClick={() => fileInputRef.current.click()}
                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragover'); }}
                    onDragLeave={(e) => { e.currentTarget.classList.remove('dragover'); }}
                    onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('dragover');
                        // Animate drop
                        gsap.fromTo(e.currentTarget, { scale: 0.95 }, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
                        handleFiles(e.dataTransfer.files);
                    }}
                >
                    <div className="dotted-border">
                        <div className="upload-icon">
                            <UploadCloud size={48} />
                        </div>
                        <p className="drop-text">Drop your WebP, PNG or JPEG files here!</p>
                        <p className="limit-text">Up to {formatFileSize(limitInfo.maxFileSize)} each.</p>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden-input"
                        multiple
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                // Animate select
                                gsap.fromTo('.upload-zone', { scale: 0.95 }, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
                                const filesArray = Array.from(e.target.files);
                                handleFiles(filesArray);
                            }
                            e.target.value = ''; // Reset so we can select same file again
                        }}
                    />
                </div>

                <div className="security-note" style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666' }}>
                    <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem' }}>
                        🔒 <strong>Privacy Guaranteed:</strong> Images are processed securely and deleted automatically after compression.
                    </p>
                    <p style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '4px' }}>
                        We do not resell, reuse, or retain your files.
                    </p>
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
                    <div key={item.id} id={`result-${item.id}`} className="result-item">
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
