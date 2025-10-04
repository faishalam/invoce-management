'use client'

import React from 'react'
import { TextField, TextFieldProps } from '@mui/material'

interface TextAreaProps extends Omit<TextFieldProps, 'multiline'> {
  label: string
  required?: boolean
  inputClassName?: string
}

export function TextArea({ label, required = false, inputClassName, ...props }: TextAreaProps) {
  const generatedID = Math.random().toString(36).substring(7)
  const id = props.id || generatedID
  return (
    <div className={props.className}>
      {typeof label === 'string' ? (
        <small>
          <label htmlFor={id}>
            {label.replace(/\*$/, '')}
            {(required || label.endsWith('*')) && <span style={{ color: 'red' }}>*</span>}
          </label>
        </small>
      ) : (
        <small>
          <label htmlFor={id}>{label}</label>
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
          '& .MuiOutlinedInput-root': {
            backgroundColor: props?.disabled ? '#F3F4F6' : 'white',
            // "& fieldset": {
            //   borderColor: "#E5E7EB",
            // },
            '&:hover fieldset': {
              borderColor: '#D1D5DB',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6366F1',
            },
          },
          '& .MuiInputBase-input': {
            fontSize: '12px',
            height: '36px',
            // padding: "8px 14px",
          },
          ...props.sx,
        }}
      />
    </div>
  )
}
