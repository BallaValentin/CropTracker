import { ListItem, Typography } from "@mui/material";

interface FieldParcelItemProps {
  propName: string;
  propValue: string;
}

function FieldParcelPropItem({ propName, propValue }: FieldParcelItemProps) {
  return (
    <ListItem
      disableGutters
      sx={{ py: 0.25, display: "flex", justifyContent: "space-between" }}
    >
      <Typography variant="body2" color="text.secondary">
        {`${propName}:`}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {propValue}
      </Typography>
    </ListItem>
  );
}

export default FieldParcelPropItem;
