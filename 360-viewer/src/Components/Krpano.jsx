import { useState, useEffect } from "react";
import loadKrpano from "../loadKrpano";
import { useLocation } from "react-router-dom";

export default function Krpano() {
    // State to manage the visibility of the info div
    const [isInfoVisible, setIsInfoVisible] = useState(false);
    const [infoText, setInfoText] = useState(""); // Store info text
    // Function to toggle the visibility of the info div and set text
    const handlePoiClick = (visible, description) => {
        setInfoText(description);
        setIsInfoVisible(visible);
    };

    const changeID = (id) => {
        window.location.href = `https://localhost:3000/view?id=${id}`;
    };

    // Extract the `id` from the query string in the URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id"); // Extract the `id` from the URL query

    useEffect(() => {
        window.handlePoiClick = handlePoiClick;
        window.changeID = changeID;
        loadKrpano(id);
    }, []);

    return (
        <div id="app">
            <div id="krpano-target"></div>

            {/* Info Div */}
            {isInfoVisible && (
                <div id="info-div" style={infoDivStyle}>
                    <p>{infoText}</p>
                    <button onClick={() => setIsInfoVisible(false)}>
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}

// Styles for the info div (simple styling for now)
const infoDivStyle = {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#000",
    color: "#fff",
    padding: "15px",
    borderRadius: "5px",
    zIndex: 9999,
    maxWidth: "90%",
    textAlign: "center",
};
