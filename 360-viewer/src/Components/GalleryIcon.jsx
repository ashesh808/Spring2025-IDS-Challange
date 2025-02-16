

export default function GalleryIcon({ name, id, ath, atv, type, description, pdf, video }) {

    const imagePath = `/images/poi${id}.png`;  

    return (
        <>
            {/* Preview */}
            <div className="gallery-card">
                <div className="card-content">
                    <img src={imagePath} alt="{name}" className="card-image"/>
                    <div>
                    <p>Image Path: {imagePath}</p>   {/* Let's keep this temporarily to debug */}
                        <p>Description: {description}</p>
                        <p>ath: {ath}</p>
                    </div>
                </div>
            </div>
        </>
    );
}