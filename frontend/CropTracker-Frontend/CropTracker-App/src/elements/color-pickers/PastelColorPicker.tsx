import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import CasinoOutlinedIcon from "@mui/icons-material/CasinoOutlined";
import { Box, Button, Paper, Typography } from "@mui/material";
import { HexColorPicker } from "react-colorful";
import { PastelPresets } from "../../utils/Constants";

interface PastelColorPickerProps {
  color: string;
  onColorChange: (newColor: string) => void;
}

function PastelColorPicker({ color, onColorChange }: PastelColorPickerProps) {
  const generateRandomPastelColor = () => {
    const red = Math.floor(Math.random() * 55 + 200);
    const green = Math.floor(Math.random() * 55 + 200);
    const blue = Math.floor(Math.random() * 55 + 200);

    const pastelHex =
      `#${((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1)}`.toUpperCase();
    onColorChange(pastelHex);
  };

  return (
    <Paper
      sx={{
        mt: 3,
        p: 1,
        width: "97.5",
        borderRadius: 2,
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}
      >
        <PaletteOutlinedIcon color="action" fontSize="medium" />
        <Typography
          fontSize={"medium"}
          variant="body2"
          sx={{ fontWeight: 600, flexGrow: 1 }}
        >
          Overlay Color
        </Typography>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: color,
            border: "1px solid rgba(0,0,0,0.15)",
          }}
        />
      </Box>

      <Box
        sx={{
          "& .react-colorful": {
            width: "100%",
            height: 160,
            borderRadius: "8px",
          },
        }}
      >
        <HexColorPicker color={color} onChange={onColorChange} />
      </Box>

      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1 }}
      >
        {PastelPresets.map((presetColor) => (
          <Button
            key={presetColor}
            onClick={() => onColorChange(presetColor)}
            sx={{
              backgroundColor: presetColor,
              minWidth: 0,
              height: 28,
              borderRadius: "6px",
              border:
                color.toUpperCase() === presetColor.toUpperCase()
                  ? "2px solid #555"
                  : "1px solid rgba(0,0,0,0.08)",
              "&:hover": { backgroundColor: presetColor, opacity: 0.85 },
            }}
          />
        ))}
      </Box>

      <Button
        variant="text"
        fullWidth
        startIcon={<CasinoOutlinedIcon />}
        onClick={generateRandomPastelColor}
        sx={{
          width: "100%",
          color: "text.secondary",
          textTransform: "none",
          fontSize: "0.75rem",
          fontWeight: 500,
          py: 0.5,
          "&:hover": {
            color: "text.primary",
            backgroundColor: "action.hover",
          },
        }}
      >
        Generate Random Pastel
      </Button>
    </Paper>
  );
}

export default PastelColorPicker;
