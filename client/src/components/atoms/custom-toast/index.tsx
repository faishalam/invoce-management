import { toast, ToastOptions } from 'react-toastify'
type TProps = {
  title?: string
  message?: string
}
const CToastSuccess: React.FC<TProps> = ({ title, message }) => {
  return (
    <div className='flex gap-2 items-center'>
      <div className='grid'>
        <div className='font-bold'>{title}</div>
        <small>{message}</small>
      </div>
    </div>
  )
}
export const cToast = {
  success: (
    props: { title: string; message: string } | string,
    opts?: ToastOptions
  ) => {
    if (typeof props === 'string') {
      toast.success(<CToastSuccess message={props} />, opts)
    } else {
      toast.success(<CToastSuccess {...props} />, opts)
    }
  },
  error: (
    props: { title: string; message: string } | string,
    opts?: ToastOptions
  ) => {
    if (typeof props === 'string') {
      toast.error(<CToastSuccess message={props} />, opts)
    } else {
      toast.error(<CToastSuccess {...props} />, opts)
    }
  },
  info: (
    props: { title: string; message: string } | string,
    opts?: ToastOptions
  ) => {
    if (typeof props === 'string') {
      toast.info(<CToastSuccess message={props} />, opts)
    } else {
      toast.info(<CToastSuccess {...props} />, opts)
    }
  },
  warning: (
    props: { title: string; message: string } | string,
    opts?: ToastOptions
  ) => {
    if (typeof props === 'string') {
      toast.warning(<CToastSuccess message={props} />, opts)
    } else {
      toast.warning(<CToastSuccess {...props} />, opts)
    }
  },
}
