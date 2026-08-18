export const toDateTimeLocal = (date: Date): string => {
    const timezoneOffset = date.getTimezoneOffset();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const offsetSign = timezoneOffset > 0 ? "-" : "+";
    const offsetHours = String(
      Math.floor(Math.abs(timezoneOffset) / 60),
    ).padStart(2, "0");
    const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(
      2,
      "0",
    );

    return `${year}-${month}-${day}T${hours}:${minutes}:00${offsetSign}${offsetHours}:${offsetMinutes}`;
  };