import { useState, useEffect } from 'react';
import { getApiKey } from '../utils/fileUtils';
import { animateResultItem } from '../utils/animations';

/**
 * Custom hook for managing image compression state and operations
 * @param {string} targetFormat - Target output format for compression
 * @returns {Object} Compression state and handlers
 */
export const useImageCompression = (targetFormats) => {
    const [items, setItems] = useState([]);
    const [limitInfo, setLimitInfo] = useState({
        remaining: 25,
        maxFileSize: 5 * 1024 * 1024,
        plan: 'guest'
    });
    const [formatWarnings, setFormatWarnings] = useState({});

    // Check compression limit from server
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
            return { remaining: 25, maxFileSize: 5 * 1024 * 1024, plan: 'guest' };
        }
    };

    // Update a specific item in the list
    const updateItem = (id, updates) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    };

    // Upload and compress a single file with a specific format
    const uploadFile = async (file, format = null, uploadSessionId = null) => {
        const id = Math.random().toString(36).substring(7);
        const newItem = {
            id,
            file,
            format, // Store the format (null for original/optimized, string for conversions)
            uploadSessionId, // Unique ID for this upload session
            status: 'uploading',
            progress: 0,
            stats: null,
            error: null,
            blob: null,
            downloadUrl: null,
            filename: null
        };

        setItems(prev => [newItem, ...prev]);
        updateItem(id, { progress: 20 });

        const formData = new FormData();
        if (format) {
            formData.append("format", format);
        }
        formData.append("image", file);

        try {
            const apiKey = getApiKey();
            const headers = {
                ...(apiKey ? { 'x-api-key': apiKey } : {}),
                'Accept': 'application/json'
            };

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
                } catch { /* ignore */ }
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

            // Determine final filename (use response name if available, else original)
            let finalFilename = file.name;
            try {
                if (downloadUrl && downloadUrl.includes('?name=')) {
                    const urlObj = new URL(downloadUrl, window.location.origin);
                    finalFilename = urlObj.searchParams.get('name') || file.name;
                }
            } catch (e) { /* ignore */ }

            updateItem(id, {
                status: 'done',
                progress: 100,
                blob,
                downloadUrl,
                filename: finalFilename,
                stats
            });

            // Trigger animation for this item
            animateResultItem(id);

        } catch (error) {
            updateItem(id, { status: 'error', error: error.message });
        }
    };

    // Handle multiple files being selected/dropped
    const handleFiles = async (files) => {
        try {
            if (!files || files.length === 0) return;

            // Fetch limits from server first
            let currentLimitInfo;
            try {
                currentLimitInfo = await checkLimit();
            } catch (err) {
                console.error("Check limit failed, using defaults", err);
                currentLimitInfo = { remaining: 25, maxFileSize: 5 * 1024 * 1024, plan: 'guest' };
            }

            setLimitInfo(currentLimitInfo);

            // Generate unique session ID for this upload batch (before validation)
            const uploadSessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);

            // Validate file size
            const validFiles = Array.from(files).filter(file => {
                if (file.size > currentLimitInfo.maxFileSize) {
                    const limitMb = currentLimitInfo.maxFileSize / (1024 * 1024);
                    const id = Math.random().toString(36).substring(7);
                    setItems(prev => [{
                        id,
                        file,
                        uploadSessionId,
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

            const remaining = Math.max(0, currentLimitInfo.remaining);
            const allowedFiles = validFiles.slice(0, remaining);
            const lockedFiles = validFiles.slice(remaining);

            // Start uploading allowed files
            allowedFiles.forEach(file => {
                // Always upload original (optimized)
                uploadFile(file, null, uploadSessionId);

                // Upload additional formats if selected
                if (targetFormats && targetFormats.length > 0) {
                    targetFormats.forEach(format => {
                        uploadFile(file, format, uploadSessionId);
                    });
                }
            });

            // Add locked files to UI
            if (lockedFiles.length > 0) {
                const file = lockedFiles[0];
                const lockedItem = {
                    id: Math.random().toString(36).substring(7),
                    file,
                    uploadSessionId,
                    status: 'locked',
                    error: null,
                    progress: 0,
                    blob: null,
                    downloadUrl: null,
                    filename: file.name,
                    stats: null
                };
                setItems(prev => [lockedItem, ...prev]);
            }

        } catch (error) {
            console.error("Error in handleFiles:", error);
            alert("An unexpected error occurred while processing your files: " + error.message);
        }
    };

    // Initial limit check on mount
    useEffect(() => {
        checkLimit().then(setLimitInfo);
    }, []);

    // React to targetFormats changes: Process existing files for new formats
    useEffect(() => {
        const newWarnings = {};

        if (!targetFormats || targetFormats.length === 0) {
            setFormatWarnings({});
            return;
        }

        // Get all unique original files that have been uploaded/processed
        // We use a Map to ensure uniqueness by file object reference/name
        // Store the uploadSessionId with the file to keep grouping intact
        const uniqueFiles = new Map();
        items.forEach(item => {
            // Exclude error items (except we don't create them anymore for redundant formats)
            if (item.file && !item.error && item.status !== 'locked') {
                // If we already have this file, don't overwrite unless we found the "done" one (prioritize successful uploads)
                if (!uniqueFiles.has(item.file) || item.status === 'done') {
                    uniqueFiles.set(item.file, {
                        file: item.file,
                        uploadSessionId: item.uploadSessionId
                    });
                }
            }
        });

        uniqueFiles.forEach(({ file, uploadSessionId }) => {
            targetFormats.forEach(format => {
                // Determine normalized file type from format
                const formatMime = `image/${format === 'jpg' ? 'jpeg' : format}`;

                // Check if implicit original already matches this format
                // (e.g. uploading .png and asking for .png)
                const isOriginalSameFormat = file.type === formatMime;

                // Check if we already have an explicit converted item
                const explicitExists = items.some(item =>
                    item.file === file && item.format === format
                );

                // Check if we have the original and it matches the requested format
                // We only block if we have the original loaded successfully
                const originalExists = isOriginalSameFormat && items.some(item =>
                    item.file === file && !item.format && item.status === 'done'
                );

                if (explicitExists) {
                    // Already converted to this format, skip
                    return;
                }

                if (originalExists) {
                    // Original is already in this format, just show warning but don't convert
                    newWarnings[format] = `Original is already ${format.toUpperCase()}`;
                } else {
                    // Trigger processing for the new format
                    // Pass the original uploadSessionId so it stays in the same group!
                    uploadFile(file, format, uploadSessionId);
                }
            });
        });

        setFormatWarnings(newWarnings);

    }, [targetFormats]); // Dependency only on targetFormats to avoid loop when items change

    return {
        items,
        limitInfo,
        handleFiles,
        formatWarnings
    };
};
