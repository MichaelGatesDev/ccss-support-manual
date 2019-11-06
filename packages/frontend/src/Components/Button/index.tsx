import "./style.scss";

import React, { Component } from "react";

interface Props {
  disabled?: boolean;
  preventDefault: boolean;
  title: string;
  onClick?: () => void;
}

interface State {
}

class Button extends Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
    };

    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
  }

  onClick(e: React.MouseEvent<HTMLInputElement>) {
    const { preventDefault, onClick } = this.props;
    if (preventDefault) {
      e.preventDefault();
    }
    if (onClick !== undefined) {
      onClick();
    }
  }

  render() {
    const { title, disabled } = this.props;
    return (
      <div className="Button-Component">
        <input
          disabled={disabled}
          type="button"
          value={title}
          onClick={this.onClick}
          className="btn btn-primary btn-block"
        />
      </div>
    );
  }
}

export default Button;
