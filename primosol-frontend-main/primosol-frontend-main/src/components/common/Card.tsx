import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className, ...rest }) => {
  return (
    <div
      className={`flex bg-mid-gray border border-light-gray ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
