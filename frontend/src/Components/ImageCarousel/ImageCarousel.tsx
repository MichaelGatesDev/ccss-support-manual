import * as React from 'react';
import { Component, Fragment } from 'react';

import './ImageCarousel.scss';

interface Props {
    id: string;
    images: string[];
    height: string; // 100px
}

interface State {

}

class ImageCarousel extends Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
    }

    render() {

        var indicators = this.props.images.map((_image, index) => {
            return (
                <li data-target={"#" + this.props.id} data-slide-to={index} className={index === 0 ? 'active' : ''} key={index}></li>
            );
        }, this);

        var items = this.props.images.map((image, index) => {
            return (
                <div className={"carousel-item " + (index === 0 ? 'active' : '')} key={index}>
                    <img
                        className="d-block"
                        src={"/" + image}
                        style={{ height: this.props.height }}
                        alt=""
                    />
                </div>
            );
        }, this);

        return (
            <div className="ImageCarousel-Component">
                <div id={this.props.id} className="carousel slide" data-ride="carousel">
                    {
                        indicators.length > 1 &&
                        <ol className="carousel-indicators">
                            {
                                indicators
                            }
                        </ol>
                    }
                    <div className="carousel-inner">
                        {
                            items
                        }
                    </div>
                    {this.props.images.length > 1 &&
                        <Fragment>
                            <a className="carousel-control-prev" href={"#" + this.props.id} role="button" data-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="sr-only">Previous</span>
                            </a>
                            <a className="carousel-control-next" href={"#" + this.props.id} role="button" data-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="sr-only">Next</span>
                            </a>
                        </Fragment>
                    }
                </div>
            </div>
        );
    }
}

export default ImageCarousel;
