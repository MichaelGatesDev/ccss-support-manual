import React, { PureComponent } from "react";

interface Props {
  multiple?: boolean;
  types?: string[];
  onSelect: (selected?: File | FileList) => void;
}

interface State {
}

export default class FileSelect extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { target } = event;
    if (target === null) return;
    const { files } = event.target;
    if (files === null || files.length === 0) return;
    const { onSelect } = this.props;
    onSelect(files.length === 1 ? files[0] : files);
  };

  render() {
    const { types, multiple } = this.props;

    let accept;
    if (types !== undefined) {
      const mappedTypes = types.map(type => `.${type}`);
      accept = mappedTypes.join(", ");
    }

    return (
      <div className="FileSelect-Component">
        <input
          type="file"
          multiple={multiple}
          className="form-control-file"
          accept={accept}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
