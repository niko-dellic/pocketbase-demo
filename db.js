import PocketBase from "./dist/pocketbase.es.mjs";

document.addEventListener("contextmenu", (event) => event.preventDefault()); //disable right click for map

const client = new PocketBase("http://127.0.0.1:8090");

const records = await client.records.getFullList(
  "submissions",
  200 /* batch size */,
  {
    sort: "-created",
  }
);

// create new record
// const newRecord = await client.records.create("submissions", {
//   discription: "Lorem ipsum 2",
//   coordinates: [42.45, -70.5],
// });

// get user location
navigator.geolocation.getCurrentPosition(function (position) {
  // console.log(position.coords.latitude, position.coords.longitude);
});

const deckgl = new deck.DeckGL({
  container: "map",
  // Set your Mapbox access token here
  mapboxApiAccessToken:
    "pk.eyJ1Ijoibmlrby1kZWxsaWMiLCJhIjoiY2w5c3p5bGx1MDh2eTNvcnVhdG0wYWxkMCJ9.4uQZqVYvQ51iZ64yG8oong",
  // Set your Mapbox style here
  mapStyle: "mapbox://styles/niko-dellic/cl9t226as000x14pr1hgle9az",
  initialViewState: {
    latitude: 42.36476,
    longitude: -71.10326,
    zoom: 12,
    bearing: 0,
    pitch: 0,
  },
  touchRotate: true,
  controller: true,
  layers: [
    new deck.ScatterplotLayer({
      id: "form-submissions", // layer id
      data: records, // data formatted as array of objects
      getPosition: (d) => {
        return [d.coordinates[1], d.coordinates[0]];
      }, // accessor for position
      // Styles
      radiusUnits: "pixels",
      getRadius: 10,
      opacity: 0.7,
      stroked: false,
      filled: true,
      radiusScale: 3,
      getFillColor: [255, 0, 0],
      pickable: true,
      autoHighlight: true,
      highlightColor: [255, 255, 255, 255],
      parameters: {
        depthTest: false,
      },
      //   onClick: (info) => {
      //     getImageGallery(
      //       info.object.fileUpload,
      //       info.object.describeWhat,
      //       (preview = false)
      //     );
      //     flyToClick(info.object["Location Coordinates"]);
      //   },
    }),
  ],
  getTooltip: ({ object }) => {
    if (object) {
      return (
        object && {
          html: getImage(object),
          style: {
            width: "fit-content",
            backgroundColor: "transparent",
            overflow: "hidden",
          },
        }
      );
    }
  },
});

// getImage()
function getImage(object) {
  console.log(object);
  if (object.media.length > 0) {
    return `<img src="http://127.0.0.1:8090/api/files/vbpzuhpaxcpy4ur/${object.id}/${object.media[0]}" alt="test" />`;
  } else {
    return `<div>No Image</div>`;
  }
}

const newImage = document.createElement("img");
newImage.src =
  "http://127.0.0.1:8090/api/files/vbpzuhpaxcpy4ur/5z039juwom7c685/cars_ecnbEyiOSG.jpg";
newImage.id = "testImage";
document.body.appendChild(newImage);
