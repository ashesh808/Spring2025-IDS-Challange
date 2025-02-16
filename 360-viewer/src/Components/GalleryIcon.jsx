
import { useNavigate } from "react-router-dom";

export default function GalleryIcon({ name, id, ath, atv, type, description, pdf, video }) {

    const imagePath = `/images/poi${id}.png`;  

    const navigate = useNavigate();

    const handleViewClick = () => {
        navigate(`/view?id=${id}`);
    };

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
                        <button onClick={handleViewClick}>Go to View {id}</button>
                    </div>
                </div>
            </div>
        </>
    );
}