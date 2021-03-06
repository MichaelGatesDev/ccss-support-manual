import "./style.scss";

import React, { useEffect, useState } from "react";
import Button, { ButtonType } from "../Button";

interface Props {
  id?: string;
  placeholder?: string;
  values: string[];

  title: string;
  titleLeft?: boolean;
  titleRight?: boolean;

  preventZero?: boolean;

  onChange?: (items: string[]) => void;
}

interface State {
  items: any[];
}

export const LabeledInputList = (props: Props) => {

  useEffect(() => {
  }, []);

  const {
    id,
    placeholder,
    values,

    title,
    titleLeft,
    titleRight,

    preventZero,

    onChange,
  } = props;

  const addItem = () => {
    const newValues = [...values, ""];
    if (onChange !== undefined) onChange(newValues);
  };

  const removeItem = (itemIndex: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const newValues = [...values];
    if (preventZero && newValues.length <= 1) return; // leave at least 1 input
    newValues.splice(itemIndex, 1);
    if (onChange !== undefined) onChange(newValues);
  };

  const handleChange = (itemIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newValues = [...values];
    newValues[itemIndex] = event.currentTarget.value;
    if (onChange !== undefined) onChange(newValues);
  };


  return (
    <div className="Component-LabeledInputList" id={id}>

      {titleLeft && <span className="left">{title}</span>}

      {values.length > 0 && (
        <ul>
          {
            values.map((el, index) => (
              /* eslint-disable */
              <li key={`labeled-input-item-${index}`}>
                <input
                  type="text"
                  value={el || ""}
                  onChange={handleChange.bind(null, index)}
                  placeholder={placeholder}
                />
                {
                  (!preventZero || index > 0) &&
                  (
                    <Button
                      buttonType={ButtonType.Danger}
                      preventDefault
                      onClick={removeItem.bind(null, index)}
                    >
                      <span className="py-0">
                        <i className="fas fa-minus-circle" />
                        &nbsp;Remove
                      </span>
                    </Button>
                  )
                }
              </li>
            ))
          }
        </ul>
      )}

      {titleRight && <span className="right">{title}</span>}

      <Button
        buttonType={ButtonType.Secondary}
        preventDefault
        onClick={addItem}
      >
        <span className="py-0">
          <i className="fas fa-plus-circle" />
          &nbsp;Add
        </span>
      </Button>

    </div>
  );
};
