import "./style.scss";
import React, { ReactNode } from "react";

interface Props {
  center?: boolean;

  children?: ReactNode;
}

export const CardDeck = (props: Props) => {

  const {
    center,
    children,
  } = props;

  return (
    <div className="CardDeck-Component">
      <div className={`card-deck ${center ? "justify-content-center" : ""}`}>
        {children}
      </div>
    </div>
  );
};
