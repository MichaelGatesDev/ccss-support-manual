import "./style.scss";

import React, { ReactNode } from "react";

interface Props {
  disabled?: boolean;
  preventDefault: boolean;

  fullWidth?: boolean;

  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;

  children?: ReactNode;
}


const Button: React.FunctionComponent<Props> = (props: Props) => {
  const {
    disabled,
    preventDefault,

    fullWidth,

    onClick,

    children,
  } = props;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (preventDefault) e.preventDefault();
    if (onClick !== undefined) onClick(e);
  };

  return (
    <div className={`Button-Component ${(fullWidth ? "full-width " : "")}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className={`btn btn-primary ${(fullWidth ? "btn-block " : "")}`}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
