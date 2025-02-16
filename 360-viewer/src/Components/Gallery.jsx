import { useState, useEffect } from 'react';
import GalleryIcon from './GalleryIcon';
import './Gallery.css'

export default function Gallery() {
    const [panos, setPanos] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8000/panos')
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error status ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            setPanos(data);
            setIsLoading(false);
        })
        .catch(error => {
            console.log('Error fetching panos:', error);
            setError(error.message);
            setIsLoading(false);
        });
    }, []);


    return (
        <div className="gallery-container">
            {isLoading && <div>Loading...</div>}
            {error && <div className="error-message">Error: {error}</div>}
            <div className="gallery">
                {panos.map(pano => <GalleryIcon key={pano.id} {...pano} />)}
            </div>
        </div>

    );
}
