import React, { Component } from "react";
import posed, { PoseGroup } from "react-pose";

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
    return (
      <PoseGroup>
        {visible && [
          <BackToTopButtonDiv className="BackToTopButton-Component" key="BackToTopButton">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={this.onClick}
              data-toggle="tooltip"
              title="Back to Top"
            >
              {/* eslint jsx-a11y/label-has-associated-control: 0 */}
              {/* eslint jsx-a11y/label-has-for: 0 */}
              <label htmlFor="backToTop"><i className="fas fa-arrow-alt-circle-up" /></label>
            </button>
          </BackToTopButtonDiv>,
        ]}
      </PoseGroup>
    );
  }
}
