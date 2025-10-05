import TextField, { TextFieldProps } from '@mui/material/TextField';
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';
import { InputAdornment } from '@mui/material';
import { useId } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TProps<T = any, Multiple extends boolean | undefined = false> = Omit<
  TextFieldProps,
  'onChange'
> &
  AutocompleteProps<T, Multiple, false, false> & {
    label?: string;
    placeholder?: string;
    unit?: string;
    disabled?: boolean;
    required?: boolean;
    error?: boolean;
    helperText?: string;
  };

const CAutoComplete: React.FC<Omit<TProps, 'renderInput'>> = ({ error, helperText, ...props }) => {
  const generatedID = useId();
  const id = props.id || generatedID;

  return (
    <div className={props.className}>
      {typeof props?.label === 'string' ? (
        <small>
          <label htmlFor={id} className="font-medium">
            {props?.label.replace(/\*$/, '')}
            {(props?.required || props?.label.endsWith('*')) && (
              <span style={{ color: 'red' }}>*</span>
            )}
          </label>
        </small>
      ) : (
        <small>
          <label htmlFor={id} className="font-medium">
            {props?.label}
          </label>
        </small>
      )}

      <Autocomplete
        {...props}
        id={id}
        className={props?.disabled ? 'bg-[#F3F4F6] text-black' : ''}
        renderInput={params => (
          <TextField
            {...params}
            error={!!error}
            helperText={helperText}
            placeholder={props.placeholder}
            sx={
              props.multiple
                ? {
                    '& .MuiChip-root': {
                      margin: '2px',
                      fontSize: '10px',
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
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '6px',
                    },
                  }
            }
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {props.unit && <InputAdornment position="end">{props.unit}</InputAdornment>}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </div>
  );
};

export default CAutoComplete;
