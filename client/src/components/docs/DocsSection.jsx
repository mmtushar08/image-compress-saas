export default function DocsSection({ id, title, description, children }) {
    return (
        <div id={id} className="docs-section">
            <h1>{title}</h1>
            <p className="docs-description">{description}</p>
            {children}
        </div>
    );
}
