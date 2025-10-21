import React from "react";
import { Checkbox, Radio } from "antd";
import { AnswerOptionProps } from "../../types";
import { EXAM_STYLES } from "../../constants";

const AnswerOption: React.FC<AnswerOptionProps> = ({
  answer,
  index,
  isSelected,
  isMultiple = false,
  onSelect,
}) => {
  const letter = String.fromCharCode(65 + index);
  if (isMultiple) {
    return (
      <div
        className={`w-full px-3 py-1 !rounded-[12px] border-2 transition-all duration-200 ${
          isSelected
            ? "!border-[#6392e9] !bg-[#f8f9ff]"
            : "border-[#c4c4c4] !hover:border-[#6392e9] hover:bg-[#f8f9ff]"
        }`}
      >
        <Checkbox
          checked={isSelected}
          onChange={onSelect}
          className="w-full"
        >
          <div className="flex items-center">
            <span className="font-bold mr-4 text-[20px] text-black">
              {letter}.
            </span>
            <span className="text-[18px] leading-relaxed text-black">
              {answer.content}
            </span>
          </div>
        </Checkbox>
      </div>
    );
  }

  return (
    <div className="w-full px-3 py-1 !rounded-[12px] border-2 transition-all duration-200">
      <Radio
        checked={isSelected}
        onChange={onSelect}
        className="w-full"
      >
        <div className="flex items-center">
          <span
            className={`font-bold mr-4 text-[20px] ${
              isSelected ? "!text-blue" : "!text-black"
            }`}
          >
            {letter}.
          </span>
          <span
            className={`text-[18px] leading-relaxed ${
              isSelected ? "!text-blue" : "!text-black"
            }`}
          >
            {answer.content}
          </span>
        </div>
      </Radio>
    </div>
  );
};

export default AnswerOption;
