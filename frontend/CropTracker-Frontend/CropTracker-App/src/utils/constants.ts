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

export const standardNameRegex = /^\p{Lu}(?![\s_-]*$)[\p{L}\d\s_-]{2,33}[\p{L}\d]$/u;

export function getNameError(value: string): string | null {
  if (!value) return "Name is required.";
  if (value.length < 4 || value.length > 35) return "Must be between 4 and 35 characters.";
  if (!/^\p{Lu}/u.test(value)) return "Must start with an uppercase letter.";
  if (/[\s_-]$/.test(value)) return "Cannot end with a space, _ or -";
  if (!/^[\p{L}\d\s_-]+$/u.test(value)) return "Only letters, numbers, spaces, '_' and '-' are allowed.";
  
  return null;
}