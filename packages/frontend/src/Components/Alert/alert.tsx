import "./style.scss";

import React, { ReactNode } from "react";
import $ from "jquery";
import "bootstrap";

export enum AlertType {
  Primary,
  Secondary,
  Success,
  Danger,
  Info,
  Warning,
  Light,
  Dark,
}

interface Props {
  id: string;
  alertType: AlertType;

  closeable?: boolean;
  onClose?: () => void;

  timeout?: number;
  onTimeout?: () => void;

  children?: ReactNode;
}

export const Alert = (props: Props) => {
  const {
    id,
    alertType,

    closeable,
    onClose,

    timeout,
    onTimeout,

    children,
  } = props;

  $(`#${id}`).on("closed.bs.alert", () => {
    if (onClose !== undefined) onClose();
  });

  if (timeout !== undefined && timeout > 0) {
    setTimeout(() => {
      $(`#${id}`).alert("close");
      if (onTimeout !== undefined) onTimeout();
    }, timeout);
  }

  return (
    <div
      className={`alert alert-${AlertType[alertType].toLowerCase()} ${
        closeable ? "alert-dismissible fade show" : ""
      } `}
      role="alert"
      id={id}
    >
      {children}
      {closeable && (
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      )}
    </div>
  );
};
