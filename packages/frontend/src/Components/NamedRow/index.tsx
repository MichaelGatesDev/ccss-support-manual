import "./style.scss";

import React, { } from "react";

interface Props {
  id?: string;
  columns: Column[];
  /**
   * Number represents header size (1-6)
   * e.g. H1, H2, H3
   */
  headerType?: number; // 1 - 6
}

interface Column {
  title: string;
  content: JSX.Element;
}

export const NamedRow = (props: Props) => {
  const {
    id,
    columns,
    headerType,
  } = props;

  const mapped = columns.map((column) => (
    <div className="col">
      <div className="row">
        <div className="col">
          {headerType === undefined && <span>{column.title}</span>}
          {headerType === 1 && <h1>{column.title}</h1>}
          {headerType === 2 && <h2>{column.title}</h2>}
          {headerType === 3 && <h3>{column.title}</h3>}
          {headerType === 4 && <h4>{column.title}</h4>}
          {headerType === 5 && <h5>{column.title}</h5>}
          {headerType === 6 && <h6>{column.title}</h6>}
        </div>
      </div>
      <div className="row">
        <div className="col">
          {column.content}
        </div>
      </div>
    </div>
  ));

  return (
    <div className="row" id={id}>
      {mapped}
    </div>
  );
};
