import "./style.scss";
import React, { ReactNode } from "react";

interface Props {
  xsColumns?: number;
  smColumns?: number;
  mdColumns?: number;
  lgColumns?: number;
  xlColumns?: number;
  children?: ReactNode;
}

export const CardDeck = (props: Props) => {
  const {
    xsColumns,
    smColumns,
    mdColumns,
    lgColumns,
    xlColumns,
    children,
  } = props;

  let classes = "row ";
  if (xsColumns != null) classes += `row-cols-xs-${xsColumns}`;
  if (smColumns != null) classes += `row-cols-sm-${smColumns}`;
  if (mdColumns != null) classes += `row-cols-md-${mdColumns}`;
  if (lgColumns != null) classes += `row-cols-lg-${lgColumns}`;
  if (xlColumns != null) classes += `row-cols-xl-${xlColumns}`;

  return (
    <div
      className={`CardDeck-Component row g-4 justify-content-center ${classes}`}
    >
      {children}
    </div>
  );
};
