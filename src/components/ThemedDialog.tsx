import { CloseRounded } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
} from "@mui/material";

interface ThemedDialogProps extends DialogProps {
  content?: React.ReactNode;
  onClose: () => void;
}

const ThemedDialog = ({
  content,
  onClose,
  ...otherProps
}: ThemedDialogProps) => {
  return (
    <Dialog
      PaperProps={{
        sx: { borderRadius: "8px" },
      }}
      onClose={onClose}
      {...otherProps}
    >
      <DialogTitle sx={{ position: "relative", pt: 1 }}>
        <IconButton
          onClick={onClose}
          sx={{
            bgcolor: "#2F80ED",
            color: "#FFF",
            borderRadius: "8px",
            p: 0.5,
            position: "absolute",
            bottom: "-16px",
            right: "8px",
            zIndex: 10,
            "&:hover": {
              bgcolor: "#1565c0",
            },
          }}
        >
          <CloseRounded />
        </IconButton>
      </DialogTitle>
      <DialogContent>{content}</DialogContent>
    </Dialog>
  );
};

export default ThemedDialog;
