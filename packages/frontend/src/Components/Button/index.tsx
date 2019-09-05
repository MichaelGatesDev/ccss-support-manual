import React, { Component } from "react";

import "./Button.scss";

interface Props {
  preventDefault: boolean;
  title: string;
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
    const { preventDefault } = this.props;
    if (preventDefault) {
      e.preventDefault();
    }
  }

  render() {
    const { title } = this.props;
    return (
      <div className="Button-Component">
        <input
          type="button"
          value={title}
          onClick={this.onClick}
        />
      </div>
    );
  }
}

export default Button;
