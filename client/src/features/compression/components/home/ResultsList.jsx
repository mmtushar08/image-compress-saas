import ResultItem from './ResultItem';

/**
 * Results List Component
 * Container for all compression result items
 * Groups items by original filename to show multiple formats together
 * 
 * @param {Array} items - Array of compression result items
 * @param {Function} formatFileSize - File size formatter function
 */
export default function ResultsList({ items, formatFileSize }) {
    // Group items by uploadSessionId and filename
    // This ensures each upload session creates a separate group, even for the same file
    const groupedItems = items.reduce((groups, item) => {
        const key = `${item.uploadSessionId || 'legacy'}_${item.file.name}`;
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(item);
        return groups;
    }, {});

    return (
        <section className="results-container">
            {Object.entries(groupedItems).map(([key, groupItems]) => (
                <ResultItem
                    key={key}
                    items={groupItems}
                    formatFileSize={formatFileSize}
                />
            ))}
        </section>
    );
}
