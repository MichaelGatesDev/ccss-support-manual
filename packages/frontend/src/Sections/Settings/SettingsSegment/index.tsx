import "./style.scss";

import React, { ReactNode } from "react";

interface Props {
  id?: string;
  title: string;
  children?: ReactNode;
}

export const SettingsSegment = (props: Props) => {
  const {
    id,
    title,
    children,
  } = props;

  return (
    <div className="Component-SettingsSegment row segment" id={id}>
      <div className="col">
        {/* Header */}
        <div className="row">
          <div className="col">
            <h3>{title}</h3>
          </div>
        </div>
        {/* Content */}
        {children}
      </div>
    </div>
  );
};
