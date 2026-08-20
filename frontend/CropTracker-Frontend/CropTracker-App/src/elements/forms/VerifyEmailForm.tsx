import {
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { digitsLength } from "../../utils/Constants";

interface VerifyEmailProps {
  onSubmit: (verificationCode: string) => void;
  onResendCode: () => void;
  emailAddress: string;
  isPending: boolean;
  errorMessage: string;
  successMessage: string;
}

function VerifyEmailForm({
  onSubmit,
  onResendCode,
  emailAddress,
  errorMessage,
  successMessage,
  isPending,
}: VerifyEmailProps) {
  const [digits, setDigits] = useState<string[]>(Array(digitsLength).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusAndPlaceCursorAtEnd = (element: HTMLInputElement | null) => {
    if (!element) return;

    element.focus();

    const length = element.value.length;
    element.setSelectionRange(length, length);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    index: number,
  ) => {
    const target = event.target as HTMLInputElement;

    if (event.key === "Backspace") {
      if (target.value === "") {
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
      focusAndPlaceCursorAtEnd(inputRefs.current[index - 1]);
    }
    if (event.key === "ArrowRight") {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { value } = event.target;

    if (value === "" || (value.length === 1 && /^\d+$/.test(value))) {
      const newDigits = digits.map((digit, dIndex) =>
        dIndex === index ? value : digit,
      );

      setDigits(newDigits);

      if (value !== "") {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const verificationCode = digits.join("");

    if (verificationCode.length !== digitsLength) return;

    onSubmit(verificationCode);
  };

  const handleResendCode = () => {
    onResendCode();
  };

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: 10,
        py: 5,
        gap: 3,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          letterSpacing: "0.05rem",
          textAlign: "center",
        }}
      >
        Verify Your Email Address
      </Typography>

      <Divider sx={{ width: "100%" }} />

      <Box sx={{ display: "flex", flexDirection: "column", mb: 3 }}>
        <Typography variant="subtitle1">
          A verification email has been sent to
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {emailAddress}
        </Typography>
      </Box>

      <Typography variant="body2">
        Please check your inbox and enter the verification code below to verify
        your email address.
      </Typography>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          {digits.map((digit, index) => (
            <TextField
              key={index}
              type="text"
              value={digit}
              inputRef={(element) => {
                if (element) inputRefs.current[index] = element;
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleDigitChange(e, index)
              }
              onKeyDown={(e) => handleKeyDown(e, index)}
              slotProps={{
                htmlInput: {
                  style: { textAlign: "center" },
                },
              }}
              sx={{
                width: "48px",
                height: "48px",

                "& .MuiInputBase-root": {
                  height: "100%",
                },

                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    WebkitAppearance: "none",
                    margin: 0,
                  },

                "& input[type=number]": {
                  MozAppearance: "textfield",
                },
              }}
            />
          ))}
        </Box>

        <Typography variant="caption" color="error">
          {errorMessage}
        </Typography>

        <Typography variant="caption" color="success">
          {successMessage}
        </Typography>

        <Button
          sx={{ mt: 3 }}
          fullWidth
          disabled={isPending}
          type="submit"
          variant="contained"
        >
          Verify Account
        </Button>

        <Button
          onClick={handleResendCode}
          fullWidth
          sx={{ mt: 1 }}
          disabled={isPending}
          type="submit"
        >
          Resend Code
        </Button>
      </form>
    </Paper>
  );
}

export default VerifyEmailForm;
