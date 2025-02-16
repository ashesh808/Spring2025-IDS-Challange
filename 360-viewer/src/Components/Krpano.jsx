import { useState, useEffect } from "react";
import loadKrpano from "../loadKrpano";
import { useLocation } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import "./krpano.css";

export default function Krpano() {
    // State to manage the visibility of the info div
    const [isInfoVisible, setIsInfoVisible] = useState(false);
    const [infoText, setInfoText] = useState(""); // Store info text

    const [choosingLocation, setChoosingLocation] = useState(false);
    const [editMode, setEditMode] = useState(true);
    
    const [poiData, setPoiData] = useState({
        type: "",
        title: "",
        description: "",
        x: null,
        y: null,
    });
    // Function to toggle the visibility of the info div and set text

    // Extract the `id` from the query string in the URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id"); // Extract the `id` from the URL query

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting POI:", poiData);
        // Submit logic here
        window.loadHotspot(poiData, id);
    };

    // handle click on poi behavior
    const handlePoiClick = (visible, description) => {
        setInfoText(description);
        setIsInfoVisible(visible);

        console.log(window.getPos());
    };

    const handleChooseLocation = () => {
        console.log("Set location mode enabled. Waiting for user click...");

        setChoosingLocation(true);

        // Add event listener that runs only once
        setTimeout(() => {
            const handleClick = (event) => {
                console.log("Mouse clicked at:", event.clientX, event.clientY);

                // Set choosePoiLoc to false after clicking

                // Execute if choosePoiLoc was true before click
                console.log("Logging click location...");
                let pos = window.getPos();
                console.log(pos);

                setPoiData((prev) => ({
                    ...prev,
                    x: pos.x,
                    y: pos.y,
                }));

                // Remove event listener after executing once
                window.removeEventListener("click", handleClick);

                setChoosingLocation(false);
            };

            // Add event listener that runs only once
            window.addEventListener("click", handleClick, { once: true });
        }, 0); // Minimal delay ensures the button's event is handled first
    };

    const changeID = (id) => {
        window.location.href = `https://localhost:3000/view?id=${id}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPoiData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        window.handlePoiClick = handlePoiClick;
        window.changeID = changeID;
        loadKrpano(id);
    }, []);

    return (
        <div id="app">
            <div id="krpano-target"></div>
            <button
                onClick={() => setEditMode(!editMode)}
                className="top-right-button"
            >
                {editMode ? "Close POI Editor" : "Add POI"}
            </button>

            {/* Info Div */}
            {isInfoVisible && (
                <div id="info-div" className="centeredbox">
                    <div className="centeredinnerbox">
                        <p id="info_text">{infoText}</p>
                        <button
                            id="exit_button"
                            onClick={() => setIsInfoVisible(false)}
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>
            )}

            {editMode && (
                <div className="poi-form">
                    <h3>Add POI</h3>
                    <form onSubmit={handleSubmit}>
                        <select
                            name="type"
                            value={poiData.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="info">Info</option>
                            <option value="nav">Nav</option>
                        </select>

                        <label>Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={poiData.title}
                            onChange={handleChange}
                            required
                        />

                        <label>Description:</label>
                        <textarea
                            name="description"
                            value={poiData.description}
                            onChange={handleChange}
                            required
                        />

                        <button type="button" onClick={handleChooseLocation}>
                            {choosingLocation
                                ? "Click Location..."
                                : "Choose Position"}
                        </button>
                        <p>
                            Position:{" "}
                            {poiData.x !== null
                                ? `(${poiData.x}, ${poiData.y})`
                                : "Not Set"}
                        </p>

                        <button type="submit">Submit</button>
                    </form>
                </div>
            )}
        </div>
    );
}

// Styles for the info div (simple styling for now)
//const infoDivStyle = {
//    position: "fixed",
//    bottom: "20px",
//    left: "50%",
//    transform: "translateX(-50%)",
//    backgroundColor: "#000",
//    color: "#fff",
//    padding: "15px",
//    borderRadius: "5px",
//    zIndex: 9999,
//    maxWidth: "90%",
//    textAlign: "center",
//    display: "flex",
//};
//
//const innerbox = {
//    backgroundColor: "#ff6f61", // Add a color for the button
//    border: "none",
//    padding: "10px 20px",
//    color: "#fff",
//    cursor: "pointer",
//    borderRadius: "5px",
//    display: "flex",
//    alignItems: "center", // Align the icon and text
//    // gap: "8px", // Space between the icon and text
//};
