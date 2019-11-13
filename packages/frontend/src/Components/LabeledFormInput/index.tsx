import "./style.scss";

import React, { useEffect } from "react";

interface Props {
  id: string;
  name?: string;

  placeholder?: string;
  value: string;

  disabled?: boolean;

  title?: string;
  titleLeft?: boolean;
  titleRight?: boolean;

  onChange: (newValue: string) => void;
}

export const LabeledFormInput = (props: Props) => {

  useEffect(() => {
  }, []);

  const {
    id,
    name,

    placeholder,
    value,

    disabled,

    title,
    titleLeft,
    titleRight,

    onChange,
  } = props;

  const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange === undefined) return;
    onChange(event.target.value);
  };

  return (
    <div className="Component-LabeledFormInput">
      <label htmlFor={id} className="form-check-label">
        {titleLeft && title}
        <input
          name={name}
          id={id}
          type="text"
          className="form-control"
          placeholder={placeholder}
          onChange={inputChange}
          value={value}
          disabled={disabled}
        />
        {titleRight && title}
      </label>
    </div>
  );
};
