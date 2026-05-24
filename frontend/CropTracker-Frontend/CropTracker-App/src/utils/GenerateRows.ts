import * as turf from "@turf/turf";
import type { LatLngObject } from "../interfaces/LatLngObject";
import type { Feature, LineString } from "geojson";


const lineToLatLng = (line: Feature<LineString>) => {
    return line.geometry.coordinates.map(point => ({
        lat: point[1],
        lng: point[0]
    }))
}

const getSnappedLine = (massiveRefLine: Feature<LineString>, polygonBoundaries: Feature<LineString>, distance: number) => {
    const shiftedLine = turf.lineOffset(massiveRefLine, distance, {units: "meters"});

        const intersections = turf.lineIntersect(shiftedLine, polygonBoundaries);

        if (intersections.features.length >= 2) {
            const sortedPoints = intersections.features.map(f => f.geometry.coordinates);

            const croppedLine = turf.lineString(sortedPoints);
            return lineToLatLng(croppedLine);
        }

        return null;
}

const extendLine = (originalLine: Feature<LineString>, scale: number) => {
    const [lng1, lat1] = originalLine.geometry.coordinates[0];
    const [lng2, lat2] = originalLine.geometry.coordinates[1];

    const dLng = lng2 - lng1;
    const dLat = lat2 - lat1;

    const extendedLng1 = lng1 - dLng * scale;
    const extendedLat1 = lat1 - dLat * scale;
    const extendedLng2 = lng2 + dLng * scale;
    const extendedLat2 = lat2 + dLat * scale;

    return turf.lineString([
    [extendedLng1, extendedLat1],
    [extendedLng2, extendedLat2]
]);
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

    const dist1 = turf.pointToLineDistance(refLine.geometry.coordinates[0], polygonBoundary, {units: "meters"});
    const dist2 = turf.pointToLineDistance(refLine.geometry.coordinates[1], polygonBoundary, {units: "meters"});
    const safePolygon = turf.buffer(polygon, -Math.min(dist1, dist2), {
        units: "meters"
    });

    if (!safePolygon) return;

    const safePolygonBoundaries = turf.polygonToLine(safePolygon) as Feature<LineString>;
    const massiveRefLine = extendLine(refLine, 10);

    let leftStep = 1;
    let rightStep = 1;

    const newLine = getSnappedLine(massiveRefLine, safePolygonBoundaries, 0);
    if (newLine) {
        console.log("Push");
        generatedLines.push(newLine);
    }

    let leftPushFail = false;
    let rightPushFail = false;

    while (generatedLines.length < numberOfRows) {
        let distance = 0;

        if (!rightPushFail && rightStep <= leftStep) {
            distance = (rightStep * rowDistance) / 100;
            rightStep++;
        } else {
            distance = (-leftStep * rowDistance) / 100;
            leftStep++;
        }

        const newLine = getSnappedLine(massiveRefLine, safePolygonBoundaries, distance);

        if (newLine) {
            generatedLines.push(newLine);
        } else {
            if (distance >= 0) {
                rightPushFail = true;
            } else {
                leftPushFail = true;
            }
        }

        if (leftPushFail && rightPushFail) break;

    }

    return generatedLines;
};