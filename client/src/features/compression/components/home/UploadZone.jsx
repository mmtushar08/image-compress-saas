import { useRef, useEffect, useState } from 'react';
import { UploadCloud, Lock } from 'lucide-react';
import { formatFileSize } from '../../../../utils/fileUtils';
import { animateUploadZone } from '../../../../utils/animations';
import gsap from 'gsap';

export default function UploadZone({ onFilesSelected, limitInfo, targetFormats, setTargetFormats, formatWarnings = {} }) {
    const fileInputRef = useRef(null);
    const uploadZoneRef = useRef(null);
    const [conversionEnabled, setConversionEnabled] = useState(false);

    useEffect(() => {
        let dragCounter = 0;

        const handleWindowDragEnter = (e) => {
            e.preventDefault();
            dragCounter++;
            if (e.dataTransfer.types.includes('Files')) {
                if (uploadZoneRef.current) {
                    uploadZoneRef.current.classList.add('global-drag-active');
                }
            }
        };

        const handleWindowDragLeave = (e) => {
            e.preventDefault();
            dragCounter--;
            if (dragCounter === 0) {
                if (uploadZoneRef.current) {
                    uploadZoneRef.current.classList.remove('global-drag-active');
                }
            }
        };

        const handleWindowDrop = (e) => {
            e.preventDefault();
            dragCounter = 0;
            if (uploadZoneRef.current) {
                uploadZoneRef.current.classList.remove('global-drag-active');
            }

            // If files are dropped anywhere on the window
            if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                onFilesSelected(e.dataTransfer.files);
            }
        };

        const handleWindowDragOver = (e) => {
            e.preventDefault(); // Necessary to allow dropping
        };

        window.addEventListener('dragenter', handleWindowDragEnter);
        window.addEventListener('dragleave', handleWindowDragLeave);
        window.addEventListener('dragover', handleWindowDragOver);
        window.addEventListener('drop', handleWindowDrop);

        return () => {
            window.removeEventListener('dragenter', handleWindowDragEnter);
            window.removeEventListener('dragleave', handleWindowDragLeave);
            window.removeEventListener('dragover', handleWindowDragOver);
            window.removeEventListener('drop', handleWindowDrop);
        };
    }, []);

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation(); // Stop bubbling to window handler
        e.currentTarget.classList.remove('dragover');
        if (uploadZoneRef.current) {
            uploadZoneRef.current.classList.remove('global-drag-active');
        }
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
                ref={uploadZoneRef}
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
                        <input type="checkbox" checked={conversionEnabled} onChange={(e) => {
                            setConversionEnabled(e.target.checked);
                            if (!e.target.checked) {
                                setTargetFormats([]); // Clear all formats when unchecked
                            }
                        }} />
                        Convert images automatically
                    </label>
                </div>

                {/* Format Toggles - Only visible when Converting */}
                {conversionEnabled && (
                    <div className="format-toggles-container">
                        {['webp', 'avif', 'png', 'jpg'].map((fmt) => {
                            const isUnlocked = ['web-ultra', 'api-ultra', 'free', 'guest'].includes(limitInfo.plan || 'guest');
                            const isLocked = !isUnlocked;
                            const isActive = targetFormats.includes(fmt);
                            const warningText = formatWarnings[fmt];

                            return (
                                <div key={fmt} className="toggle-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <label>
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
                                    {warningText && (
                                        <span className="format-warning" style={{
                                            color: '#ff4d4f',
                                            fontSize: '0.75rem',
                                            marginTop: '4px',
                                            display: 'block',
                                            textAlign: 'center'
                                        }}>
                                            {warningText}
                                        </span>
                                    )}
                                </div>
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
