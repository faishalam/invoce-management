import React from "react";
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
  errors?: string;
} & TextFieldProps;

const CInput: React.FC<CInputProps> = ({
  icon,
  label,
  unit,
  unitOptions,
  onUnitChange,
  inputClassName,
  required,
  errors,
  ...props
}) => {
  const id = props?.id;

  return (
    <div className={props.className}>
      {typeof label === "string" ? (
        <small className={`${errors && "text-red-500"}`}>
          <label htmlFor={id}>
            {label.replace(/\*$/, "")}
            {(required || label.endsWith("*")) && (
              <span style={{ color: "red" }}>*</span>
            )}
          </label>
        </small>
      ) : (
        <small className={`${errors && "text-red-500"}`}>
          <label htmlFor={id}>{label}</label>
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
            padding: "8px 14px",
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
