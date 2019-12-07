import "./style.scss";

import React, { ReactNode } from "react";
import { ButtonType } from "../Button";

interface Props {
  href: string;
  disabled?: boolean;

  buttonType: ButtonType;
  fullWidth?: boolean;
  vertical?: boolean;

  children?: ReactNode;
}


export const AnchorButton = (props: Props) => {

  const {
    href,
    disabled,

    buttonType,
    fullWidth,
    vertical,

    children,
  } = props;

  const orientation = vertical ? "vertical" : "horizontal";

  return (
    <div className="AnchorButton-Component">
      <a
        className={`btn btn-${ButtonType[buttonType].toLowerCase()} ${(fullWidth ? "btn-block " : "")} ${orientation} ${(disabled ? "disabled" : "")}`}
        href={href}
        role="button"
      >
        {children}
      </a>
    </div>
  );
};
