import React, { JSX } from 'react'
import { Box } from '@mui/material'

import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'

interface IsOverflownElement extends HTMLElement {
  scrollHeight: number
  clientHeight: number
  scrollWidth: number
  clientWidth: number
}

function isOverflown(element: IsOverflownElement | null): boolean {
  if (!element) return false
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth
}

export const GridCellExpand = React.memo(function GridCellExpand(props: {
  width: number
  value: string
}) {
  const { width, value } = props
  const wrapper = React.useRef<HTMLDivElement>(null)
  const cellDiv = React.useRef(null)
  const cellValue = React.useRef(null)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [showFullCell, setShowFullCell] = React.useState(false)
  const [showPopper, setShowPopper] = React.useState(false)

  const handleMouseEnter = () => {
    const isCurrentlyOverflown = isOverflown(cellValue.current)
    setShowPopper(isCurrentlyOverflown)
    setAnchorEl(cellDiv.current)
    setShowFullCell(true)
  }

  const handleMouseLeave = () => {
    setShowFullCell(false)
  }

  React.useEffect(() => {
    if (!showFullCell) {
      return undefined
    }

    function handleKeyDown(nativeEvent: KeyboardEvent) {
      // IE11, Edge (prior to using Bink?) use 'Esc'
      if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
        setShowFullCell(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [setShowFullCell, showFullCell])

  return (
    <Box
      ref={wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        alignItems: 'center',
        lineHeight: '24px',
        width: 1,
        height: 1,
        position: 'relative',
        display: 'flex',
      }}
    >
      <Box
        ref={cellDiv}
        sx={{
          height: 0,
          width: 200,
          display: 'block',
          position: 'absolute',
          top: 0,
        }}
      />
      <Box
        ref={cellValue}
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value}
      </Box>
      {showPopper && (
        <Popper
          open={showFullCell && anchorEl !== null}
          anchorEl={anchorEl}
          style={{
            width,
            // marginLeft: 17 ,
            zIndex: 1500,
          }}
        >
          <Paper elevation={1} style={{ minHeight: (wrapper.current?.offsetHeight ?? 0) - 3 }}>
            <Typography variant="body2" style={{ padding: 7 }}>
              {value}
            </Typography>
          </Paper>
        </Popper>
      )}
    </Box>
  )
})

interface RenderCellExpandParams {
  value?: string
  colDef?: {
    computedWidth?: number
    width?: number
  }
}

function renderCellExpand(params?: RenderCellExpandParams): JSX.Element {
  if (!params || !params.colDef) {
    return <GridCellExpand value="" width={150} />
  }
  const width = (params?.colDef?.computedWidth ?? params?.colDef?.width ?? 100) + 50
  const value = params?.value ?? ''
  return <GridCellExpand value={value} width={width} />
}
export const sliceLongText = (text: string, maxLength: number): string => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...'
  }
  return text
}
export default renderCellExpand
