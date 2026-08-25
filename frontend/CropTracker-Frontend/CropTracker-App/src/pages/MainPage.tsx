import {
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import MainHeader from "../elements/headers/MainHeader";
import ProgressCircle from "../elements/progress/ProgressCircle";
import MainContainer from "../elements/containers/MainContainer";
import ColumnCenterContainer from "../elements/containers/ColumnCenterContainer";
import { useNavigate, useSearchParams } from "react-router-dom";
import InvalidAuthTokenDialog from "../elements/dialogs/InvalidAuthTokenDialog";
import { useEffect, useState } from "react";
import { useCurrentProfile } from "../hooks/caching/UseCurrentUser";
import MainPageHeroCarousel from "../elements/hero-carousel/MainPageHeroCarousel";
import { useTranslation } from "react-i18next";
import { useTodaysFieldWorks } from "../hooks/caching/UseTodaysWorks";

function MainPage() {
  const { t } = useTranslation();

  const { data: user, isLoading } = useCurrentProfile(
    !!sessionStorage.getItem("accessToken"),
  );
  const { data: fieldWorksData, isLoading: isLoadingFieldWorks } =
    useTodaysFieldWorks(!!user);

  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setDialogOpen(searchParams.get("error") === "unauthorized");
  }, [searchParams]);

  const handleClose = () => {
    setDialogOpen(false);
    searchParams.delete("error");
    setSearchParams(searchParams, { replace: true });
  };

  const handleConfirm = () => {
    setDialogOpen(false);
    searchParams.delete("error");
    setSearchParams(searchParams, { replace: true });
    navigate("/signin");
  };

  if (isLoading || isLoadingFieldWorks) {
    return <ProgressCircle loadingMessage="Loading your profile" />;
  }

  return (
    <>
      <MainHeader />
      <Box sx={{ minHeight: "100vh", overflow: "visible" }}>
        <MainContainer>
          <ColumnCenterContainer>
            {!user ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  my: 5,
                  gap: 10,
                  overflow: "visible",
                }}
              >
                <Typography
                  variant="h2"
                  component={"h1"}
                  sx={{ mt: 25, fontWeight: "bold" }}
                >
                  {t("pages.mainPage.welcomeTitle", {
                    defaultValue: "Welcome to Crop Tracker!",
                  })}
                </Typography>
                <MainPageHeroCarousel />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                    gap: 2,
                  }}
                >
                  <Typography sx={{ mx: "auto", fontWeight: 500 }}>
                    {t("pages.mainPage.signupHelperText", {
                      defaultValue:
                        "Click on the button below to start your crop tracking journey",
                    })}
                  </Typography>
                  <Button
                    color="success"
                    variant="contained"
                    sx={{ mb: 5, mx: "auto", width: 300 }}
                    onClick={() => navigate("/signup")}
                  >
                    {t("pages.mainPage.signupButton", {
                      defaultValue: "Register",
                    })}
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Typography
                  variant="h2"
                  component={"h1"}
                  sx={{ fontWeight: "bold" }}
                >
                  {`${t("pages.mainPage.welcomeBackTitle", {
                    defaultValue: "Welcome back,",
                  })} ${user.firstName}`}
                </Typography>
                {!!fieldWorksData && fieldWorksData.length > 0 ? (
                  <Box sx={{ mt: 10 }}>
                    <Typography sx={{ textAlign: "left" }}>
                      {t("pages.mainPage.fieldWorksText1", {
                        defaultValue: "You have ",
                      })}
                      {fieldWorksData.length}
                      {t("pages.mainPage.fieldWorksText2", {
                        defaultValue: " works programmed for today",
                      })}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <List>
                      {fieldWorksData?.map((fieldWork) => (
                        <ListItemButton
                          key={fieldWork.uid}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold" }}
                          >
                            {fieldWork.startDate.substring(11, 16)}
                          </Typography>
                          <Typography variant="body1">
                            {fieldWork.cropFieldName} -{" "}
                            {t(
                              `elements.forms.addFieldWorkForm.systemWorkTypes.${fieldWork.workTypeName}.name`,
                              {
                                defaultValue: fieldWork.workTypeName,
                              },
                            )}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              onClick={() =>
                                navigate(`/field-work-details/${fieldWork.uid}`)
                              }
                            >
                              {t("pages.mainPage.fieldWorkDetailsButton", {
                                defaultValue: "Details",
                              })}
                            </Button>
                          </Box>
                        </ListItemButton>
                      ))}
                    </List>
                  </Box>
                ) : (
                  <Typography>
                    {t("pages.mainPage.noFieldWorksText", {
                      defaultValue: "You have no works programmed for today",
                    })}
                  </Typography>
                )}
              </Box>
            )}
          </ColumnCenterContainer>
        </MainContainer>

        {dialogOpen && (
          <InvalidAuthTokenDialog
            onConfirm={handleConfirm}
            onConfirmCancel={handleClose}
            open={dialogOpen}
          />
        )}
      </Box>
    </>
  );
}

export default MainPage;
