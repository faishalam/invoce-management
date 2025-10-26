import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Info, AlertTriangle, HelpCircle } from "lucide-react";

type ModalType = "warning" | "info" | "confirm";

interface ModalConfig {
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  message?: string | ReactNode;
  title?: string;
  cancelText?: string;
  confirmText?: string;
  type?: ModalType;
  hideCancelButton?: boolean;
}

interface ModalState
  extends Required<Omit<ModalConfig, "onConfirm" | "onCancel">> {
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: (() => void | Promise<void>) | null;
  onCancel: (() => void) | null;
}

interface ModalContextType {
  open: (config: ModalConfig) => void;
  close: () => void;
}

const ModalWarningInfoContext = createContext<ModalContextType | undefined>(
  undefined
);

const defaultState: ModalState = {
  isOpen: false,
  isLoading: false,
  onConfirm: null,
  onCancel: null,
  message: "Are you sure?",
  title: "Confirmation",
  cancelText: "Cancel",
  confirmText: "Confirm",
  type: "confirm",
  hideCancelButton: false,
};

const modalConfig = {
  warning: {
    title: "Warning",
    confirmText: "Continue",
    icon: AlertTriangle,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    confirmColor: "error" as const,
  },
  info: {
    title: "Information",
    confirmText: "OK",
    icon: Info,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    confirmColor: "primary" as const,
  },
  confirm: {
    title: "Confirmation",
    confirmText: "Confirm",
    icon: HelpCircle,
    iconColor: "text-gray-600",
    iconBg: "bg-gray-50",
    confirmColor: "primary" as const,
  },
};

export const ModalWarningInfoProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<ModalState>(defaultState);

  const open = useCallback((config: ModalConfig) => {
    const typeConfig = modalConfig[config.type || "confirm"];

    setState({
      isOpen: true,
      isLoading: false,
      onConfirm: config.onConfirm || null,
      onCancel: config.onCancel || null,
      message: config.message || "Are you sure?",
      title: config.title || typeConfig.title,
      cancelText: config.cancelText || "Cancel",
      confirmText: config.confirmText || typeConfig.confirmText,
      type: config.type || "confirm",
      hideCancelButton: config.hideCancelButton || false,
    });
  }, []);

  const close = useCallback(() => {
    setState(defaultState);
  }, []);

  const handleCancel = useCallback(() => {
    state.onCancel?.();
    close();
  }, [state.onCancel, close]);

  const handleConfirm = useCallback(async () => {
    if (!state.onConfirm) {
      close();
      return;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      await Promise.resolve(state.onConfirm());
      close();
    } catch (error) {
      console.error("Error in modal confirm:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [state.onConfirm, close]);

  const config = modalConfig[state.type];
  const Icon = config.icon;

  return (
    <ModalWarningInfoContext.Provider value={{ open, close }}>
      {children}
      <Dialog
        open={state.isOpen}
        onClose={handleCancel}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle className="flex items-start gap-3 !pb-2">
          <div className={`p-2 rounded-full ${config.iconBg}`}>
            <Icon className={`w-6 h-6 ${config.iconColor}`} />
          </div>
          <div className="flex-1 pt-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {state.title}
            </h3>
          </div>
        </DialogTitle>

        <DialogContent className="!pt-2">
          <div className="text-sm text-gray-600 leading-relaxed">
            {state.message}
          </div>
        </DialogContent>

        <DialogActions className="!px-6 !pb-4">
          {!state.hideCancelButton && (
            <Button
              onClick={handleCancel}
              disabled={state.isLoading}
              variant="outlined"
              color="inherit"
              sx={{ textTransform: "none" }}
            >
              {state.cancelText}
            </Button>
          )}

          {state.type !== "info" && (
            <Button
              onClick={handleConfirm}
              disabled={state.isLoading}
              variant="contained"
              color={config.confirmColor}
              sx={{ textTransform: "none" }}
            >
              {state.isLoading ? "Processing..." : state.confirmText}
            </Button>
          )}

          {state.type === "info" && (
            <Button
              onClick={close}
              disabled={state.isLoading}
              variant="contained"
              color={config.confirmColor}
              sx={{ textTransform: "none" }}
            >
              {state.confirmText}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </ModalWarningInfoContext.Provider>
  );
};

export const useModalWarningInfo = (): ModalContextType => {
  const context = useContext(ModalWarningInfoContext);
  if (!context) {
    throw new Error(
      "useModalWarningInfo must be used within a ModalWarningInfoProvider"
    );
  }
  return context;
};
