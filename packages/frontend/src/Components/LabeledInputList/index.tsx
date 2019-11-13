import "./style.scss";

import React, { useEffect, useState } from "react";
import Button from "../Button";

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
    if (newValues.length <= 1) return; // leave at least 1 input
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

      {titleLeft && title}

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
                      preventDefault
                      onClick={removeItem.bind(null, index)}
                    >
                      <span>
                        <i className="fas fa-minus-circle" />

                      </span>
                    </Button>
                  )
                }
              </li>
            ))
          }
        </ul>
      )}

      {titleRight && title}

      <Button
        preventDefault
        onClick={addItem}
      >
        <span>
          <i className="fas fa-plus-circle" />
          Add
        </span>
      </Button>

    </div>
  );
};
