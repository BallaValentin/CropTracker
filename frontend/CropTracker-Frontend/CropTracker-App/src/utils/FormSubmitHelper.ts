import type { LatLngObject } from "../interfaces/helper/LatLngObject";

export const getNameError = (value: string): string | null => {
  if (!value) return "Name is required.";
  if (value.length < 4 || value.length > 35) return "Must be between 4 and 35 characters.";
  if (!/^\p{Lu}/u.test(value)) return "Must start with an uppercase letter.";
  if (/[\s_-]$/.test(value)) return "Cannot end with a space, _ or -";
  if (!/^[\p{L}\d\s_-]+$/u.test(value)) return "Only letters, numbers, spaces, '_' and '-' are allowed.";
  
  return null;
}

export const getPolygonError = (polygonPoints: LatLngObject[]): string | null => {
    if (!polygonPoints || polygonPoints.length < 3) return "Missing polygon shape.";
    return null;
}

export const getPersonNameError = (value: string) => {
  if (!value) return "Name is required";
  if (value.length < 2 || value.length > 30) return "Name must be between 2 and 30 characters long.";
  if (!/^\p{Lu}\p{Ll}+$/u.test(value))
    return "Name must start with an uppercase letter followed only by lowercase letters.";
  return null;
}

export const getUsernameError = (value: string) => {
  if (!value) return "Username is required.";
  if (value.length < 2 || value.length > 30) return "Username must be between 2 and 30 characters long.";
  if (!/^[A-Za-z][A-Za-z0-9_]+$/.test(value)) return "Username must start with a letter followed by letters and digits.";

  return null;
}

export const getEmailError = (value: string) => {
  if (!value) return "Email address is required";
  if (value.length < 6 || value.length > 100) return "Email address must be between 6 and 100 characters long.";
  if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        value,
      )) return "Must be a valid email address (ex. john.smith@email.com)";

  return null;
}

export const getPasswordError = (value: string) => {
  if (!value) return "Password is required.";
  if (value.length < 8 || value.length > 30) return "Password must be between 8 and 30 characters long";
  if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(value))
    return "Passwors must contain the following at least: one uppercase letter, one lowercase letter, one digit and one special character";
  return null;
}