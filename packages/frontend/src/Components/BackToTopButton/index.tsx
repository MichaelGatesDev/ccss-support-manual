import React, { Component } from "react";
import posed, { PoseGroup } from "react-pose";
// import shortid from "shortid";

import "./style.scss";

interface Props {
  minScrollAmt: number;
  preventDefault?: boolean;
}

interface State {
  visible: boolean;
}

const BackToTopButtonDiv = posed.div({
  exit: { opacity: 0 },
  enter: { opacity: 1 },
});

export default class BackToTopButton extends Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      visible: false,
    };

    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  onClick(e: React.MouseEvent) {
    const { preventDefault } = this.props;
    if (preventDefault) {
      e.preventDefault();
    }
    window.scrollTo(0, 0);
  }

  handleScroll = () => {
    const { minScrollAmt } = this.props;
    const currentScrollAmt = window.scrollY;
    this.setState({ visible: currentScrollAmt > minScrollAmt });
  };

  render() {
    const { visible } = this.state;
    // if (!visible) return null;
    return (
      <PoseGroup flipMove={false}>
        {
          visible &&
          (
            <BackToTopButtonDiv className="BackToTopButton-Component" key="back-to-top-button">
              <button
                id="backToTop"
                type="submit"
                className="btn btn-primary"
                onClick={this.onClick}
                data-toggle="tooltip"
                title="Back to Top"
              >
                <span>
                  <i className="fas fa-arrow-alt-circle-up" />
                </span>
              </button>
            </BackToTopButtonDiv>
          )
        }
      </PoseGroup>
    );
  }
}
