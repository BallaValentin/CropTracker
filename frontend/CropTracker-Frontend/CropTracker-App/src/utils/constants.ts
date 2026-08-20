export const expandedDrawerWidth: number = 300;
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

export const PastelPresets = [
  "#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7", 
  "#C7CEEA", "#FFC6FF", "#E8AEB7", "#B8E0F6"
];

export const maxLines = 10;

export const digitsLength = 6;

export const standardNameRegex = /^\p{Lu}(?![\s_-]*$)[\p{L}\d\s_-]{2,33}[\p{L}\d]$/u;

export const pageSize = 25;