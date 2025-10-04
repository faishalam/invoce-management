import Link, { LinkProps } from 'next/link'

interface IProps extends LinkProps {
  children?: React.ReactNode
}
const CLink: React.FC<IProps> = (props) => {
  return (
    <Link {...props} aria-label='custom-link'>
      {props.children}
    </Link>
  )
}
export default CLink
