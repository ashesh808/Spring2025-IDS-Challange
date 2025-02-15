const KRPANO_VIEWER_TARGET_ID = "krpano-target";
const KRPANO_VIEWER_ID = "krpano-viewer";

const loadKrpano = () => {
  let xmlStr;

  function onKRPanoReady(krpano) {
    try {
      console.log("KRPano is ready!");

      // Debugging: Print XML to ensure POIs exist
      console.log("Final XML with POIs:", xmlStr);

      // Call loadxml with the modified XML
      krpano.call(`loadxml(${xmlStr})`);

      // Alternative: Dynamically add POIs after loading XML
      addPOIsDynamically(krpano);
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

  function addPOIsDynamically(krpano) {
    console.log("Adding POIs dynamically...");

    const poiHotspots = [
      {
        name: "poi1",
        ath: "120",
        atv: "-10",
        url: "./poi-icon.png",
        onclick: "showtext('This is POI 1', 5);",
      },
      {
        name: "poi2",
        ath: "-90",
        atv: "20",
        url: "./poi-icon.png",
        onclick: "lookto(-90, 20, 50); showtext('POI 2 - View Here', 5);",
      },
    ];

    poiHotspots.forEach((poi) => {
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

  fetch("https://api.viewer.immersiondata.com/api/v1/panoramas/311975/krpano.xml")
    .then((res) => res.text())
    .then((xml) => {
      xmlStr = xml;

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "text/xml");

      // Replace remote nadir url with local asset due to CORS errors
      const nadirHotspotElem = xmlDoc.querySelector("hotspot[name='nadirlogo']");
      if (nadirHotspotElem) {
        nadirHotspotElem.setAttribute("url", "./ids-nadir.png");
      }

      // Add POI Hotspots to the XML
      const sceneElement = xmlDoc.querySelector("scene");
      if (sceneElement) {
        console.log("Scene found, adding POIs...");

        const poiHotspots = [
          {
            name: "poi1",
            ath: "120",
            atv: "-10",
            url: "./poi-icon.png",
            onclick: "showtext('This is POI 1', 5);",
          },
          {
            name: "poi2",
            ath: "-90",
            atv: "20",
            url: "./poi-icon.png",
            onclick: "lookto(-90, 20, 50); showtext('POI 2 - View Here', 5);",
          },
        ];

        poiHotspots.forEach((poi) => {
          const hotspot = xmlDoc.createElement("hotspot");
          hotspot.setAttribute("name", poi.name);
          hotspot.setAttribute("ath", poi.ath);
          hotspot.setAttribute("atv", poi.atv);
          hotspot.setAttribute("url", poi.url);
          hotspot.setAttribute("onclick", poi.onclick);
          sceneElement.appendChild(hotspot);
        });

        console.log("POIs added to XML.");
      } else {
        console.error("Scene element not found in XML.");
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
};

export default loadKrpano;
