// DropdownSelect.tsx
import React from "react";
import { Select } from "antd";

interface DropdownSelectProps<T> {
  data: T[];
  placeholder: string;
  onChange?: (value: number) => void;
  value?: number;
}

const DropdownSelect = <T extends { id: number; value: string; label: string }>({
  data,
  placeholder,
  onChange,
  value,
}: DropdownSelectProps<T>) => (
  <Select
    placeholder={placeholder}
    onChange={onChange}
    value={value}
    allowClear
  >
    {data.map((item) => (
      <Select.Option key={item.id} value={item.id}>
        {item.label}
      </Select.Option>
    ))}
  </Select>
);

export default DropdownSelect;
