import React, { useState } from "react";

interface DecimalInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
  placeholder?: string;
  value?: string | number | readonly string[];
  required?: boolean;
}

export default function DecimalInput(props: DecimalInputProps) {
  const { onChange, type = "text", ...rest } = props;
  const [prevValue, setPrevValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    const value = e.target.value;

    // Regex to allow only numbers, commas for decimals, and periods for thousand separators
    if (
      value.length < prevValue.length &&
      value.charAt(value.length - 1) === ","
    ) {
      e.target.value = value.slice(0, length - 1);
      console.log(value);
      setPrevValue(value);
      onChange(e);
    } else if (value === "" || /^\d{1,5}(,\d{0,2})?$/.test(value)) {
      setPrevValue(value);
      onChange(e);
    } else if (/^\d{5}\d/.test(value)) {
      const decimal = value.slice(5);
      const newValue = value.substring(0, 5) + "," + decimal;
      e.target.value = newValue;

      setPrevValue(newValue);
      onChange(e);
    }
  };

  return (
    <input
      type={type}
      onChange={handleChange}
      placeholder="0,00"
      inputMode="decimal"
      {...rest}
    />
  );
}
