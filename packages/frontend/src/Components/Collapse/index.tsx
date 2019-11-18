import "./style.scss";

import React, { ReactNode } from "react";

interface CollapseProps {
  id: string;
  children?: ReactNode;
}

export const Collapse = (props: CollapseProps) => {
  const {
    id,
    children,
  } = props;
  return (
    <div className="Collapse-Component">
      <div className="accordion" id={id}>
        {children}
      </div>
    </div>
  );
};

interface CollapseCardProps {
  title: string;
  id: string;
  headingID: string;
  parentID: string;
  show?: boolean;
  children?: ReactNode;
}

export const CollapseCard = (props: CollapseCardProps) => {
  const {
    title,
    id,
    headingID,
    parentID,
    show,
    children,
  } = props;
  return (
    <div className="card" id={id}>
      <div className="card-header" id={headingID}>
        <h2 className="mb-0">
          <button className="btn btn-link" type="button" data-toggle="collapse" data-target={`#${id}`} aria-expanded="false" aria-controls={id}>
            {title}
          </button>
        </h2>
      </div>
      <div id={id} className={`collapse ${(show ? "show " : "")}`} aria-labelledby={headingID} data-parent={`#${parentID}`}>
        <div className="card-body">
          {children}
        </div>
      </div>
    </div>
  );
};
