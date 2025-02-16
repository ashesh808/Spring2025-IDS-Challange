const KRPANO_VIEWER_TARGET_ID = "krpano-target";
const KRPANO_VIEWER_ID = "krpano-viewer";

const loadKrpano = (id) => {
    console.log(`loading pano: ${id}`);

    let xmlStr;

    let poi_ids = [];

    async function onKRPanoReady(krpano) {
        try {
            console.log("KRPano is ready!");

            // Ensure XML String is defined before using it
            if (typeof xmlStr === "undefined" || !xmlStr.trim()) {
                throw new Error("XML String (xmlStr) is not defined or empty.");
            }

            // Debugging: Print XML to ensure POIs exist
            console.log("Final XML with POIs:", xmlStr);

            // Call loadxml with the modified XML (Ensure it's wrapped properly)
            krpano.call(`loadxml('${xmlStr}', KEEP);`);

            const getPos = () => {
                let x = krpano.get("mouse.x");
                let y = krpano.get("mouse.y");

                return krpano.screentosphere(x, y);
            };

            window.getPos = getPos;

            const loadHotspot = (poi) => {
                poi.type = poi.type == "nav" ? "green" : "blue";

                let validpoi = {
                    name: poi.title,
                    ath: poi.x,
                    atv: poi.y,
                    url: getIcon(poi) || "./info-icon.png",
                    onclick: getOnClick(poi),
                    scale: 0.1,
                };

                console.log(validpoi);

                krpano.call(`
        addhotspot(${validpoi.name});
        set(hotspot[${validpoi.name}].url, ${validpoi.url});
        set(hotspot[${validpoi.name}].ath, ${validpoi.ath});
        set(hotspot[${validpoi.name}].atv, ${validpoi.atv});
        set(hotspot[${validpoi.name}].onclick, ${validpoi.onclick});
        set(hotspot[${validpoi.name}].scale, ${validpoi.scale});
      `);

                // add poi to backend
            };

            window.loadHotspot = loadHotspot;

            //krpano.call(`addCallback(onmousedown, js(console.log("here)))`);

            // Load showtext plugin (Ensure it loads correctly)
            // krpano.call("loadpano('%VIEWER%/plugins/showtext.xml', KEEP);");

            // Test if showtext works
            // krpano.call("showtext('Test message', 'default');");

            // Ensure addPOIsDynamically is async if using await
            if (typeof addPOIsDynamically === "function") {
                await addPOIsDynamically(krpano);
            } else {
                console.warn("addPOIsDynamically is not a function.");
            }

            console.log("POIs added successfully.");
        } catch (err) {
            console.error("Error loading Krpano XML:", err);
        }
    }

    function onKRPanoError(err) {
        console.error("Error embedding Krpano:", err);
        // eslint-disable-next-line no-undef
        removepano(KRPANO_VIEWER_ID);
        const target = document.getElementById(KRPANO_VIEWER_TARGET_ID);
        if (target) target.remove();
    }

    function getOnClick(poi) {
        switch (poi.type) {
            case "blue":
                return `js(window.handlePoiClick(true, ${poi.description})); lookto(${poi.ath}, ${poi.atv}, 90);`;
            case "red":
                return `lookto(${poi.ath}, ${poi.atv}, 90);`;
            case "green":
                return `js(window.changeID(${poi.description}));"`;
            default:
                return ""; // Ensure it always returns a valid string
        }
    }

    function getIcon(poi) {
        switch (poi.type) {
            case "blue":
                return `./info-icon.png`;
            case "red":
                return null;
            case "green":
                return `./poi-icon.png`;
            default:
                return null;
        }
    }

    async function addPOIsDynamically(krpano) {
        console.log("Adding POIs dynamically...");

        let poihotspots = [];

        await Promise.all(
            poi_ids.map((id) =>
                fetch(`http://localhost:8000/pois/${id}`) // fetch pois not panos
                    .then((res) => {
                        console.log(res);
                        return res.json();
                    })
                    .catch((error) => {
                        console.error(`Error fetching POI ${id}:`, error);
                        return null; // Return null for failed requests
                    })
            )
        )
            .then((results) => {
                // Filter out failed requests (null values)
                const validPOIs = results.filter((poi) => poi !== null);

                // Map POI data
                poihotspots = validPOIs.map((poi) => ({
                    name: poi.name,
                    ath: poi.ath,
                    atv: poi.atv,
                    url: getIcon(poi) || "./info-icon.png",
                    onclick: getOnClick(poi),
                    scale: 0.1,
                }));

                // console.log(poihotspots); // Debugging: Log POI data
            })
            .catch((error) => console.error("Error fetching POIs:", error));

        console.log(poihotspots);
        poihotspots.forEach((poi) => {
            krpano.call(`
        addhotspot(${poi.name});
        set(hotspot[${poi.name}].url, ${poi.url});
        set(hotspot[${poi.name}].ath, ${poi.ath});
        set(hotspot[${poi.name}].atv, ${poi.atv});
        set(hotspot[${poi.name}].onclick, ${poi.onclick});
        set(hotspot[${poi.name}].scale, ${poi.scale});
      `);
        });

        console.log("POIs added dynamically.");
    }

    fetch(`http://localhost:8000/panos/${id}`) // todo: fetch pano data
        .then((res) => res.json())
        .then((pano) => {
            fetch(pano.url)
                .then((res) => res.text())
                .then((xml) => {
                    xmlStr = xml;

                    // add poi ids here
                    poi_ids = pano.pois;

                    const parser = new DOMParser();

                    const xmlDoc = parser.parseFromString(xml, "text/xml");

                    // Replace remote nadir url with local asset due to CORS errors
                    const nadirHotspotElem = xmlDoc.querySelector(
                        "hotspot[name='nadirlogo']"
                    );
                    if (nadirHotspotElem) {
                        nadirHotspotElem.setAttribute("url", "./ids-nadir.png");
                    }

                    // Add POI Hotspots to the XML
                    const sceneElement = xmlDoc.querySelector("scene");
                    if (sceneElement) {
                        console.log("Scene found, adding POIs...");
                    }

                    const serializer = new XMLSerializer();
                    xmlStr = serializer.serializeToString(xmlDoc);

                    // eslint-disable-next-line no-undef
                    embedpano({
                        xml: xmlStr, // Corrected from `null` to `xmlStr`
                        sameorigin: false,
                        html5: "prefer",
                        consolelog: true,
                        capturetouch: false, // prevent default touch event handling from being disabled
                        bgcolor: "#F4F6F8",
                        id: KRPANO_VIEWER_ID,
                        target: KRPANO_VIEWER_TARGET_ID,
                        onready: onKRPanoReady,
                        onerror: onKRPanoError,
                    });
                })
                .catch(onKRPanoError);
        });
};

export default loadKrpano;
