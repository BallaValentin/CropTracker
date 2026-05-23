import * as turf from "@turf/turf";
import type { LatLngObject } from "../interfaces/LatLngObject";
import type { Feature, LineString } from "geojson";


const lineToLatLng = (line: Feature<LineString>) => {
    return line.geometry.coordinates.map(point => ({
        lat: point[1],
        lng: point[0]
    }))
}

export const getGeneratedRows = (polygonCoords: LatLngObject[], 
    referenceRow: LatLngObject[], numberOfRows: number, rowDistance: number) => {
    const generatedLines = [] as LatLngObject[][];

    if (numberOfRows === 0 || rowDistance === 0 || !referenceRow || !polygonCoords) {
        return generatedLines;
    }

    const polygon = turf.polygon([polygonCoords.map(point => [point.lng, point.lat])]);
    const polygonBoundary = turf.lineString(polygonCoords.map(point => [point.lng, point.lat]));
    const refLine = turf.lineString(referenceRow.map(point => [point.lng, point. lat]));

    const processOffset = (offsetStep: number) => {
        const currentDistance = (offsetStep * rowDistance) / 100;

        for (let i = 2; i <= numberOfRows; i++) {
        const distance = currentDistance * (i - 1); 

        const shiftedLine = turf.lineOffset(refLine, distance, {units: "meters"});

        const candidateLine = lineToLatLng(shiftedLine);
        const isInside = turf.booleanWithin(shiftedLine, polygon);

        if (isInside) {
            generatedLines.push(candidateLine)
        } else {
            const intersections = turf.lineIntersect(shiftedLine, polygonBoundary);

            if (intersections.features.length < 2) {
                break;
            }
            
            const clippedLine = turf.lineString([
            intersections.features[0].geometry.coordinates,
            intersections.features[1].geometry.coordinates
            ]);

            generatedLines.push(lineToLatLng(clippedLine));
            }
        }
    }

    processOffset(1);
    processOffset(-1);

    return generatedLines;
};