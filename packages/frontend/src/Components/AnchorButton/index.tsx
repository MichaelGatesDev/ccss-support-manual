import "./style.scss";

import React, { ReactNode } from "react";

interface Props {
  href: string;
  disabled?: boolean;

  vertical?: boolean;

  children?: ReactNode;
}


export const AnchorButton = (props: Props) => {

  const {
    href,
    children,
    vertical,
    disabled,
  } = props;

  const orientation = vertical ? "vertical" : "horizontal";

  return (
    <div className="AnchorButton-Component">
      <a
        className={`btn btn-primary ${(disabled ? "disabled" : "")} ${orientation}`}
        href={href}
        role="button"
      >
        {children}
      </a>
    </div>
  );
};
