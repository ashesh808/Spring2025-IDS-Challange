const KRPANO_VIEWER_TARGET_ID = "krpano-target";
const KRPANO_VIEWER_ID = "krpano-viewer";

const loadKrpano = () => {
    let xmlStr;

    let poi_ids = [];

    async function onKRPanoReady(krpano) {
        try {
            console.log("KRPano is ready!");

            // Debugging: Print XML to ensure POIs exist
            console.log("Final XML with POIs:", xmlStr);

            // Call loadxml with the modified XML
            krpano.call(`loadxml(${xmlStr})`);

            // Alternative: Dynamically add POIs after loading XML
            await addPOIsDynamically(krpano);
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

    async function addPOIsDynamically(krpano) {
        console.log("Adding POIs dynamically...");

        let poihotspots = [];

        await Promise.all(
            poi_ids.map((id) =>
                fetch(`./poi/${id}.json`)
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
                    url: poi.icon_url || "./poi-icon.png",
                    onclick: `showtext('${poi.description}', 5);`,
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
      `);
        });

        console.log("POIs added dynamically.");
    }

    fetch("./pano/1.json")
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
