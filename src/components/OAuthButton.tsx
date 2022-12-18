import { IconButton, IconButtonProps } from "@mui/material";

const OAuthButton = ({
  sx,
  children,
  disabled,
  ...otherProps
}: IconButtonProps) => {
  return (
    <IconButton
      sx={{
        color: "#828282",
        border: "1px solid #828282",
        borderRadius: "100%",
        ...sx,
      }}
      size="small"
      {...otherProps}
    >
      {children}
    </IconButton>
  );
};

export default OAuthButton;
