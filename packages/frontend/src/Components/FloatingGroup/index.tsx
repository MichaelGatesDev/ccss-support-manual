import "./style.scss";

import React from "react";
import shortid from "shortid";

export enum FloatingGroupOrientation {
  Horizontal,
  Vertical,
}

interface Props {
  children?: any;

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


  const mapped = children.map((child: any) => (
    <div key={shortid.generate()}>
      {child}
    </div>
  ));

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
      {mapped}
    </div>
  );
};
