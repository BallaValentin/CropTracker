// import { useMap } from "react-leaflet";
// import type { LayoutParameters } from "../interfaces/LayoutParameters";
// import { useEffect, useRef } from "react";
// import L from "leaflet";

// interface FieldParcelCanvasProps {
//   layoutParameters: LayoutParameters;
// }

// function FieldParcelCanvasLayer({ layoutParameters }: FieldParcelCanvasProps) {
//   const map = useMap();
//   const canvasReference = useRef(null);

//   useEffect(() => {
//     if (!map) return;

//     const container = map.getPanes().overlayPane;
//     const canvas = L.DomUtil.create(
//       "canvas",
//       "leaflet-zoom-animated",
//       container,
//     );
//     const ctx = canvas.getContext("2d");

//     const drawLayer = () => {
//       const size = map.getSize();
//       canvas.width = size.x;
//       canvas.height = size.y;

//       const topLeft = map.containerPointToLatLng([0, 0]);
//       L.DomUtil.setPosition(canvas, topLeft);

//       const zoom = map.getZoom();
//       const bounds = map.getBounds();

//       const metersPerPixel =
//         (40075016.686 * Math.cos((map.getCenter().lat * Math.PI) / 180)) /
//         Math.pow(2, zoom + 8);
//       const bedWidthPixels = Math.max(
//         1.5,
//         (layoutParameters.bedSpacing * 0.01) / metersPerPixel,
//       );
//       const plantSpacingPixels =
//         (layoutParameters.plantSpacing * 0.01) / metersPerPixel;
//     };

//     map.on("move", drawLayer);
//     map.on("viewreset", drawLayer);
//     drawLayer();

//     return () => {
//       map.off("move", drawLayer);
//       map.off("viewreset", drawLayer);
//       canvas.remove();
//     };
//   });

//   return null;
// }

// export default FieldParcelCanvasLayer;
