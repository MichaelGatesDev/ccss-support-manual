import "./style.scss";

import React, { ReactNode } from "react";

export enum ButtonType {
  Primary,
  Secondary,
  Success,
  Danger,
  Info,
  Warning,
  Light,
  Dark,
}

interface Props {
  disabled?: boolean;
  preventDefault: boolean;

  buttonType: ButtonType;
  fullWidth?: boolean;
  vertical?: boolean;

  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;

  children?: ReactNode;
}

const Button: React.FunctionComponent<Props> = (props: Props) => {
  const {
    disabled,
    preventDefault,

    buttonType,
    fullWidth,
    vertical,

    onClick,

    children,
  } = props;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (preventDefault) e.preventDefault();
    if (onClick !== undefined) onClick(e);
  };

  const orientation = vertical ? "vertical" : "horizontal";

  return (
    <div className={`Button-Component ${fullWidth ? "full-width " : ""}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className={`btn btn-${ButtonType[buttonType].toLowerCase()} ${fullWidth ? "btn-block" : ""} ${orientation} ${disabled ? "disabled" : ""}`}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
