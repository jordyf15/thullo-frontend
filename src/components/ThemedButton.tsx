import { Button, ButtonProps } from "@mui/material";

const ThemedButton = ({
  sx,
  children,
  startIcon,
  disabled,
  ...otherProps
}: ButtonProps) => {
  return (
    <Button
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        fontSize: "14px",
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontWeight: 500,
        color: "#FFF",
        py: "8px",
        px: "14px",
        borderRadius: "8px",
        bgcolor: "#2F80ED",
        textTransform: "none",
        ...sx,
      }}
      startIcon={startIcon}
      variant="contained"
      disabled={disabled}
      {...otherProps}
    >
      {children}
    </Button>
  );
};

export default ThemedButton;
