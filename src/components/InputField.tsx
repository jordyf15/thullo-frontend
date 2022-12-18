import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  IconButton,
  InputAdornment,
  SxProps,
  TextField,
  Theme,
} from "@mui/material";
import { useState } from "react";

interface InputFieldProps {
  value: string;
  placeholder: string;
  error: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onBlur?: () => void;
  disabled?: boolean;
  sx?: SxProps<Theme>;
  isPasswordField?: boolean;
}

const InputField = ({
  value,
  placeholder,
  error,
  onChange,
  onBlur,
  disabled,
  isPasswordField,
  sx,
}: InputFieldProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const toggleVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  return (
    <TextField
      error={!!error}
      helperText={error}
      placeholder={placeholder}
      value={value}
      size="small"
      fullWidth
      onChange={onChange}
      onBlur={onBlur}
      type={!isPasswordField ? "text" : isPasswordVisible ? "text" : "password"}
      disabled={disabled}
      sx={{
        fieldset: {
          borderColor: "#E0E0E0",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        },
        input: {
          py: "10px",
          px: "15px",
          fontFamily: ["Poppins", "sans-serif"].join(","),
          fontWeight: 500,
          fontSize: "14px",
        },
        ...sx,
      }}
      InputProps={{
        endAdornment: isPasswordField ? (
          <InputAdornment position="end">
            <IconButton
              sx={{ height: "100%" }}
              onClick={toggleVisibility}
              edge="end"
            >
              {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    ></TextField>
  );
};

export default InputField;
