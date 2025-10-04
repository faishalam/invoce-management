import { Tooltip } from '@mui/material'

type RenderCellExpandProps = {
  text: string
  maxLength: number
}
const RenderCellExpand: React.FC<RenderCellExpandProps> = ({ text, maxLength }) => {
  return (
    <Tooltip title={text.length > maxLength ? text : ''} placement="top-start">
      <span>{`${text.slice(0, maxLength)} ${text.length > maxLength ? '...' : ''}`}</span>
    </Tooltip>
  )
}
export default RenderCellExpand
