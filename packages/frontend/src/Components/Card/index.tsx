import "./style.scss";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  className?: string;
  hoverEffect?: HoverEffect;

  width: string;

  wrappedURL?: string;

  header?: ReactNode;
  img?: string;
  title?: string;
  body?: ReactNode;
  footer?: ReactNode;
}

export enum HoverEffect {
  /**
   * Makes images grayscaled and on-hover they return to color
   */
  Grayscale,
}

export const Card = (props: Props) => {

  const {
    className,
    hoverEffect,

    width,

    wrappedURL,

    header,
    img,
    title,
    body,
    footer,
  } = props;

  const hoverClass = hoverEffect !== undefined ? HoverEffect[hoverEffect].toLowerCase() : "";

  return (
    <div className={`Card-Component card mb-4 text-center ${className} ${hoverClass}`} style={{ minWidth: width, maxWidth: width }}>
      {/* Header */}
      {
        header !== undefined && (
          <div className="card-header py-1 text-center">{header}</div>
        )
      }
      {/* Image */}
      <img src={img} className="card-img-top" alt="" style={{ width: "100%", height: "200px", objectFit: "cover" }} />
      {/* Body */}
      {(title !== undefined || body !== undefined) && (
        <div className="card-body">
          {/* Title */}
          <h5 className="card-title mb-0">{title}</h5>
          {/* Body */}
          {body !== undefined && body}
        </div>
      )}
      {/* Footer */}
      {
        footer !== undefined && (
          <div className="card-footer">{footer}</div>
        )
      }
      {/* URL to wrap */}
      {
        wrappedURL !== undefined &&
        <Link to={wrappedURL} className="stretched-link" />
      }
    </div>
  );
};
