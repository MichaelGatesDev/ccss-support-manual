import React, { useState, useEffect } from "react";

interface Props {
  id: string;
  name?: string;
  checked: boolean;
  disabled?: boolean;

  title?: string;
  titleLeft?: boolean;
  titleRight?: boolean;

  onChange?: (checked: boolean) => void;
}

export const LabeledCheckBox = (props: Props) => {
  useEffect(() => {}, []);

  const {
    id,
    name,
    checked,
    disabled,

    title,
    titleLeft,
    titleRight,

    onChange,
  } = props;

  const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange === undefined) return;
    onChange(event.target.checked);
  };

  return (
    <div className="Component-LabeledCheckBox">
      <label htmlFor={id} className="form-check-label">
        {titleLeft && title}
        <input type="checkbox" name={name} id={id} onChange={inputChange} className="form-check-input" checked={checked} disabled={disabled} />
        {titleRight && title}
      </label>
    </div>
  );
};
