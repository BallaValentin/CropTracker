import Typography from "@mui/material/Typography";

interface PageTitleProps {
  titleText: string;
}

function PageTitle({ titleText }: PageTitleProps) {
  return (
    <Typography
      component={"h1"}
      color="success"
      letterSpacing={"0.02em"}
      sx={{ fontWeight: "bold", mt: 10 }}
      variant="h3"
    >
      {titleText}
    </Typography>
  );
}

export default PageTitle;
