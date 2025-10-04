"use client"
// import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface ButtonSubmitProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  btnText?: string | undefined;
  disabled?: boolean | undefined;
  classname?: string;
  btnLoading?: boolean | undefined;
  iconOnly?: boolean | undefined;
  btnIcon?: React.ReactNode;
  showing?: boolean | undefined;
}

export default function ButtonSubmit({
  type,
  onClick,
  btnText,
  disabled,
  classname,
  btnLoading,
  iconOnly,
  btnIcon,
  showing,
}: ButtonSubmitProps) {
  const isShowing = showing === undefined ? true : showing;
  const handleOnClick = () => {
    if (onClick) onClick();
  };

  return (
    isShowing && (
      <button
        type={type ?? "button"}
        disabled={btnLoading || disabled}
        className={
          btnLoading
            ? "bg-green-800 rounded p-2 disabled:grayscale-0 disabled:cursor-progress w-full"
            : classname ?? "btn-primary"
        }
        onClick={handleOnClick}
      >
        {btnLoading && (
          <div className="w-5 h-5 mx-auto animate-spin">
            {/* <AiOutlineLoading3Quarters
              className="w-full h-full object-contain"
              color="white"
            /> */}
          </div>
        )}

        {!btnLoading && (
          <div className="flex justify-center items-center gap-x-1">
            {btnIcon ?? ""}
            {!iconOnly ? (
              btnText
            ) : (
              <span className="sr-only">Button Input</span>
            )}
          </div>
        )}
      </button>
    )
  );
}
