import React, { ReactNode, ButtonHTMLAttributes } from "react";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ children, className, ...rest }) => {
  return (
    <button
      className={`flex items-center justify-center rounded-full bg-semi-black text-primary uppercase text-button-size px-[20px] py-[10px] font-bold cursor-pointer backdrop-blur-sm active:scale-[97%] hover:scale-[104%] transition-all hover:border-border-hover hover:text-white select-none outline-none border border-border hover:bg-semi-white ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default ActionButton;
