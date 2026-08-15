import { Box, MenuItem, Select, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";

function LanguageSelect() {
  const languages = [
    { code: "en", country: "us", name: "English" },
    { code: "hu", country: "hu", name: "Magyar" },
    { code: "ro", country: "ro", name: "Română" },
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  const currentLangCode = i18n.resolvedLanguage || i18n.language || "en";
  console.log("Current language:", currentLangCode);

  const handleLanguageChange = (selectedLanguage: string) => {
    i18n.changeLanguage(selectedLanguage);
  };

  return (
    <Select
      value={currentLangCode}
      size="small"
      sx={{ minWidth: 140 }}
      onChange={(e) => handleLanguageChange(e.target.value)}
    >
      {languages.map((language) => (
        <MenuItem value={language.code}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <ReactCountryFlag countryCode={language.country} svg />
            <Typography variant="body2">{language.name}</Typography>
          </Box>
        </MenuItem>
      ))}
    </Select>
  );
}

export default LanguageSelect;
