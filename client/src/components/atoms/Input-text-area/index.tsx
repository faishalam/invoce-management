'use client';

import React, { useId } from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface TextAreaProps extends Omit<TextFieldProps, 'multiline'> {
  label: string;
  required?: boolean;
  inputClassName?: string;
}

export function TextArea({ label, required = false, inputClassName, ...props }: TextAreaProps) {
  const generatedID = useId();
  const id = props.id || generatedID;
  return (
    <div className={props.className}>
      {typeof label === 'string' ? (
        <small>
          <label htmlFor={id} className="font-medium">
            {label.replace(/\*$/, '')}
            {(required || label.endsWith('*')) && <span style={{ color: 'red' }}>*</span>}
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
        className={inputClassName}
        multiline
        rows={4}
        fullWidth
        required={required}
        variant="outlined"
        {...props}
        sx={{
          backgroundColor: props?.disabled ? '#F3F4F6' : 'white',
          width: '100%',
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px',
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
            },
          },
          '& .MuiInputBase-input': {
            fontSize: '12px',
            lineHeight: '1.5rem',
            // padding: '10px 14px',
          },
          '& textarea': {
            resize: 'vertical',
          },
          '& .Mui-disabled': {
            backgroundColor: '#F3F4F6',
          },
          ...props.sx,
        }}
      />
    </div>
  );
}
