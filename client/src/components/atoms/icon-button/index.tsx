import { IconButton, IconButtonProps } from '@mui/material'

type TProps = IconButtonProps & {
  children?: React.ReactNode
}

const CIconButton: React.FC<TProps> = ({ children, ...props }) => {
  const generatedID = Math.random().toString(36).substring(7)
  const id = props.id || generatedID
  const ariaLabel = props['aria-label'] || `custom-icon-button-${id}`
  const title = props.title || `custom-icon-button-${id}`
  const ariaLabelledBy = props['aria-labelledby'] || `custom-icon-button-${id}`
  const role = props.role || 'button'
  return (
    <IconButton
      {...props}
      id={id}
      aria-label={ariaLabel}
      title={title}
      aria-labelledby={ariaLabelledBy}
      role={role}
      size={props.size}
    >
      {children}
    </IconButton>
  )
}
export default CIconButton
