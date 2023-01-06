import { Button, ButtonProps } from "@mui/material";

interface ThemedButtonProps extends ButtonProps {
  theme: "primary" | "secondary";
}

const ThemedButton = ({
  sx,
  children,
  startIcon,
  disabled,
  theme,
  ...otherProps
}: ThemedButtonProps) => {
  return (
    <Button
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        fontSize: "14px",
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontWeight: 500,
        color: theme === "primary" ? "#FFF" : "#828282",
        py: "8px",
        px: "14px",
        borderRadius: "8px",
        bgcolor: theme === "primary" ? "#2F80ED" : "#F2F2F2",
        textTransform: "none",
        "&:hover": {
          bgcolor: theme === "primary" ? "#1565c0" : "#E8E8E8",
        },
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
