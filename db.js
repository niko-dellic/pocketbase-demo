import PocketBase from "./dist/pocketbase.es.mjs";

document.addEventListener("contextmenu", (event) => event.preventDefault()); //disable right click for map

const client = new PocketBase("http://127.0.0.1:8090");

// const adminData = await client.admins.authViaEmail(
//   "nikom@mit.edu",
//   "@Letmein11"
// );

// console.log(client);
// console.log(adminData);

const collection = await client.collections.getOne("submissions");

const records = await client.records.getFullList(
  "submissions",
  200 /* batch size */,
  {
    sort: "-created",
  }
);

const record = await client.records.getOne("submissions", "5z039juwom7c685", {
  expand: "some_relation",
});

// get user location
// navigator.geolocation.getCurrentPosition(function (position) {
//   console.log(position.coords.latitude, position.coords.longitude);
// });

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
        console.log(d.coordinates);
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
  // getTooltip: ({ object }) => {
  //   if (object) {
  //     return (
  //       object && {
  //         html: getImageGallery(
  //           object.fileUpload,
  //           object.describeWhat,
  //           (preview = true)
  //         ),
  //         style: {
  //           width: "fit-content",
  //           backgroundColor: "transparent",
  //           overflow: "hidden",
  //         },
  //       }
  //     );
  //   }
  // },
});
