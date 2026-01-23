import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Custom hook for handling "Download All" functionality
 * @param {Array} items - Array of compression result items
 * @returns {Object} Download state and handlers
 */
export const useDownloadAll = (items) => {
    const [isProcessing, setIsProcessing] = useState(false);

    // Calculate if "Download All" button should be shown
    const doneCount = items.filter(i => i.status === 'done').length;
    const showDownloadAll = doneCount >= 2;

    // Handle downloading all completed items as ZIP
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
            saveAs(content, "shrinkix-images.zip");
        } catch (err) {
            console.error(err);
            alert("Failed to zip files");
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        isProcessing,
        showDownloadAll,
        handleDownloadAll
    };
};
