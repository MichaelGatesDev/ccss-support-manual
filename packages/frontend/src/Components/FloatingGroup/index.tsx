import "./style.scss";

import React, { ReactNode } from "react";
import shortid from "shortid";

export enum FloatingGroupOrientation {
  Horizontal,
  Vertical,
}

interface Props {
  children?: ReactNode;

  orientation: FloatingGroupOrientation;
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
}

export const FloatingGroup = (props: Props) => {

  const {
    children,
    orientation,
    top,
    right,
    bottom,
    left,
  } = props;

  let classes = "";
  classes += top ? "top " : "";
  classes += right ? "right " : "";
  classes += bottom ? "bottom " : "";
  classes += left ? "left " : "";
  classes += orientation === FloatingGroupOrientation.Horizontal ? "horizontal " : "vertical ";

  return (
    <div className={
      `FloatingGroup-Component ${classes}`
    }
    >
      {children}
    </div>
  );
};
