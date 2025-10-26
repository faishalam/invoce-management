import React, { useId } from "react";
import {
  TextFieldProps,
  TextField,
  InputAdornment,
  MenuItem,
} from "@mui/material";

type CInputProps = {
  icon?: React.ReactNode;
  unit?: string;
  unitOptions?: string[];
  onUnitChange?: (unit: string) => void;
  inputClassName?: string;
  required?: boolean;
} & TextFieldProps;

const CInput: React.FC<CInputProps> = ({
  icon,
  label,
  unit,
  unitOptions,
  onUnitChange,
  inputClassName,
  required,
  ...props
}) => {
  const reactId = useId();
  const id = reactId;

  return (
    <div className={props.className}>
      {typeof label === "string" ? (
        <small>
          <label htmlFor={id} className="font-medium">
            {label.replace(/\*$/, "")}
            {(required || label.endsWith("*")) && (
              <span style={{ color: "red" }}>*</span>
            )}
          </label>
        </small>
      ) : (
        <small>
          <label htmlFor={id} className="font-medium">
            {label}
          </label>
        </small>
      )}
      <TextField
        id={id}
        className={inputClassName}
        variant="outlined"
        slotProps={{
          input: {
            startAdornment: icon && (
              <InputAdornment position="start">{icon}</InputAdornment>
            ),
            endAdornment: unit && (
              <InputAdornment position="end">
                {unitOptions ? (
                  <TextField
                    select
                    value={unit}
                    onChange={(e) =>
                      onUnitChange && onUnitChange(e.target.value)
                    }
                    variant="standard"
                    sx={{ width: 60 }}
                  >
                    {unitOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <span style={{ fontSize: "0.75em" }}>{unit}</span>
                )}
              </InputAdornment>
            ),
          },
        }}
        sx={{
          backgroundColor: props?.disabled ? "#F3F4F6" : "white",
          width: "100%",
          "& .MuiInputBase-root": { height: "36px" },
          "& input": { height: "36px", padding: "0 14px" },
          "& .MuiInputBase-input": {
            fontSize: "12px",
            height: "36px",
            // padding: '8px 14px',
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px", // ✅ custom border radius di sini
          },
          "& input:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 1000px white inset",
            WebkitTextFillColor: "black",
            transition: "5000s ease-in-out 0s",
          },
          ...props.sx,
        }}
        {...props}
        value={props.value || ""}
      />
    </div>
  );
};

export default CInput;
