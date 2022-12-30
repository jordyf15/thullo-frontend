import { Lock, Public } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonProps,
  PopoverProps,
  Stack,
  SvgIconTypeMap,
  Typography,
} from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { BoardVisibility } from "../models/board";
import ThemedPopover from "./ThemedPopover";

interface VisibilityPopoverProps extends PopoverProps {
  onClose: () => void;
  onPickVisibility: (visibility: BoardVisibility) => void;
}

const VisibilityPopover = ({
  onClose,
  onPickVisibility,
  ...otherProps
}: VisibilityPopoverProps) => {
  const onPickOption = (visibility: BoardVisibility) => {
    onPickVisibility(visibility);
    onClose();
  };

  return (
    <ThemedPopover onClose={onClose} {...otherProps}>
      <Stack spacing={2} justifyContent="flex-start">
        <Stack>
          <Typography fontWeight={600} color="#4F4F4F" fontSize="14px">
            Visibility
          </Typography>
          <Typography
            fontFamily={["Noto Sans", "sans-serif"].join(",")}
            color="#828282"
            fontSize="14px"
          >
            Choose who can see this board
          </Typography>
        </Stack>
        <VisibilityOption
          icon={Public}
          optionName="Public"
          optionDescription="Anyone on the internet can see this"
          onClick={() => onPickOption(BoardVisibility.Public)}
        />
        <VisibilityOption
          icon={Lock}
          optionName="Private"
          optionDescription="Only board members can see this"
          onClick={() => onPickOption(BoardVisibility.Private)}
        />
      </Stack>
    </ThemedPopover>
  );
};

interface VisibilityOptionProps extends ButtonProps {
  icon: OverridableComponent<SvgIconTypeMap<unknown, "svg">> & {
    muiName: string;
  };
  optionName: string;
  optionDescription: string;
}

const VisibilityOption = ({
  icon,
  optionName,
  optionDescription,
  ...otherProps
}: VisibilityOptionProps) => {
  return (
    <Button
      sx={{
        p: "12px",
        textTransform: "none",
        color: "#4F4F4F",
        borderRadius: "8px",
        "&:hover": {
          bgcolor: "#F2F2F2",
        },
        display: "flex",
        justifyContent: "start",
      }}
      {...otherProps}
    >
      <Stack spacing={0.5}>
        <Stack alignItems="center" direction="row" spacing={1}>
          <Box
            component={icon}
            sx={{
              fontSize: "16px",
            }}
          />
          <Typography
            fontFamily={["Noto Sans", "sans-serif"].join(",")}
            fontWeight={500}
            fontSize="14px"
          >
            {optionName}
          </Typography>
        </Stack>
        <Typography
          fontFamily={["Noto Sans", "sans-serif"].join(",")}
          fontSize="12px"
          color="#828282"
        >
          {optionDescription}
        </Typography>
      </Stack>
    </Button>
  );
};

export default VisibilityPopover;
