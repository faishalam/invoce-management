import { MenuItem, Select, SelectProps } from '@mui/material'
// import { useState } from 'react'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TParams = { label: string; [k: string]: any }
type TProps = {
  options: TParams[]
  onChange: (p: TParams) => void
  label?: string
} & SelectProps
const CDropdown: React.FC<TProps> = ({
  options,
  onChange,
  label,
  // ...props
}) => {
  return (
    <div className="!w-full">
      {label && (
        <small>
          <label>{label}</label>
        </small>
      )}
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        // value={value}
        variant="outlined"
        // onChange={handleChange}
        sx={{
          width: '100%',
          '& .MuiInputBase-root': { height: '20px' },
          '& input': { height: '20px', padding: '0 10px' },
          '& .MuiInputBase-input': {
            fontSize: '12px',
            height: '20px',
            padding: '8px 10px',
          },
          // ...props.sx,
        }}
      >
        {options.map(option => (
          <MenuItem key={option.label} value={option.label} onClick={() => onChange(option.value)}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </div>
  )
}
export default CDropdown
