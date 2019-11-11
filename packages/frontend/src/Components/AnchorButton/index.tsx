import "./style.scss";

import React from "react";

interface Props {
  href: string;
  content?: JSX.Element;
  disabled?: boolean;
}


export const AnchorButton = (props: Props) => {

  const {
    href,
    content,
    disabled,
  } = props;

  return (
    <div className="AnchorButton-Component">
      <a
        className={`btn btn-primary ${(disabled ? "disabled" : "")}`}
        href={href}
        role="button"
      >
        {content}
      </a>
    </div>
  );
};
