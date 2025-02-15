import { useEffect } from "react";
import loadKrpano from "../loadKrpano";

export default function Krpano() {
    useEffect(() => {
        // loadKrpanoHotspot();
        loadKrpano();
    }, []);

    return (
        <div id="app">
            <div id="krpano-target"></div>
        </div>
    );

}