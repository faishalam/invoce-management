"use client";

import * as React from "react";
import {
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  TextFieldProps,
} from "@mui/material";

type SelectInputProps = {
  label?: string;
  value: string | number;
  unit?: string;
  required?: boolean;
  onUnitChange?: (unit: string) => void;
  units?: string[];
  placeholder?: string;
} & TextFieldProps;

export default function SelectInput({
  label,
  value,
  unit,
  required,
  onUnitChange,
  units,
  placeholder,
  ...props
}: SelectInputProps) {
  const generatedID = React.useId();
  const id = generatedID;
  return (
    <div className={props.className}>
      {label && (
        <small>
          <label htmlFor={id}>{label}</label>
        </small>
      )}
      <TextField
        {...props}
        placeholder={placeholder}
        variant="outlined"
        value={value}
        required={required}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Select
                  value={unit}
                  onChange={(e) => onUnitChange?.(e.target.value)}
                  variant="standard"
                >
                  {units?.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </Select>
              </InputAdornment>
            ),
          },
        }}
        sx={{
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
      />
    </div>
  );
}
