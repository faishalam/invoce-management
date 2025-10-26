import React, { useId, useState } from "react";
import { TextFieldProps, TextField } from "@mui/material";

const CInputDate: React.FC<TextFieldProps> = ({ label, ...props }) => {
  const [inputType, setInputType] = useState<string>("date");
  const generatedID = useId();
  const id = props.id || generatedID;

  const handleFocus = () => setInputType("date");
  // const handleBlur = () => setInputType('text')

  return (
    <div className={props.className} style={{ width: "100%" }}>
      {typeof label === "string" ? (
        <small>
          <label htmlFor={id}>
            {label.replace(/\*$/, "")}
            {label.endsWith("*") && <span style={{ color: "red" }}>*</span>}
          </label>
        </small>
      ) : (
        <small>
          <label htmlFor={id}>{label}</label>
        </small>
      )}
      <TextField
        id={id}
        type={inputType}
        onFocus={handleFocus}
        // onBlur={handleBlur}
        variant="outlined"
        slotProps={{
          input: {
            style: {
              height: "36px",
              border: "none",
            },
          },
        }}
        {...props}
        sx={{
          backgroundColor: props?.disabled ? "#F3F4F6" : "white",
          width: "100%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "0px",
            "& fieldset": {
              border: "none",
            },
          },
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
};

export default CInputDate;
