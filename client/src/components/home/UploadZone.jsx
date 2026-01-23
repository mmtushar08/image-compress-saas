import { useRef } from 'react';
import { UploadCloud, Lock } from 'lucide-react';
import { formatFileSize } from '../../utils/fileUtils';
import { animateUploadZone } from '../../utils/animations';
import gsap from 'gsap';

/**
 * Upload Zone Component
 * Handles file upload via drag & drop or file picker
 * 
 * @param {Function} onFilesSelected - Callback when files are selected
 * @param {Object} limitInfo - User's compression limits
 * @param {string} targetFormat - Selected output format
 * @param {Function} setTargetFormat - Format setter
 */
export default function UploadZone({ onFilesSelected, limitInfo, targetFormats, setTargetFormats }) {
    const fileInputRef = useRef(null);

    const handleDrop = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        gsap.fromTo(e.currentTarget, { scale: 0.95 }, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
        onFilesSelected(e.dataTransfer.files);
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            animateUploadZone();
            const filesArray = Array.from(e.target.files);
            onFilesSelected(filesArray);
        }
        e.target.value = ''; // Reset for re-selection
    };

    return (
        <>
            <div
                className="upload-zone"
                onClick={() => fileInputRef.current.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('dragover');
                }}
                onDragLeave={(e) => {
                    e.currentTarget.classList.remove('dragover');
                }}
                onDrop={handleDrop}
            >
                <div className="dotted-border">
                    <div className="upload-icon">
                        <UploadCloud size={48} />
                    </div>
                    <p className="drop-text">Drag & drop your images here</p>
                    <p className="limit-text">
                        Supports PNG, JPG, WebP, AVIF up to {formatFileSize(limitInfo.maxFileSize)}
                    </p>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png, image/jpeg, image/webp, image/avif"
                    className="hidden-input"
                    multiple
                    onChange={handleFileSelect}
                />
            </div>

            {/* Format Conversion Selector */}
            {/* Format Conversion Selector */}
            <div>
                {/* Checkbox Toggle */}
                <div className="format-toggle-checkbox-container">
                    <label>
                        <input type="checkbox" checked={targetFormats.length > 0} onChange={(e) => {
                            if (e.target.checked) {
                                setTargetFormats(['webp']); // Default to WebP when checked
                            } else {
                                setTargetFormats([]); // Clear all when unchecked
                            }
                        }} />
                        Convert images automatically
                    </label>
                </div>

                {/* Format Toggles - Only visible when Converting */}
                {targetFormats.length > 0 && (
                    <div className="format-toggles-container">
                        {['webp', 'avif', 'png', 'jpg'].map((fmt) => {
                            const isUnlocked = ['web-ultra', 'api-ultra', 'free', 'guest'].includes(limitInfo.plan || 'guest');
                            const isLocked = !isUnlocked;
                            const isActive = targetFormats.includes(fmt);

                            return (
                                <label
                                    key={fmt} >
                                    <div className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={isActive}
                                            disabled={isLocked}
                                            onChange={() => {
                                                if (!isLocked) {
                                                    if (isActive) {
                                                        setTargetFormats(targetFormats.filter(f => f !== fmt));
                                                    } else {
                                                        setTargetFormats([...targetFormats, fmt]);
                                                    }
                                                }
                                            }}
                                        />
                                        <span className="slider-round"></span>
                                    </div>
                                    <span>{fmt.toUpperCase()}</span>
                                    {isLocked && <Lock size={16} style={{ marginLeft: 'auto' }} />}
                                </label>
                            );
                        })}
                    </div>
                )}

                {/* Show upgrade link ONLY if locked (i.e. Web Pro users) */}
                {(!['web-ultra', 'api-ultra', 'free', 'guest'].includes(limitInfo.plan || 'guest')) && (
                    <div>
                        <a href="/checkout/web?tier=ultra" style={{ color: 'white', textDecoration: 'underline' }}>
                            Unlock conversion with Ultra Plan
                        </a>
                    </div>
                )}
            </div>

            {/* Security Note */}
            <div className="security-note">
                <p>
                    Secure processing · Auto-deleted after compression
                </p>
                <p>
                    We do not resell, reuse, or retain your files.
                </p>
            </div>
        </>
    );
}
