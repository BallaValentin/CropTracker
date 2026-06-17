export const expandedDrawerWidth: number = 240;
export const collapsedDrawerWidth: number = 72;
export const defaultMapPosition = {
    lat: 51.505,
    lng: -0.09
}

export const cropWidthCm = 5;

export const breakPointMedium = 20;
export const breakPointHigh = 22;
export const safetyThresholdMeters = 0.1;

export const referenceLineId = "reference-line";

export const WorkTypes = {
    Tillage: 'Tillage',
    Sowing: 'Sowing',
    Fertilization: 'Fertilization',
    Spraying: 'Spraying',
    Irrigation: 'Irrigation',
    Scouting: 'Scouting',
    Harvesting: 'Harvesting',
    Maintenance: 'Maintenance'
} as const;

export const maxLines = 10;

export const digitsLength = 6;

export const standardNameRegex = /^\p{Lu}(?![\s_-]*$)[\p{L}\d\s_-]{2,33}[\p{L}\d]$/u;