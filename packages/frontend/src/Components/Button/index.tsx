import React, { Component } from "react";

import "./style.scss";

interface Props {
  disabled?: boolean;
  preventDefault: boolean;
  title: string;
  onClick?: Function;
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
      onClick(e);
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
        />
      </div>
    );
  }
}

export default Button;
