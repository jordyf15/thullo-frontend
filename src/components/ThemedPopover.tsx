import { Popover, PopoverProps } from "@mui/material";

interface ThemedPopoverProps extends PopoverProps {
  onClose: () => void;
  content?: React.ReactNode;
}

const ThemedPopover = ({
  content,
  onClose,
  ...otherProps
}: ThemedPopoverProps) => {
  return (
    <Popover
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      PaperProps={{
        sx: {
          mt: "15px",
          border: "1px solid #E0E0E0",
          borderRadius: "12px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
          p: 1.5,
        },
      }}
      {...otherProps}
    ></Popover>
  );
};

export default ThemedPopover;
