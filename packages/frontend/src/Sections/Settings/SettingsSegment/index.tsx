import "./style.scss";

import React, { } from "react";

interface Props {
  id?: string;
  segmentTitle: string;
  segmentContent: any;
}

export const SettingsSegment = (props: Props) => {
  const {
    id,
    segmentTitle,
    segmentContent,
  } = props;

  return (
    <div className="Component-SettingsSegment row segment" id={id}>
      <div className="col">
        {/* Header */}
        <div className="row">
          <div className="col">
            <h3>{segmentTitle}</h3>
          </div>
        </div>
        {/* Content */}
        {segmentContent}
      </div>
    </div>
  );
};
