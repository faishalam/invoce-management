import React, { createContext, useState, useContext, ReactNode } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'

type TArg = {
  onConfirm?: () => void
  onCancel?: () => void
  message?: string | React.ReactNode
  title?: string
  overWriteCancelText?: string
  overWriteConfirmText?: string
  type?: 'warning' | 'info' | 'confirm'
}
type ModalWarningInfoContextType = {
  open: (arg: TArg) => void
}

const ModalWarningInfoContext = createContext<ModalWarningInfoContextType | undefined>(undefined)

export const ModalWarningInfoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null)
  const [onCancel, setOnCancel] = useState<(() => void) | null>(null)
  const [message, setMessage] = useState<string | React.ReactNode>('Are you sure?')
  const [title, setTitle] = useState('Warning')
  const [cancelText, setCancelText] = useState('Cancel')
  const [confirmText, setConfirmText] = useState('Confirm')
  const [type, setType] = useState<'warning' | 'info' | 'confirm'>('warning')

  const open = (arg: TArg) => {
    const {
      onConfirm: confirmationFn,
      onCancel: cancelFn,
      message: customMessage,
      title: customTitle,
    } = arg
    setOnConfirm(() => confirmationFn)
    setOnCancel(() => () => {
      cancelFn?.()
      setIsOpen(false)
    })
    setTitle(customTitle || 'Warning')
    setMessage(customMessage || 'Are you sure?')
    setCancelText(arg.overWriteCancelText || 'Cancel')
    setConfirmText(arg.overWriteConfirmText || 'Confirm')
    setType(arg.type || 'warning')
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
  }

  return (
    <ModalWarningInfoContext.Provider value={{ open }}>
      {children}
      <Dialog open={isOpen} onClose={close}>
        <DialogTitle className={type === 'confirm' ? '!text-ckbColor !font-bold' : '!font-bold'}>{title}</DialogTitle>
        <hr/>
        <DialogContent>{message}</DialogContent>
        <hr/>
        <DialogActions>
          <Button
            variant="outlined"
            color='inherit'
            onClick={() => {
              onCancel?.()
              close()
            }}
          >
            {cancelText}
          </Button>
          {(type === 'warning' || type === 'confirm') && (
            <Button
              onClick={() => {
                onConfirm?.()
                close()
              }}
              color="error"
              className={type === 'confirm' ? '!bg-ckbColor' : ''}
              variant="contained"
            >
              {confirmText}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </ModalWarningInfoContext.Provider>
  )
}

export const useModalWarningInfo = (): ModalWarningInfoContextType => {
  const context = useContext(ModalWarningInfoContext)
  if (!context) {
    throw new Error('useModalWarningInfo must be used within a ModalWarningInfoProvider')
  }
  return context
}
