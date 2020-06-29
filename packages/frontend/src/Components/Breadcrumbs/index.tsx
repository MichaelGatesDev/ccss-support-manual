import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import "./style.scss";

export default () => {
  const history = useHistory();
  const [path, setPath] = useState<string>(history.location.pathname);

  history.listen(location => {
    setPath(location.pathname);
  });

  if (path == "/") return null;

  const extractPartsFromPath = (path: string) => {
    if (path == "/") return [""];
    const split = path.split(/\//);
    return split;
  };

  const constructURLTrail = (parts: string[], part: string) => {
    if (part == "") return "/";
    let result = "";
    let idxOfPart = parts.indexOf(part);
    for (let i = 0; i < parts.length; i++) {
      const value = parts[i];
      console.log(value);
      if (i <= idxOfPart) {
        result += value == "" ? "" : "/" + value;
      }
    }
    return result;
  };

  const parts = extractPartsFromPath(path);
  return (
    <nav aria-label="breadcrumb" id="breadcrumbs">
      <ol className="breadcrumb">
        {parts.map((segment: string, idx: number) => {
          return (
            <li className={"breadcrumb-item " + (idx == parts.length - 1 ? "active" : "")}>
              <Link to={constructURLTrail(parts, segment)}>{segment == "" ? "home" : segment}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
