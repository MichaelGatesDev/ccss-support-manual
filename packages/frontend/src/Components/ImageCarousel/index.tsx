import "./style.scss";

import React, { PureComponent } from "react";
import shortid from "shortid";


interface Props {
  id: string;
  images: string[];
  height: string; // e.g. 100px
}

interface State {
}

export default class ImageCarousel extends PureComponent<Props, State> {
  render() {
    const { images, id, height } = this.props;

    const indicators = images.map((image, index) => (
      <li data-target={`#${id}`} data-slide-to={index} className={index === 0 ? "active" : ""} key={shortid.generate()} />
    ), this);

    const items = images.map((image, index) => (
      <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={shortid.generate()}>
        <img
          className="d-block"
          src={`/${image}`}
          style={{ height }}
          alt=""
        />
      </div>
    ), this);

    return (
      <div className="ImageCarousel-Component">
        <div id={id} className="carousel slide" data-ride="carousel">
          {
            indicators.length > 1 &&
            (
              <ol className="carousel-indicators">
                {
                  indicators
                }
              </ol>
            )
          }
          <div className="carousel-inner">
            {
              items
            }
          </div>
          {
            images.length > 1 &&
            (
              <>
                <a className="carousel-control-prev" href={`#${id}`} role="button" data-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true" />
                  <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href={`#${id}`} role="button" data-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true" />
                  <span className="sr-only">Next</span>
                </a>
              </>
            )
          }
        </div>
      </div>
    );
  }
}
