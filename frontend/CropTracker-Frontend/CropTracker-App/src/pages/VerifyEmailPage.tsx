import { Box, Button } from "@mui/material";
import ColumnCenterContainer from "../elements/containers/ColumnCenterContainer";
import VerifyEmailForm from "../elements/forms/VerifyEmailForm";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { useMutation } from "@tanstack/react-query";
import { resendCode, verifyAccount } from "../services/AuthService";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import type { ErrorResponse } from "../interfaces/error/ErrorResponse";
import type { GetResendCodeDTO } from "../interfaces/response/GetResendCodeDTO";

function VerifyEmailPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const token = searchParams.get("token");
  const decodedToken = jwtDecode<JwtPayload>(token || "");
  const email = decodedToken.sub || "";

  const navigate = useNavigate();

  useEffect(() => {
    if (!errorMessage) return;

    const timer = setTimeout(() => setErrorMessage(""), 6000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => setSuccessMessage(""), 6000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  const { mutate, isPending } = useMutation({
    mutationFn: verifyAccount,
    onSuccess: () => {
      navigate("/signin", {
        state: {
          successMessage: "Account has been successfully verified.",
          key: `${Date.now()}`,
        },
      });
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 404 || error.response?.status === 401) {
        const message = (error.response.data as ErrorResponse).message || "";
        setErrorMessage(message);
      }
    },
  });

  const { mutate: resendCodeMutate, isPending: isResendCodePending } =
    useMutation({
      mutationFn: resendCode,
      onSuccess: (response: GetResendCodeDTO) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("token", response.token);

        setSearchParams(newParams);
        setSuccessMessage("New verification code has been successfully sent.");
      },
      onError: (error: AxiosError) => {
        if (error.response?.status === 404 || error.response?.status === 401) {
          const message = (error.response.data as ErrorResponse).message || "";
          setErrorMessage(message);
        }
      },
    });

  const handleSubmit = (verificationCode: string) => {
    mutate({
      email: email,
      verificationCode: verificationCode,
    });
  };

  const handleResendCode = () => {
    resendCodeMutate({ email: email });
  };

  return (
    <Box>
      <ColumnCenterContainer>
        <VerifyEmailForm
          onSubmit={handleSubmit}
          onResendCode={handleResendCode}
          emailAddress={email}
          errorMessage={errorMessage}
          successMessage={successMessage}
          isPending={isPending || isResendCodePending}
        />

        <Button sx={{ mt: 5 }} onClick={() => navigate("/signup")}>
          Back to Previous Page
        </Button>
      </ColumnCenterContainer>
    </Box>
  );
}

export default VerifyEmailPage;
