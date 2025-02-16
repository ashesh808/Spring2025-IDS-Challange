

export default function GalleryIcon({ name, id, ath, atv, type, description, pdf, video }) {

    return (
        <>
            {/* Preview */}
            <div className="gallery-card">
                <div className="card-content">
                    <div>
                        <p>Description: {description}</p>
                        <p>ath: {ath}</p>
                    </div>
                </div>
            </div>
        </>
    );
}