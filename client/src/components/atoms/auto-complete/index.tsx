import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

import { AutocompleteProps } from '@mui/material/Autocomplete'
import { InputAdornment } from '@mui/material'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface TProps extends AutocompleteProps<any, any, any, any> {
  label?: string
  placeholder?: string
  unit?: string
  disabled?: boolean
  required?: boolean
}
const CAutoComplete: React.FC<Omit<TProps, 'renderInput'>> = props => {
  const generatedID = Math.random().toString(36).substring(7)
  const id = props.id || generatedID
  return (
    <div className={props.className}>
      {typeof props?.label === 'string' ? (
        <small>
          <label htmlFor={id}>
            {props?.label.replace(/\*$/, '')}
            {(props?.required || props?.label.endsWith('*')) && <span style={{ color: 'red' }}>*</span>}
          </label>
        </small>
      ) : (
        <small>
          <label htmlFor={id}>{props?.label}</label>
        </small>
      )}
      <Autocomplete
        {...props}
        className={props?.disabled ? 'bg-[#F3F4F6] text-black' : ''}
        id={id}
        renderInput={params => (
          <TextField
            {...params}
            sx={
              props.multiple
                ? {
                    '& .MuiInputBase-root': {
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'center', // Center the tags horizontally
                      alignItems: 'center', // Ensure the tags are aligned vertically
                    },
                    // '& .MuiAutocomplete-inputRoot': {
                    //   //height: '36px', // Adjust input height if needed
                    //   display: 'flex',
                    //   justifyContent: 'center', // Ensure the input text is centered
                    //   alignItems: 'center', // Center the text vertically
                    // },
                    '& .MuiChip-root': {
                      margin: '2px', // Add some margin to chips for spacing
                      backgroundcolor: '#e0e0e0', // You can customize the chip background
                      fontSize: '10px',
                      // width: '100%',
                      // height: '25px',
                      // alignItems: 'center',
                      // marginBottom: '100px',
                    },
                  }
                : {
                    height: '36px',
                    '& .MuiInputBase-root': { height: '36px' },
                    '& input': { height: '36px', padding: '0 14px' },
                    '& .MuiInputBase-input': {
                      fontSize: '12px',
                      height: '36px',
                      padding: '8px 14px',
                    },
                  }
            }
            placeholder={props.placeholder}
            InputProps={{
              ...params.InputProps, 
              endAdornment: (
                <>
                  {props.unit && (
                    <InputAdornment position="end">
                      {props.unit}
                    </InputAdornment>
                  )}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </div>
  )
}
export default CAutoComplete
