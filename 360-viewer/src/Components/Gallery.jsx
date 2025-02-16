import { useState, useEffect } from "react";
import GalleryIcon from "./GalleryIcon";
import "./Gallery.css";

export default function Gallery() {
    const [panos, setPanos] = useState([
        {
            name: "poi1",
            id: "1",
            ath: "-190",
            atv: "110",
            type: "blue",
            description: "poi 1 - view here",
            pdf: "",
            video: "",
        },
        {
            name: "poi2",
            id: "2",
            ath: "-200",
            atv: "120",
            type: "red",
            description: "poi 2 - view here",
            pdf: "",
            video: "",
        },
        {
            name: "poi3",
            id: "3",
            ath: "-210",
            atv: "130",
            type: "green",
            description: "poi 3 - view here",
            pdf: "",
            video: "",
        },
    ]);
    console.log("rendering gallery component");

    // useEffect(() => {
    //     fetch('api/panos')
    //     .then(res => res.json())
    //     .then(data => setPanos(data))
    //     .catch(error => console.log('Error fetching panos:', error));
    // }, []);

    return (
        <div className="gallery-container">
            <div className="gallery">
                {panos.map((pano) => (
                    <GalleryIcon key={pano.id} {...pano} />
                ))}
            </div>
        </div>
    );
}
