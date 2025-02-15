import { useState } from 'react';
import GalleryIcon from './GalleryIcon';

export default function Gallery() {
    const [panos, setPanos] = useState(["test1", "test2", "test3"]);
    console.log("rendering gallery component");

    return (
        <>
            {panos.map(pano => <GalleryIcon key={pano} pano={pano} />)}
        </>
    );
}