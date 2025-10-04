import React from 'react'
import { ThreeDot } from 'react-loading-indicators'

const Loader: React.FC<{
  text?: string
  size?: 'small' | 'medium' | 'large'
  style?: React.CSSProperties
  variant?: 'pulsate' | 'bob' | 'brick-stack' | 'bounce'
}> = ({ text, size, style, variant }) => {
  return (
    <ThreeDot
      variant={variant || 'bounce'}
      color="#006766"
      size={size || 'medium'}
      text={text}
      textColor="#006766"
      style={style}
    />
  )
}
export default Loader
