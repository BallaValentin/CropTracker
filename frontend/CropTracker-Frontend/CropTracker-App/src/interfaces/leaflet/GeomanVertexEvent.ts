export interface GeomanVertexEvent extends L.LeafletEvent {
    workingLayer: L.Layer,
    latlng: L.LatLng,
    shape: string
}